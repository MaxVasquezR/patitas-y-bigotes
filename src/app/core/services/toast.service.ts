import { Injectable, signal } from '@angular/core';

export type ToastTipo = 'success' | 'danger' | 'warning' | 'info';

export interface Toast {
  id: string;
  mensaje: string;
  tipo: ToastTipo;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);

  readonly toasts = this._toasts.asReadonly();

  show(mensaje: string, tipo: ToastTipo = 'info', duracionMs = 3500): void {
    const id = Date.now().toString();
    this._toasts.update(list => [...list, { id, mensaje, tipo }]);
    setTimeout(() => this.remove(id), duracionMs);
  }

  success(mensaje: string): void { this.show(mensaje, 'success'); }
  error(mensaje: string): void { this.show(mensaje, 'danger'); }
  warning(mensaje: string): void { this.show(mensaje, 'warning'); }

  remove(id: string): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}
