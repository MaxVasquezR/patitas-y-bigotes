import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { getFormErrorMessage, isFieldInvalid, isFieldValid } from '../../utils/form-errors.util';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-3">
      <label *ngIf="label" class="form-label">{{ label }}<span *ngIf="requerido"> *</span></label>
      <ng-content></ng-content>
      <div *ngIf="errorMessage" class="invalid-feedback d-block">{{ errorMessage }}</div>
    </div>
  `
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() requerido = false;
  @Input() control: AbstractControl | null = null;

  get errorMessage(): string {
    if (!this.control) return '';
    return getFormErrorMessage(this.control.errors, this.control.touched);
  }

  get invalid(): boolean {
    if (!this.control) return false;
    return isFieldInvalid(this.control.invalid, this.control.touched);
  }

  get valid(): boolean {
    if (!this.control) return false;
    return isFieldValid(this.control.valid, this.control.touched);
  }
}
