export type EstadoCita = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
export type TipoCita = 'consulta' | 'vacuna' | 'cirugia' | 'control' | 'emergencia' | 'otro';

export interface Cita {
  id: string;
  mascotaId: string;
  nombreMascota: string;
  nombreDueno: string;
  telefonoDueno: string;
  fecha: string;
  hora: string;
  tipo: TipoCita;
  motivo: string;
  estado: EstadoCita;
  veterinario: string;
  notas?: string;
  fechaCreacion: string;
}
