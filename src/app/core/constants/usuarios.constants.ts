import { UsuarioCredencial } from '../models/usuario.model';

export const USUARIOS_DEMO: UsuarioCredencial[] = [
  {
    id: 'u1',
    username: 'admin',
    password: 'admin123',
    nombre: 'Dra. Carmen Vega',
    rol: 'admin',
    activo: true
  },
  {
    id: 'u2',
    username: 'asistente1',
    password: 'asist123',
    nombre: 'Lucía Ríos',
    rol: 'asistente',
    activo: true
  },
  {
    id: 'u3',
    username: 'asistente2',
    password: 'asist123',
    nombre: 'Pedro Castro',
    rol: 'asistente',
    activo: true
  }
];
