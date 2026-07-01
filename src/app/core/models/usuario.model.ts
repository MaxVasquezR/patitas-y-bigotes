export type RolUsuario = 'admin' | 'asistente';

export interface Usuario {
  id: string;
  username: string;
  nombre: string;
  rol: RolUsuario;
  activo: boolean;
}

export interface UsuarioCredencial extends Usuario {
  password: string;
}

export interface SesionUsuario {
  id: string;
  username: string;
  nombre: string;
  rol: RolUsuario;
}
