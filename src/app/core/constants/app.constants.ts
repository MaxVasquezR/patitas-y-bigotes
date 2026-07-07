import { EspecieMascota, SexoMascota, EstadoMascota } from '../models/mascota.model';
import { EstadoCita, TipoCita } from '../models/cita.model';

export const CLINICA_NOMBRE = 'Patitas y Bigotes';
export const CLINICA_TAGLINE = 'Clínica Veterinaria';
export const CLINICA_DIRECCION = 'Av. Pardo y Aliaga 456, San Isidro, Lima';
export const CLINICA_TELEFONO = '(01) 442-8890';
export const CLINICA_HORARIO = 'Lun–Sáb 8:00 – 19:00 · Emergencias 24h';

export const ESPECIES: EspecieMascota[] = ['perro', 'gato', 'ave', 'conejo', 'otro'];
export const SEXOS: SexoMascota[] = ['macho', 'hembra'];
export const ESTADOS_MASCOTA: EstadoMascota[] = ['activo', 'en_tratamiento', 'referido', 'fallecido'];
export const MUCOSAS_OPCIONES = ['Rosadas', 'Pálidas', 'Cianóticas', 'Ictéricas', 'Secas'];

export const TIPOS_CITA: TipoCita[] = ['consulta', 'vacuna', 'cirugia', 'control', 'emergencia', 'otro'];
export const ESTADOS_CITA: EstadoCita[] = ['pendiente', 'confirmada', 'completada', 'cancelada'];

export const VETERINARIOS = ['Dra. Lucía Ríos', 'Dr. Pedro Castro', 'Dra. Carmen Vega'];

export const HORAS_DISPONIBLES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const ZOOM_NIVELES = [90, 100, 110, 125, 150] as const;
