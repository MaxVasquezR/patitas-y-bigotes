import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-form-required-legend',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="form-required-legend small text-muted mb-3"><span class="text-danger">*</span> Campos obligatorios</p>`,
  styles: [`.form-required-legend { border-left: 3px solid var(--bs-primary); padding-left: 0.65rem; }`]
})
export class FormRequiredLegendComponent {}
