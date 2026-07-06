import { TestBed } from '@angular/core/testing';
import { DuenoService } from './dueno.service';

describe('DuenoService', () => {
  let service: DuenoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DuenoService] });
    service = TestBed.inject(DuenoService);
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe agregar propietario', () => {
    const inicial = service.getDuenos().length;
    const resultado = service.addDueno({
      nombre: 'Juan',
      apellido: 'Pérez',
      numeroDocumento: '70998877',
      telefono: '911111111',
      email: 'juan@test.com',
      direccion: 'Calle 1',
      distrito: 'Lima',
      aceptaDatos: true
    });
    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(service.getDuenos().length).toBe(inicial + 1);
    }
  });

  it('debe buscar por nombre', () => {
    const resultados = service.searchDuenos('Carlos');
    expect(resultados.length).toBeGreaterThan(0);
  });
});
