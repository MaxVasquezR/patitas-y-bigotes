import { Cita, EstadoCita } from '../cita.model';

export class CitaEntity {
  constructor(private readonly data: Cita) {}

  get id(): string { return this.data.id; }
  get fecha(): string { return this.data.fecha; }
  get hora(): string { return this.data.hora; }
  get estado(): EstadoCita { return this.data.estado; }

  puedeConfirmarse(): boolean {
    return this.data.estado === 'pendiente';
  }

  puedeCompletarse(): boolean {
    return this.data.estado === 'confirmada';
  }

  puedeCancelarse(): boolean {
    return this.data.estado !== 'cancelada';
  }

  esProxima(diasLimite = 2): boolean {
    if (this.data.estado === 'cancelada') return false;
    const hoy = new Date();
    const fecha = new Date(this.data.fecha + 'T00:00:00');
    const diffDias = Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias > 0 && diffDias <= diasLimite;
  }

  esHoy(): boolean {
    return this.data.fecha === new Date().toISOString().split('T')[0];
  }

  getClaseEstado(): string {
    return `estado-${this.data.estado}`;
  }

  toJSON(): Cita {
    return { ...this.data };
  }

  static from(data: Cita): CitaEntity {
    return new CitaEntity(data);
  }
}
