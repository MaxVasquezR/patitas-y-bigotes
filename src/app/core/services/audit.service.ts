import { Injectable, signal } from '@angular/core';
import { RegistroAuditoria } from '../models/audit.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'pb_auditoria';

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly _registros = signal<RegistroAuditoria[]>([]);

  readonly registros = this._registros.asReadonly();

  constructor(private storage: StorageService) {
    const saved = this.storage.get<RegistroAuditoria[]>(STORAGE_KEY);
    if (saved?.length) this._registros.set(saved);
  }

  registrar(usuario: string, rol: string, accion: string, detalle: string): void {
    const entry: RegistroAuditoria = {
      id: 'a' + Date.now(),
      fecha: new Date().toISOString(),
      usuario,
      rol,
      accion,
      detalle
    };
    this._registros.update(list => [entry, ...list].slice(0, 200));
    this.persist();
  }

  getRecientes(limite = 50): RegistroAuditoria[] {
    return this._registros().slice(0, limite);
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._registros());
  }
}
