import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessibilityService } from '../../../core/services/accessibility.service';

@Component({
  selector: 'app-zoom-control',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="zoom-control" title="Tamaño de texto">
      <span class="zoom-label"><i class="bi bi-universal-access"></i></span>
      <button type="button" class="btn btn-sm" (click)="a11y.disminuir()" [disabled]="a11y.zoom() <= 90" aria-label="Reducir texto">A−</button>
      <span class="zoom-value">{{ a11y.zoom() }}%</span>
      <button type="button" class="btn btn-sm" (click)="a11y.aumentar()" [disabled]="a11y.zoom() >= 150" aria-label="Aumentar texto">A+</button>
      <button type="button" class="btn btn-sm btn-link zoom-reset" (click)="a11y.restablecer()" title="Restablecer">↺</button>
    </div>
  `,
  styles: [`
    .zoom-control {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1030;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 0.35rem;
      background: #fff;
      border: 1px solid var(--border-color);
      border-right: none;
      border-radius: 0.5rem 0 0 0.5rem;
      box-shadow: -2px 0 8px rgba(0,0,0,0.08);
      font-size: 0.75rem;
    }
    .zoom-label { color: var(--bs-primary); font-size: 1rem; }
    .zoom-value { font-weight: 700; min-width: 2.5rem; text-align: center; }
    .zoom-control .btn { padding: 0.15rem 0.35rem; line-height: 1.2; }
    .zoom-reset { font-size: 0.85rem; padding: 0 !important; }
  `]
})
export class ZoomControlComponent {
  readonly a11y = inject(AccessibilityService);
}
