import { TelefonoPipe } from './telefono.pipe';

describe('TelefonoPipe', () => {
  const pipe = new TelefonoPipe();

  it('formatea teléfono de 9 dígitos', () => {
    expect(pipe.transform('987654321')).toBe('987 654 321');
  });

  it('retorna valor original si no tiene 9 dígitos', () => {
    expect(pipe.transform('123')).toBe('123');
  });
});
