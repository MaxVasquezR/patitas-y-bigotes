import { Injectable, signal } from '@angular/core';
import { RegistroHistorial } from '../models/historial.model';
import { HISTORIAL_INICIAL } from '../constants/seed.data';
import { StorageService } from './storage.service';
import { normalizarHistorial } from '../utils/entity-normalizers';

const STORAGE_KEY = 'pb_historial';
const HORAS_EDICION_ASISTENTE = 24;

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private readonly _registros = signal<RegistroHistorial[]>([...HISTORIAL_INICIAL]);

  readonly registros = this._registros.asReadonly();

  constructor(private storage: StorageService) {
    const saved = this.storage.get<RegistroHistorial[]>(STORAGE_KEY);
    if (saved?.length) {
      this._registros.set(saved.map(r => normalizarHistorial(r)));
    }
  }

  getRegistros(): RegistroHistorial[] {
    return this._registros();
  }

  getRegistroById(id: string): RegistroHistorial | undefined {
    return this._registros().find(r => r.id === id);
  }

  getHistorialByMascota(mascotaId: string): RegistroHistorial[] {
    return this._registros()
      .filter(r => r.mascotaId === mascotaId)
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }

  getEvolucionPeso(mascotaId: string): { fecha: string; peso: number }[] {
    return this.getHistorialByMascota(mascotaId)
      .map(r => ({ fecha: r.fecha, peso: r.peso }))
      .reverse();
  }

  puedeEditarRegistro(registroId: string, esAdmin: boolean): boolean {
    if (esAdmin) return true;
    const r = this.getRegistroById(registroId);
    if (!r) return false;
    const creado = new Date(r.fecha + 'T23:59:59');
    const horas = (Date.now() - creado.getTime()) / 3600000;
    return horas <= HORAS_EDICION_ASISTENTE;
  }

  addRegistro(registro: Omit<RegistroHistorial, 'id'>, creadoPor?: string): RegistroHistorial {
    const nuevo: RegistroHistorial = normalizarHistorial({
      ...registro,
      id: 'h' + Date.now().toString(),
      creadoPor: creadoPor ?? registro.veterinario
    });
    this._registros.update(list => [...list, nuevo]);
    this.persist();
    return nuevo;
  }

  updateRegistro(id: string, datos: Partial<RegistroHistorial>, modificadoPor?: string): void {
    this._registros.update(list =>
      list.map(r => r.id === id ? normalizarHistorial({
        ...r,
        ...datos,
        modificadoPor: modificadoPor ?? datos.veterinario,
        fechaModificacion: new Date().toISOString()
      }) : r)
    );
    this.persist();
  }

  deleteRegistro(id: string): void {
    this._registros.update(list => list.filter(r => r.id !== id));
    this.persist();
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._registros());
  }
}
