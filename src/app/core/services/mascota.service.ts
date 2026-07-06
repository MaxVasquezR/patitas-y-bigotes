import { Injectable, signal } from '@angular/core';
import { Mascota } from '../models/mascota.model';
import { MASCOTAS_INICIALES } from '../constants/seed.data';
import { DuenoService } from './dueno.service';
import { StorageService } from './storage.service';
import { normalizarMascota } from '../utils/entity-normalizers';

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
    return this._mascotas().filter(m => m.duenoId === duenoId);
  }

  addMascota(mascota: Omit<Mascota, 'id' | 'fechaRegistro'>): Mascota {
    if (!this.duenoService.getDuenoById(mascota.duenoId)) {
      throw new Error('No se puede registrar una mascota sin un propietario válido');
    }
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
    this._mascotas.update(list =>
      list.map(m => m.id === id ? normalizarMascota({ ...m, ...datos }) : m)
    );
    this.persist();
  }

  deleteMascota(id: string): void {
    this._mascotas.update(list => list.filter(m => m.id !== id));
    this.persist();
  }

  searchMascotas(query: string): Mascota[] {
    const q = query.toLowerCase();
    return this._mascotas().filter(m => {
      const dueno = this.duenoService.getDuenoById(m.duenoId);
      return (
        m.nombre.toLowerCase().includes(q) ||
        (dueno?.nombre.toLowerCase().includes(q) ?? false) ||
        (dueno?.apellido.toLowerCase().includes(q) ?? false) ||
        m.raza.toLowerCase().includes(q) ||
        (m.microchip?.toLowerCase().includes(q) ?? false) ||
        (dueno?.numeroDocumento.includes(q) ?? false)
      );
    });
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
