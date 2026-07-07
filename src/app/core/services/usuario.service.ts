import { Injectable, signal } from '@angular/core';
import { UsuarioCredencial } from '../models/usuario.model';
import { USUARIOS_DEMO } from '../constants/usuarios.constants';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'pb_usuarios';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly _usuarios = signal<UsuarioCredencial[]>([...USUARIOS_DEMO]);

  readonly usuarios = this._usuarios.asReadonly();

  constructor(private storage: StorageService) {
    const saved = this.storage.get<UsuarioCredencial[]>(STORAGE_KEY);
    if (saved?.length) {
      this._usuarios.set(saved);
    }
  }

  getUsuarios(): UsuarioCredencial[] {
    return this._usuarios();
  }

  getUsuarioById(id: string): UsuarioCredencial | undefined {
    return this._usuarios().find(u => u.id === id);
  }

  findByUsername(username: string): UsuarioCredencial | undefined {
    const u = username.trim().toLowerCase();
    return this._usuarios().find(x => x.username.toLowerCase() === u);
  }

  existeDuplicado(username: string, excludeId?: string): string | null {
    const u = username.trim().toLowerCase();
    const existe = this._usuarios().find(x => x.username.toLowerCase() === u && x.id !== excludeId);
    return existe ? `Ya existe un usuario con el username "${username}"` : null;
  }

  addUsuario(datos: Omit<UsuarioCredencial, 'id'>): { ok: true; usuario: UsuarioCredencial } | { ok: false; error: string } {
    const dup = this.existeDuplicado(datos.username);
    if (dup) return { ok: false, error: dup };
    const nuevo: UsuarioCredencial = { ...datos, id: 'u' + Date.now().toString() };
    this._usuarios.update(list => [...list, nuevo]);
    this.persist();
    return { ok: true, usuario: nuevo };
  }

  updateUsuario(id: string, datos: Partial<UsuarioCredencial>): { ok: true } | { ok: false; error: string } {
    if (datos.username) {
      const dup = this.existeDuplicado(datos.username, id);
      if (dup) return { ok: false, error: dup };
    }
    this._usuarios.update(list =>
      list.map(u => u.id === id ? { ...u, ...datos } : u)
    );
    this.persist();
    return { ok: true };
  }

  toggleActivo(id: string): void {
    this._usuarios.update(list =>
      list.map(u => u.id === id ? { ...u, activo: !u.activo } : u)
    );
    this.persist();
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._usuarios());
  }
}
