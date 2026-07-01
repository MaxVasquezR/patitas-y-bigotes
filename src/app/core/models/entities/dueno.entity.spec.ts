import { DuenoEntity } from './dueno.entity';

describe('DuenoEntity', () => {
  const dueno = DuenoEntity.from({
    id: 'd1',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    tipoDocumento: 'DNI',
    numeroDocumento: '45678901',
    telefono: '987654321',
    email: 'carlos@email.com',
    direccion: 'Lima',
    distrito: 'Miraflores',
    aceptaDatos: true
  });

  it('nombreCompleto concatena nombre y apellido', () => {
    expect(dueno.nombreCompleto).toBe('Carlos Mendoza');
  });

  it('telefonoFormateado agrupa en bloques', () => {
    expect(dueno.telefonoFormateado).toBe('987 654 321');
  });
});
