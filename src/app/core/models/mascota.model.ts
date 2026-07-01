export type EspecieMascota = 'perro' | 'gato' | 'ave' | 'conejo' | 'otro';
export type SexoMascota = 'macho' | 'hembra';
export type TipoDocumento = 'DNI' | 'CE' | 'PASAPORTE';
export type EstadoMascota = 'activo' | 'en_tratamiento' | 'referido' | 'fallecido';

export interface Dueno {
  id: string;
  nombre: string;
  apellido: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  telefono: string;
  telefonoAlt?: string;
  email: string;
  direccion: string;
  distrito: string;
  contactoEmergencia?: string;
  aceptaDatos: boolean;
}

export interface Mascota {
  id: string;
  nombre: string;
  especie: EspecieMascota;
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
  dueno: Dueno;
  foto?: string;
  fechaRegistro: string;
}
