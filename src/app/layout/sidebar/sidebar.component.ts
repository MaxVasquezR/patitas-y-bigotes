import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CLINICA_NOMBRE, CLINICA_TAGLINE } from '../../core/constants/app.constants';
import { SidebarService } from '../../core/services/sidebar.service';
import { AuthService } from '../../core/services/auth.service';
import { RoleBadgeComponent } from '../../shared/components/role-badge/role-badge.component';
import { SiPermisoDirective } from '../../shared/directives/si-permiso.directive';

interface NavItem {
  ruta: string;
  etiqueta: string;
  icono: string;
  exact?: boolean;
  permiso?: 'auditoria' | 'backup' | 'gestionar_usuarios';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RoleBadgeComponent, SiPermisoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  readonly clinicaNombre = CLINICA_NOMBRE;
  readonly clinicaTagline = CLINICA_TAGLINE;

  private readonly todosNavItems: NavItem[] = [
    { ruta: '/dashboard', etiqueta: 'Panel', icono: 'bi-grid-1x2', exact: true },
    { ruta: '/mascotas', etiqueta: 'Mascotas', icono: 'bi-heart-pulse' },
    { ruta: '/propietarios', etiqueta: 'Propietarios', icono: 'bi-people' },
    { ruta: '/citas', etiqueta: 'Agenda', icono: 'bi-calendar3' },
    { ruta: '/auditoria', etiqueta: 'Auditoría', icono: 'bi-shield-check', permiso: 'auditoria' },
    { ruta: '/admin/datos', etiqueta: 'Datos del sistema', icono: 'bi-database', permiso: 'backup' },
    { ruta: '/usuarios', etiqueta: 'Usuarios', icono: 'bi-person-gear', permiso: 'gestionar_usuarios' }
  ];

  readonly navItems = computed(() =>
    this.todosNavItems.filter(item => !item.permiso || this.auth.tienePermiso(item.permiso))
  );

  constructor(
    readonly sidebarService: SidebarService,
    readonly auth: AuthService
  ) {}

  cerrar(): void {
    this.sidebarService.cerrar();
  }

  logout(): void {
    this.auth.logout();
  }
}
