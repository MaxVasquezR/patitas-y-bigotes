import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SesionUsuario, RolUsuario } from '../models/usuario.model';
import { UsuarioService } from './usuario.service';
import { StorageService } from './storage.service';
import { AuditService } from './audit.service';

const SESSION_KEY = 'pb_sesion';

export type Permiso =
  | 'crear'
  | 'editar'
  | 'eliminar'
  | 'cancelar_cita'
  | 'auditoria'
  | 'backup'
  | 'editar_historial_antiguo'
  | 'gestionar_usuarios';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _sesion = signal<SesionUsuario | null>(null);

  readonly sesion = this._sesion.asReadonly();
  readonly isAuthenticated = computed(() => this._sesion() !== null);
  readonly isAdmin = computed(() => this._sesion()?.rol === 'admin');
  readonly isAsistente = computed(() => this._sesion()?.rol === 'asistente');
  readonly nombreUsuario = computed(() => this._sesion()?.nombre ?? '');
  readonly rolLabel = computed(() => this.isAdmin() ? 'Administrador' : 'Asistente');

  constructor(
    private storage: StorageService,
    private audit: AuditService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    const saved = this.storage.getSession<SesionUsuario>(SESSION_KEY);
    if (saved) this._sesion.set(saved);
  }

  login(username: string, password: string): boolean {
    const user = this.usuarioService.findByUsername(username);
    if (!user || user.password !== password || !user.activo) return false;

    const sesion: SesionUsuario = {
      id: user.id,
      username: user.username,
      nombre: user.nombre,
      rol: user.rol
    };
    this._sesion.set(sesion);
    this.storage.setSession(SESSION_KEY, sesion);
    this.audit.registrar(user.nombre, user.rol, 'LOGIN', `Inicio de sesión (${user.username})`);
    return true;
  }

  logout(): void {
    const s = this._sesion();
    if (s) {
      this.audit.registrar(s.nombre, s.rol, 'LOGOUT', 'Cierre de sesión');
    }
    this._sesion.set(null);
    this.storage.removeSession(SESSION_KEY);
    this.router.navigate(['/login']);
  }

  tieneRol(...roles: RolUsuario[]): boolean {
    const rol = this._sesion()?.rol;
    return rol ? roles.includes(rol) : false;
  }

  tienePermiso(permiso: Permiso): boolean {
    const adminOnly: Permiso[] = ['eliminar', 'auditoria', 'backup', 'editar_historial_antiguo', 'gestionar_usuarios'];
    if (adminOnly.includes(permiso)) return this.isAdmin();
    return this.isAuthenticated();
  }

  puedeCrear(): boolean { return this.tienePermiso('crear'); }
  puedeEditar(): boolean { return this.tienePermiso('editar'); }
  puedeEliminar(): boolean { return this.tienePermiso('eliminar'); }
  puedeEliminarPropietario(): boolean { return this.tienePermiso('eliminar'); }
  puedeVerAuditoria(): boolean { return this.tienePermiso('auditoria'); }
  puedeBackup(): boolean { return this.tienePermiso('backup'); }
  puedeCancelarCita(): boolean { return this.tienePermiso('cancelar_cita'); }
  puedeGestionarUsuarios(): boolean { return this.tienePermiso('gestionar_usuarios'); }

  mensajeSinPermiso(accion = 'realizar esta acción'): string {
    return `Solo el administrador puede ${accion}. Su rol actual es: ${this.rolLabel()}.`;
  }

  getSesionActual(): SesionUsuario | null {
    return this._sesion();
  }
}
