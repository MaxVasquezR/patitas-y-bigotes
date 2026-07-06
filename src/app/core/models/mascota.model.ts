export type EspecieMascota = 'perro' | 'gato' | 'ave' | 'conejo' | 'otro';
export type SexoMascota = 'macho' | 'hembra';
export type EstadoMascota = 'activo' | 'en_tratamiento' | 'referido' | 'fallecido';

export interface Dueno {
  id: string;
  nombre: string;
  apellido: string;
  numeroDocumento: string;
  telefono: string;
  email?: string;
  direccion: string;
  distrito: string;
  aceptaDatos: boolean;
}

export interface Mascota {
  id: string;
  nombre: string;
  especie: EspecieMascota;
  otraEspecie?: string;
  raza: string;
  fechaNacimiento: string;
  sexo: SexoMascota;
  peso: number;
  color: string;
  microchip?: string;
  alergias?: string;
  castrado?: boolean;
  estado: EstadoMascota;
  observaciones?: string;
  duenoId: string;
  foto?: string;
  fechaRegistro: string;
}
