import { getFormErrorMessage, isFieldInvalid, isFieldValid } from './form-errors.util';

describe('form-errors.util', () => {
  it('getFormErrorMessage returns empty when not touched', () => {
    expect(getFormErrorMessage({ required: true }, false)).toBe('');
  });

  it('getFormErrorMessage returns required message', () => {
    expect(getFormErrorMessage({ required: true }, true)).toBe('Este campo es obligatorio');
  });

  it('getFormErrorMessage returns phone pattern message', () => {
    expect(getFormErrorMessage({ pattern: { requiredPattern: /^[0-9]{9}$/ } }, true))
      .toBe('Ingresa un teléfono válido de 9 dígitos');
  });

  it('isFieldInvalid returns true when invalid and touched', () => {
    expect(isFieldInvalid(true, true)).toBe(true);
    expect(isFieldInvalid(true, false)).toBe(false);
  });

  it('isFieldValid returns true when valid and touched', () => {
    expect(isFieldValid(true, true)).toBe(true);
    expect(isFieldValid(true, false)).toBe(false);
  });
});
