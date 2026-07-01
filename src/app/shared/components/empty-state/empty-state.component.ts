import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card border-0 shadow-sm text-center py-5">
      <div class="card-body">
        <i class="bi {{ icono }} display-4 text-muted d-block mb-3"></i>
        <p class="text-muted mb-3">{{ mensaje }}</p>
        <a *ngIf="accionLink && accionTexto" [routerLink]="accionLink" class="btn btn-primary">
          {{ accionTexto }}
        </a>
      </div>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() icono = 'bi-inbox';
  @Input() mensaje = 'No hay datos disponibles';
  @Input() accionTexto = '';
  @Input() accionLink = '';
}
