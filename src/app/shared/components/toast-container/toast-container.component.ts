import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast show align-items-center text-white bg-{{ toast.tipo }} border-0 mb-2"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body">{{ toast.mensaje }}</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            (click)="toastService.remove(toast.id)"
            aria-label="Cerrar"
          ></button>
        </div>
      </div>
    </div>
  `
})
export class ToastContainerComponent {
  constructor(readonly toastService: ToastService) {}
}
