import { Injectable, signal, effect } from '@angular/core';
import { StorageService } from './storage.service';
import { ZOOM_NIVELES } from '../constants/app.constants';

const STORAGE_KEY = 'pb_zoom';
type ZoomNivel = (typeof ZOOM_NIVELES)[number];

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private readonly _zoom = signal<ZoomNivel>(100);

  readonly zoom = this._zoom.asReadonly();
  readonly niveles = ZOOM_NIVELES;

  constructor(private storage: StorageService) {
    const saved = this.storage.get<number>(STORAGE_KEY);
    if (saved && ZOOM_NIVELES.includes(saved as ZoomNivel)) {
      this._zoom.set(saved as ZoomNivel);
    }
    effect(() => this.aplicarZoom(this._zoom()));
  }

  aumentar(): void {
    const idx = ZOOM_NIVELES.indexOf(this._zoom());
    if (idx < ZOOM_NIVELES.length - 1) this.setZoom(ZOOM_NIVELES[idx + 1]);
  }

  disminuir(): void {
    const idx = ZOOM_NIVELES.indexOf(this._zoom());
    if (idx > 0) this.setZoom(ZOOM_NIVELES[idx - 1]);
  }

  restablecer(): void {
    this.setZoom(100);
  }

  setZoom(nivel: ZoomNivel): void {
    this._zoom.set(nivel);
    this.storage.set(STORAGE_KEY, nivel);
  }

  private aplicarZoom(nivel: number): void {
    document.documentElement.style.fontSize = `${nivel}%`;
  }
}
