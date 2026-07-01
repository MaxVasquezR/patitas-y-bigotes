import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DuenoService } from '../../../core/services/dueno.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToastService } from '../../../core/services/toast.service';
import { Dueno } from '../../../core/models/mascota.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { TelefonoPipe } from '../../../shared/pipes/telefono.pipe';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { HighlightHoverDirective } from '../../../shared/directives/highlight-hover.directive';
import { SiPermisoDirective } from '../../../shared/directives/si-permiso.directive';

@Component({
  selector: 'app-lista-propietarios',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    PageHeaderComponent, EmptyStateComponent,
    TelefonoPipe, CapitalizePipe, HighlightHoverDirective, SiPermisoDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lista-propietarios.component.html',
  styleUrls: ['./lista-propietarios.component.scss']
})
export class ListaPropietariosComponent {
  busquedaControl = new FormControl('', { nonNullable: true });
  private busqueda = signal('');

  propietarios = computed(() => {
    this.duenoService.duenos();
    this.mascotaService.mascotas();
    const q = this.busqueda();
    return q ? this.duenoService.searchDuenos(q) : this.duenoService.getDuenos();
  });

  readonly puedeEliminar = computed(() => this.auth.puedeEliminarPropietario());

  constructor(
    private duenoService: DuenoService,
    private mascotaService: MascotaService,
    private auth: AuthService,
    private audit: AuditService,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {
    this.busquedaControl.valueChanges.subscribe(v => this.busqueda.set(v));
  }

  contarMascotas(duenoId: string): number {
    return this.mascotaService.countByDueno(duenoId);
  }

  async eliminar(dueno: Dueno): Promise<void> {
    const mascotas = this.contarMascotas(dueno.id);
    if (mascotas > 0) {
      this.toastService.warning(`No se puede eliminar: ${dueno.nombre} tiene ${mascotas} mascota(s) registrada(s).`);
      return;
    }
    const ok = await this.confirmService.confirm(
      `¿Eliminar a ${dueno.nombre} ${dueno.apellido}?`,
      'Eliminar propietario'
    );
    if (ok) {
      this.duenoService.deleteDueno(dueno.id);
      const s = this.auth.getSesionActual();
      if (s) this.audit.registrar(s.nombre, s.rol, 'ELIMINAR', `Propietario ${dueno.nombre} ${dueno.apellido}`);
      this.toastService.success('Propietario eliminado correctamente');
    }
  }

  trackByDuenoId(_index: number, dueno: Dueno): string {
    return dueno.id;
  }
}
