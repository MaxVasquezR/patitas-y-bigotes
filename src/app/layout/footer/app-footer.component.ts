import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CLINICA_NOMBRE, CLINICA_DIRECCION, CLINICA_TELEFONO, CLINICA_HORARIO } from '../../core/constants/app.constants';

@Component({
  selector: 'app-app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="app-footer">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <strong class="small">{{ clinicaNombre }}</strong>
          <p class="mb-0 text-muted" style="font-size:0.72rem">{{ direccion }}</p>
        </div>
        <div class="text-md-end">
          <p class="mb-0 small"><i class="bi bi-telephone me-1"></i>{{ telefono }}</p>
          <p class="mb-0 text-muted" style="font-size:0.72rem">{{ horario }}</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      margin-top: auto;
      padding: 1rem 1.75rem;
      background: #fff;
      border-top: 1px solid var(--border-color);
      color: var(--text-primary);
    }
  `]
})
export class AppFooterComponent {
  readonly clinicaNombre = CLINICA_NOMBRE;
  readonly direccion = CLINICA_DIRECCION;
  readonly telefono = CLINICA_TELEFONO;
  readonly horario = CLINICA_HORARIO;
}
