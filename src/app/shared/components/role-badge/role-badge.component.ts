import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-role-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="role-badge" [class.role-badge-admin]="auth.isAdmin()" [class.role-badge-asistente]="auth.isAsistente()">
      <i class="bi" [class.bi-shield-check]="auth.isAdmin()" [class.bi-person-badge]="auth.isAsistente()"></i>
      {{ auth.rolLabel() }}
    </span>
  `,
  styles: [`
    .role-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.25rem 0.55rem;
      border-radius: 999px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    .role-badge-admin { background: rgba(184, 50, 50, 0.12); color: #842029; }
    .role-badge-asistente { background: rgba(44, 111, 170, 0.12); color: #084298; }
  `]
})
export class RoleBadgeComponent {
  readonly auth = inject(AuthService);
}
