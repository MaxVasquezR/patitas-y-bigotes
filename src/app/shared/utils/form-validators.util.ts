import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (!v) return null;
    const hoy = new Date().toISOString().split('T')[0];
    return v > hoy ? { futureDate: true } : null;
  };
}

export function documentoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = (control.value ?? '').toString().trim();
    if (!v) return null;
    return /^\d{8}$/.test(v) ? null : { documento: true };
  };
}

export function temperaturaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v === null || v === undefined || v === '') return null;
    const n = +v;
    return n >= 35 && n <= 42 ? null : { temperatura: true };
  };
}

export function markFormGroupTouched(group: AbstractControl): number {
  let invalidos = 0;
  if ('controls' in group) {
    Object.values((group as { controls: Record<string, AbstractControl> }).controls).forEach(c => {
      c.markAsTouched();
      if (c.invalid) invalidos++;
      if ('controls' in c) invalidos += markFormGroupTouched(c) - (c.invalid ? 0 : 0);
    });
  }
  if (group.invalid) return Math.max(invalidos, 1);
  return invalidos;
}

export function scrollToFirstInvalid(): void {
  setTimeout(() => {
    const el = document.querySelector('.is-invalid, .ng-invalid.ng-touched');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}
