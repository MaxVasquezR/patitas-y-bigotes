import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      *ngIf="confirmService.state().visible"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-semibold">{{ confirmService.state().titulo }}</h5>
            <button type="button" class="btn-close" (click)="confirmService.cancelar()" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0 text-secondary">{{ confirmService.state().mensaje }}</p>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-outline-secondary" (click)="confirmService.cancelar()">
              Cancelar
            </button>
            <button type="button" class="btn btn-danger" (click)="confirmService.aceptar()">
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div *ngIf="confirmService.state().visible" class="modal-backdrop fade show"></div>
  `
})
export class ConfirmDialogComponent {
  constructor(readonly confirmService: ConfirmService) {}
}
