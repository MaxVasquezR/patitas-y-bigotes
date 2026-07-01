import { ValidationErrors } from '@angular/forms';

export function getFormErrorMessage(
  errors: ValidationErrors | null | undefined,
  touched: boolean
): string {
  if (!touched || !errors) return '';

  if (errors['required']) return 'Este campo es obligatorio';
  if (errors['email']) return 'Email inválido';
  if (errors['minlength']) {
    return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
  }
  if (errors['maxlength']) {
    return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
  }
  if (errors['pattern']) {
    const pattern = errors['pattern'].requiredPattern?.toString() ?? '';
    if (pattern.includes('9')) return 'Ingresa un teléfono válido de 9 dígitos';
    return 'Formato inválido';
  }
  if (errors['min']) return 'Valor debe ser mayor a 0';
  if (errors['futureDate']) return 'La fecha no puede ser futura';
  if (errors['documento']) return 'Documento inválido (8 dígitos para DNI)';
  if (errors['temperatura']) return 'Temperatura debe estar entre 35 y 42 °C';
  if (errors['requiredTrue']) return 'Debe aceptar para continuar';

  return 'Campo inválido';
}

export function isFieldInvalid(
  invalid: boolean | undefined,
  touched: boolean | undefined
): boolean {
  return !!(invalid && touched);
}

export function isFieldValid(
  valid: boolean | undefined,
  touched: boolean | undefined
): boolean {
  return !!(valid && touched);
}
