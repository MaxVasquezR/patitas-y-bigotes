import { Injectable, signal } from '@angular/core';
import { RegistroHistorial } from '../models/historial.model';
import { HISTORIAL_INICIAL } from '../constants/seed.data';
import { StorageService } from './storage.service';
import { normalizarHistorial } from '../utils/entity-normalizers';

const STORAGE_KEY = 'pb_historial';

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

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._registros());
  }
}
