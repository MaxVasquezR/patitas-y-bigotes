import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../../core/services/mascota.service';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToastService } from '../../../core/services/toast.service';
import { EspeciePipe } from '../../../shared/pipes/especie.pipe';
import { EdadPipe } from '../../../shared/pipes/edad.pipe';
import { TelefonoPipe } from '../../../shared/pipes/telefono.pipe';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SiPermisoDirective } from '../../../shared/directives/si-permiso.directive';

@Component({
  selector: 'app-lista-mascotas',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    EspeciePipe, EdadPipe, TelefonoPipe,
    PageHeaderComponent, EmptyStateComponent, SiPermisoDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lista-mascotas.component.html',
  styleUrls: ['./lista-mascotas.component.scss']
})
export class ListaMascotasComponent {
  busquedaControl = new FormControl('', { nonNullable: true });
  private busqueda = signal('');

  mascotas = computed(() => {
    this.mascotaService.mascotas();
    const q = this.busqueda();
    return q ? this.mascotaService.searchMascotas(q) : this.mascotaService.getMascotas();
  });

  readonly puedeEliminar = computed(() => this.auth.puedeEliminar());

  constructor(
    private mascotaService: MascotaService,
    private citaService: CitaService,
    private auth: AuthService,
    private audit: AuditService,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {
    this.busquedaControl.valueChanges.subscribe(v => this.busqueda.set(v));
  }

  async eliminar(id: string, nombre: string): Promise<void> {
    if (this.citaService.tieneCitasFuturas(id)) {
      this.toastService.warning(`${nombre} tiene citas futuras. Cancele o complete las citas antes de eliminar.`);
      return;
    }
    const ok = await this.confirmService.confirm(
      `¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`,
      'Eliminar mascota'
    );
    if (ok) {
      this.mascotaService.deleteMascota(id);
      const s = this.auth.getSesionActual();
      if (s) this.audit.registrar(s.nombre, s.rol, 'ELIMINAR', `Mascota ${nombre} eliminada`);
      this.toastService.success(`${nombre} eliminado correctamente`);
    }
  }

  trackByMascotaId(_index: number, mascota: { id: string }): string {
    return mascota.id;
  }
}
