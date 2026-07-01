import { Component, computed, ChangeDetectionStrategy, signal, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../core/services/mascota.service';
import { CitaService } from '../../core/services/cita.service';
import { DuenoService } from '../../core/services/dueno.service';
import { AuthService } from '../../core/services/auth.service';
import { AuditService } from '../../core/services/audit.service';
import { ToastService } from '../../core/services/toast.service';
import { EstadoCitaPipe } from '../../shared/pipes/estado-cita.pipe';
import { EspeciePipe } from '../../shared/pipes/especie.pipe';
import { FechaCitaPipe } from '../../shared/pipes/fecha-cita.pipe';
import { CitaProximaDirective } from '../../shared/directives/cita-proxima.directive';
import { EstadoBadgeDirective } from '../../shared/directives/estado-badge.directive';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { RoleBadgeComponent } from '../../shared/components/role-badge/role-badge.component';
import { CLINICA_NOMBRE, CLINICA_HORARIO } from '../../core/constants/app.constants';
import { Cita, EstadoCita } from '../../core/models/cita.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterLink, EstadoCitaPipe, EspeciePipe, FechaCitaPipe,
    CitaProximaDirective, EstadoBadgeDirective, StatCardComponent, RoleBadgeComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  readonly clinicaNombre = CLINICA_NOMBRE;
  readonly clinicaHorario = CLINICA_HORARIO;

  readonly reloj = signal(this.formatearReloj());
  private timer = setInterval(() => this.reloj.set(this.formatearReloj()), 1000);

  readonly totalMascotas = computed(() => this.mascotaService.mascotas().length);
  readonly totalPropietarios = computed(() => this.duenoService.duenos().length);
  readonly citasHoyLista = computed(() => this.citaService.getCitasHoy());
  readonly citasHoy = computed(() => this.citasHoyLista().length);
  readonly citasAtrasadas = computed(() => this.citaService.getCitasAtrasadas());
  readonly proximasCitas = computed(() => this.citaService.getProximasCitas().slice(0, 4));
  readonly ultimasMascotas = computed(() => [...this.mascotaService.mascotas()].slice(-3).reverse());
  readonly nombreUsuario = computed(() => this.auth.nombreUsuario());

  constructor(
    private mascotaService: MascotaService,
    private citaService: CitaService,
    private duenoService: DuenoService,
    private auth: AuthService,
    private audit: AuditService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  cambiarEstado(cita: Cita, estado: EstadoCita): void {
    this.citaService.updateEstado(cita.id, estado);
    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'ACTUALIZAR', `Cita ${cita.nombreMascota} → ${estado}`);
    this.toast.success(`Cita marcada como ${estado}`);
  }

  completarCita(cita: Cita): void {
    this.router.navigate(['/historial', cita.mascotaId], {
      queryParams: { citaId: cita.id, nuevo: '1' }
    });
  }

  private formatearReloj(): string {
    return new Date().toLocaleString('es-PE', {
      weekday: 'long', day: 'numeric', month: 'long',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }

  trackByCitaId(_index: number, cita: { id: string }): string {
    return cita.id;
  }

  trackByMascotaId(_index: number, mascota: { id: string }): string {
    return mascota.id;
  }
}
