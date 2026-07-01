import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <h1 class="h3 fw-semibold mb-1 text-dark">
          <i *ngIf="icono" class="bi {{ icono }} me-2 text-primary"></i>{{ titulo }}
        </h1>
        <p *ngIf="subtitulo" class="text-muted mb-0 small">{{ subtitulo }}</p>
      </div>
      <a
        *ngIf="accionLink && accionTexto"
        [routerLink]="accionLink"
        class="btn"
        [class.btn-primary]="accionVariant === 'primary'"
        [class.btn-outline-secondary]="accionVariant === 'outline'"
      >
        <i *ngIf="accionIcono" class="bi {{ accionIcono }} me-1"></i>{{ accionTexto }}
      </a>
    </div>
  `
})
export class PageHeaderComponent {
  @Input({ required: true }) titulo!: string;
  @Input() subtitulo = '';
  @Input() icono = '';
  @Input() accionTexto = '';
  @Input() accionLink: string | string[] = '';
  @Input() accionIcono = 'bi-plus-lg';
  @Input() accionVariant: 'primary' | 'outline' = 'primary';
}
