import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private readonly _abierto = signal(false);

  readonly abierto = this._abierto.asReadonly();

  toggle(): void {
    this._abierto.update(v => !v);
  }

  abrir(): void {
    this._abierto.set(true);
  }

  cerrar(): void {
    this._abierto.set(false);
  }
}
