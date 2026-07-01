import { Injectable, signal, inject } from '@angular/core';
import { Cita, EstadoCita } from '../models/cita.model';
import { CITAS_INICIALES } from '../constants/seed.data';
import { StorageService } from './storage.service';
import { MascotaService } from './mascota.service';

const STORAGE_KEY = 'pb_citas';
const MAX_CITAS_DIA = 2;

export interface ValidacionCita {
  valido: boolean;
  mensaje?: string;
}

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly mascotaService = inject(MascotaService);
  private readonly _citas = signal<Cita[]>([...CITAS_INICIALES]);

  readonly citas = this._citas.asReadonly();

  constructor(private storage: StorageService) {
    const saved = this.storage.get<Cita[]>(STORAGE_KEY);
    if (saved?.length) this._citas.set(saved);
  }

  getCitas(): Cita[] {
    return this._citas();
  }

  getCitaById(id: string): Cita | undefined {
    return this._citas().find(c => c.id === id);
  }

  getCitasByMascota(mascotaId: string): Cita[] {
    return this._citas().filter(c => c.mascotaId === mascotaId);
  }

  getCitasByFecha(fecha: string): Cita[] {
    return this._citas().filter(c => c.fecha === fecha);
  }

  getCitasFuturasByMascota(mascotaId: string): Cita[] {
    const hoy = new Date().toISOString().split('T')[0];
    return this._citas().filter(
      c => c.mascotaId === mascotaId && c.fecha >= hoy && c.estado !== 'cancelada' && c.estado !== 'completada'
    );
  }

  tieneCitasFuturas(mascotaId: string): boolean {
    return this.getCitasFuturasByMascota(mascotaId).length > 0;
  }

  hayConflictoHorario(fecha: string, hora: string, veterinario: string, excludeId?: string): boolean {
    return this._citas().some(c =>
      c.id !== excludeId &&
      c.fecha === fecha &&
      c.hora === hora &&
      c.veterinario === veterinario &&
      c.estado !== 'cancelada'
    );
  }

  validarNuevaCita(
    cita: Pick<Cita, 'fecha' | 'hora' | 'veterinario' | 'mascotaId'>,
    excludeId?: string
  ): ValidacionCita {
    const hoy = new Date().toISOString().split('T')[0];
    if (cita.fecha < hoy) {
      return { valido: false, mensaje: 'No se pueden agendar citas en fechas pasadas' };
    }
    if (!this.mascotaService.estaActiva(cita.mascotaId)) {
      return { valido: false, mensaje: 'No se pueden agendar citas para pacientes fallecidos' };
    }
    const delDia = this._citas().filter(
      c => c.mascotaId === cita.mascotaId && c.fecha === cita.fecha &&
        c.estado !== 'cancelada' && c.id !== excludeId
    );
    if (delDia.length >= MAX_CITAS_DIA) {
      return { valido: false, mensaje: `Máximo ${MAX_CITAS_DIA} citas activas por mascota el mismo día` };
    }
    if (this.hayConflictoHorario(cita.fecha, cita.hora, cita.veterinario, excludeId)) {
      return { valido: false, mensaje: `${cita.veterinario} ya tiene una cita a las ${cita.hora} ese día` };
    }
    return { valido: true };
  }

  getCitasAtrasadas(): Cita[] {
    const hoy = new Date().toISOString().split('T')[0];
    return this._citas().filter(
      c => c.fecha < hoy && (c.estado === 'pendiente' || c.estado === 'confirmada')
    );
  }

  addCita(cita: Omit<Cita, 'id' | 'fechaCreacion'>): ValidacionCita & { cita?: Cita } {
    const validacion = this.validarNuevaCita(cita);
    if (!validacion.valido) return validacion;

    const nueva: Cita = {
      ...cita,
      id: 'c' + Date.now().toString(),
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    this._citas.update(list => [...list, nueva]);
    this.persist();
    return { valido: true, cita: nueva };
  }

  updateCita(id: string, datos: Partial<Cita>): ValidacionCita {
    const actual = this.getCitaById(id);
    if (!actual) return { valido: false, mensaje: 'Cita no encontrada' };

    const merged = { ...actual, ...datos };
    const validacion = this.validarNuevaCita(merged, id);
    if (!validacion.valido) return validacion;

    this._citas.update(list =>
      list.map(c => c.id === id ? { ...c, ...datos } : c)
    );
    this.persist();
    return { valido: true };
  }

  updateEstado(id: string, estado: EstadoCita): void {
    this._citas.update(list =>
      list.map(c => c.id === id ? { ...c, estado } : c)
    );
    this.persist();
  }

  deleteCita(id: string): void {
    this._citas.update(list => list.filter(c => c.id !== id));
    this.persist();
  }

  getProximasCitas(): Cita[] {
    const hoy = new Date().toISOString().split('T')[0];
    return this._citas()
      .filter(c => c.fecha >= hoy && c.estado !== 'cancelada')
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  }

  getCitasHoy(): Cita[] {
    const hoy = new Date().toISOString().split('T')[0];
    return this._citas()
      .filter(c => c.fecha === hoy && c.estado !== 'cancelada')
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._citas());
  }
}
