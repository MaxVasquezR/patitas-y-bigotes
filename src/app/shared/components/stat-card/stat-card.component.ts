import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StatColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card h-100 stat-card">
      <div class="card-body d-flex align-items-center gap-3 py-3">
        <div class="stat-icon" [class]="'stat-icon--' + color">
          <i class="bi {{ icono }}"></i>
        </div>
        <div class="min-w-0">
          <div class="stat-value">{{ valor }}</div>
          <div class="stat-label text-muted">{{ etiqueta }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card { border: 1px solid var(--border-color); }
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }
    .stat-icon--primary { background: rgba(26,82,118,.1); color: #1a5276; }
    .stat-icon--secondary { background: rgba(92,107,122,.12); color: #5c6b7a; }
    .stat-icon--success { background: rgba(30,126,90,.1); color: #1e7e5a; }
    .stat-icon--info { background: rgba(44,111,170,.1); color: #2c6faa; }
    .stat-icon--warning { background: rgba(184,134,11,.12); color: #b8860b; }
    .stat-icon--danger { background: rgba(184,50,50,.1); color: #b83232; }
    .stat-value { font-size: 1.5rem; font-weight: 700; line-height: 1.1; color: var(--text-primary); }
    .stat-label { font-size: 0.8rem; margin-top: 0.15rem; }
  `]
})
export class StatCardComponent {
  @Input({ required: true }) valor!: string | number;
  @Input({ required: true }) etiqueta!: string;
  @Input() icono = 'bi-circle';
  @Input() color: StatColor = 'primary';
}
