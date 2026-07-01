import { Injectable, signal } from '@angular/core';

export interface ConfirmState {
  visible: boolean;
  titulo: string;
  mensaje: string;
  resolver: ((value: boolean) => void) | null;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly _state = signal<ConfirmState>({
    visible: false,
    titulo: 'Confirmar acción',
    mensaje: '',
    resolver: null
  });

  readonly state = this._state.asReadonly();

  confirm(mensaje: string, titulo = 'Confirmar acción'): Promise<boolean> {
    return new Promise(resolve => {
      this._state.set({ visible: true, titulo, mensaje, resolver: resolve });
    });
  }

  aceptar(): void {
    const { resolver } = this._state();
    resolver?.(true);
    this.cerrar();
  }

  cancelar(): void {
    const { resolver } = this._state();
    resolver?.(false);
    this.cerrar();
  }

  private cerrar(): void {
    this._state.set({
      visible: false,
      titulo: 'Confirmar acción',
      mensaje: '',
      resolver: null
    });
  }
}
