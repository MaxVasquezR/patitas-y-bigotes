import { Injectable, signal } from '@angular/core';
import { Dueno } from '../models/mascota.model';
import { DuenoEntity } from '../models/entities/dueno.entity';
import { DUENOS_INICIALES } from '../constants/seed.data';
import { StorageService } from './storage.service';
import { normalizarDueno } from '../utils/entity-normalizers';

const STORAGE_KEY = 'pb_duenos';

@Injectable({ providedIn: 'root' })
export class DuenoService {
  private readonly _duenos = signal<Dueno[]>([...DUENOS_INICIALES]);

  readonly duenos = this._duenos.asReadonly();

  constructor(private storage: StorageService) {
    const saved = this.storage.get<Dueno[]>(STORAGE_KEY);
    if (saved?.length) {
      this._duenos.set(saved.map(d => normalizarDueno(d)));
    }
  }

  getDuenos(): Dueno[] {
    return this._duenos();
  }

  getDuenosEntities(): DuenoEntity[] {
    return this._duenos().map(DuenoEntity.from);
  }

  getDuenoById(id: string): Dueno | undefined {
    return this._duenos().find(d => d.id === id);
  }

  findByDocumento(numero: string): Dueno | undefined {
    const n = numero.trim();
    return this._duenos().find(d => d.numeroDocumento === n);
  }

  findByTelefono(telefono: string): Dueno | undefined {
    const t = telefono.trim();
    return this._duenos().find(d => d.telefono === t);
  }

  existeDuplicado(dueno: Partial<Dueno>, excludeId?: string): string | null {
    const doc = dueno.numeroDocumento?.trim();
    if (doc) {
      const porDoc = this._duenos().find(d => d.numeroDocumento === doc && d.id !== excludeId);
      if (porDoc) return `Ya existe un propietario con documento ${doc}`;
    }
    const tel = dueno.telefono?.trim();
    if (tel) {
      const porTel = this._duenos().find(d => d.telefono === tel && d.id !== excludeId);
      if (porTel) return `El teléfono ${tel} ya está registrado`;
    }
    return null;
  }

  addDueno(dueno: Omit<Dueno, 'id'>): { ok: true; dueno: Dueno } | { ok: false; error: string } {
    const dup = this.existeDuplicado(dueno);
    if (dup) return { ok: false, error: dup };
    const nuevo: Dueno = normalizarDueno({ ...dueno, id: 'd' + Date.now().toString() });
    this._duenos.update(list => [...list, nuevo]);
    this.persist();
    return { ok: true, dueno: nuevo };
  }

  updateDueno(id: string, datos: Partial<Dueno>): { ok: true } | { ok: false; error: string } {
    const dup = this.existeDuplicado(datos, id);
    if (dup) return { ok: false, error: dup };
    this._duenos.update(list =>
      list.map(d => d.id === id ? normalizarDueno({ ...d, ...datos }) : d)
    );
    this.persist();
    return { ok: true };
  }

  deleteDueno(id: string): void {
    this._duenos.update(list => list.filter(d => d.id !== id));
    this.persist();
  }

  searchDuenos(query: string): Dueno[] {
    const q = query.toLowerCase();
    return this._duenos().filter(d =>
      d.nombre.toLowerCase().includes(q) ||
      d.apellido.toLowerCase().includes(q) ||
      d.telefono.includes(q) ||
      d.numeroDocumento.includes(q) ||
      (d.email?.toLowerCase().includes(q) ?? false) ||
      d.distrito.toLowerCase().includes(q)
    );
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._duenos());
  }
}
