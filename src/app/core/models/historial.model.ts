export interface Medicamento {
  nombre: string;
  dosis: string;
  duracion: string;
}

export interface RegistroHistorial {
  id: string;
  mascotaId: string;
  citaId?: string;
  fecha: string;
  veterinario: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  medicamentos: Medicamento[];
  peso: number;
  temperatura?: number;
  frecuenciaCardiaca?: number;
  frecuenciaRespiratoria?: number;
  mucosas?: string;
  observaciones: string;
  proximaVisita?: string;
  creadoPor?: string;
  modificadoPor?: string;
  fechaModificacion?: string;
}
