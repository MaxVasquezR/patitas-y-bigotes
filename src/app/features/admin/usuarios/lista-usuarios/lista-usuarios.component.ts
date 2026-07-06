import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AuditService } from '../../../../core/services/audit.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UsuarioCredencial } from '../../../../core/models/usuario.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, PageHeaderComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss']
})
export class ListaUsuariosComponent {
  busquedaControl = new FormControl('', { nonNullable: true });
  private busqueda = signal('');

  usuarios = computed(() => {
    const q = this.busqueda().toLowerCase();
    const lista = this.usuarioService.usuarios();
    if (!q) return lista;
    return lista.filter(u =>
      u.username.toLowerCase().includes(q) || u.nombre.toLowerCase().includes(q)
    );
  });

  constructor(
    private usuarioService: UsuarioService,
    private auth: AuthService,
    private audit: AuditService,
    private toast: ToastService
  ) {
    this.busquedaControl.valueChanges.subscribe(v => this.busqueda.set(v));
  }

  labelRol(u: UsuarioCredencial): string {
    return u.rol === 'admin' ? 'Administrador' : 'Asistente';
  }

  toggleActivo(u: UsuarioCredencial): void {
    this.usuarioService.toggleActivo(u.id);
    const s = this.auth.getSesionActual();
    const accion = u.activo ? 'desactivado' : 'activado';
    if (s) this.audit.registrar(s.nombre, s.rol, 'EDITAR', `Usuario ${u.username} ${accion}`);
    this.toast.success(`Usuario ${accion} correctamente`);
  }

  trackByUsuarioId(_index: number, u: { id: string }): string {
    return u.id;
  }
}
