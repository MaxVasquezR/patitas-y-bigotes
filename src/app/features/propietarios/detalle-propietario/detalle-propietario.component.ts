import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DuenoService } from '../../../core/services/dueno.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToastService } from '../../../core/services/toast.service';
import { AuditService } from '../../../core/services/audit.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TelefonoPipe } from '../../../shared/pipes/telefono.pipe';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { EspeciePipe } from '../../../shared/pipes/especie.pipe';
import { EstadoCitaPipe } from '../../../shared/pipes/estado-cita.pipe';
import { EstadoBadgeDirective } from '../../../shared/directives/estado-badge.directive';
import { SiPermisoDirective } from '../../../shared/directives/si-permiso.directive';

@Component({
  selector: 'app-detalle-propietario',
  standalone: true,
  imports: [
    CommonModule, RouterLink, PageHeaderComponent,
    TelefonoPipe, CapitalizePipe, EspeciePipe, EstadoCitaPipe, EstadoBadgeDirective, SiPermisoDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-propietario.component.html',
  styleUrls: ['./detalle-propietario.component.scss']
})
export class DetallePropietarioComponent {
  private propietarioId = signal('');

  readonly propietario = computed(() => this.duenoService.getDuenoById(this.propietarioId()));

  readonly mascotas = computed(() => {
    this.mascotaService.mascotas();
    const id = this.propietarioId();
    return id ? this.mascotaService.getMascotasByDueno(id) : [];
  });

  readonly citas = computed(() => {
    this.citaService.citas();
    const ids = this.mascotas().map(m => m.id);
    return this.citaService.getCitas()
      .filter(c => ids.includes(c.mascotaId))
      .sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora))
      .slice(0, 5);
  });

  readonly puedeEliminar = computed(() => this.auth.puedeEliminarPropietario());

  nombreMascota(mascotaId: string): string {
    return this.mascotaService.getMascotaById(mascotaId)?.nombre ?? '';
  }

  constructor(
    private route: ActivatedRoute,
    private duenoService: DuenoService,
    private mascotaService: MascotaService,
    private citaService: CitaService,
    private auth: AuthService,
    private confirm: ConfirmService,
    private toast: ToastService,
    private audit: AuditService,
    private router: Router
  ) {
    this.propietarioId.set(this.route.snapshot.paramMap.get('id') ?? '');
  }

  async eliminar(): Promise<void> {
    const p = this.propietario();
    if (!p) return;
    if (this.mascotas().length > 0) {
      this.toast.warning('No se puede eliminar: tiene mascotas registradas');
      return;
    }
    const ok = await this.confirm.confirm(`¿Eliminar a ${p.nombre} ${p.apellido}?`, 'Eliminar propietario');
    if (!ok) return;
    this.duenoService.deleteDueno(p.id);
    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'ELIMINAR', `Propietario ${p.nombre} ${p.apellido}`);
    this.toast.success('Propietario eliminado');
    this.router.navigate(['/propietarios']);
  }

  trackByMascotaId(_i: number, m: { id: string }): string {
    return m.id;
  }
}
