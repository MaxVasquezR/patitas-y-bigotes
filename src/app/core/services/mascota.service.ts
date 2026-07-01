import { Injectable, signal } from '@angular/core';
import { Mascota, Dueno } from '../models/mascota.model';
import { MASCOTAS_INICIALES } from '../constants/seed.data';
import { DuenoService } from './dueno.service';
import { StorageService } from './storage.service';
import { normalizarMascota, normalizarDueno } from '../utils/entity-normalizers';

const STORAGE_KEY = 'pb_mascotas';

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private readonly _mascotas = signal<Mascota[]>([...MASCOTAS_INICIALES]);

  readonly mascotas = this._mascotas.asReadonly();

  constructor(
    private duenoService: DuenoService,
    private storage: StorageService
  ) {
    const saved = this.storage.get<Mascota[]>(STORAGE_KEY);
    if (saved?.length) {
      this._mascotas.set(saved.map(m => normalizarMascota(m as Mascota)));
    }
  }

  getMascotas(): Mascota[] {
    return this._mascotas();
  }

  getMascotaById(id: string): Mascota | undefined {
    return this._mascotas().find(m => m.id === id);
  }

  getMascotasByDueno(duenoId: string): Mascota[] {
    return this._mascotas().filter(m => m.dueno.id === duenoId);
  }

  addMascota(mascota: Omit<Mascota, 'id' | 'fechaRegistro'>): Mascota {
    this.duenoService.upsertDueno(mascota.dueno);
    const nueva: Mascota = normalizarMascota({
      ...mascota,
      id: Date.now().toString(),
      fechaRegistro: new Date().toISOString().split('T')[0]
    });
    this._mascotas.update(list => [...list, nueva]);
    this.persist();
    return nueva;
  }

  updateMascota(id: string, datos: Partial<Mascota>): void {
    if (datos.dueno) {
      this.duenoService.upsertDueno(datos.dueno);
      this.syncDuenoEnMascotas(datos.dueno);
    }
    this._mascotas.update(list =>
      list.map(m => m.id === id ? normalizarMascota({ ...m, ...datos }) : m)
    );
    this.persist();
  }

  /** Propaga cambios del propietario a todas sus mascotas */
  syncDuenoEnMascotas(dueno: Dueno): void {
    this._mascotas.update(list =>
      list.map(m => m.dueno.id === dueno.id ? { ...m, dueno: normalizarDueno(dueno) } : m)
    );
    this.persist();
  }

  deleteMascota(id: string): void {
    this._mascotas.update(list => list.filter(m => m.id !== id));
    this.persist();
  }

  searchMascotas(query: string): Mascota[] {
    const q = query.toLowerCase();
    return this._mascotas().filter(m =>
      m.nombre.toLowerCase().includes(q) ||
      m.dueno.nombre.toLowerCase().includes(q) ||
      m.dueno.apellido.toLowerCase().includes(q) ||
      m.raza.toLowerCase().includes(q) ||
      (m.microchip?.toLowerCase().includes(q) ?? false) ||
      m.dueno.numeroDocumento.includes(q)
    );
  }

  countByDueno(duenoId: string): number {
    return this.getMascotasByDueno(duenoId).length;
  }

  estaActiva(mascotaId: string): boolean {
    const m = this.getMascotaById(mascotaId);
    return m ? m.estado !== 'fallecido' : false;
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._mascotas());
  }
}
