import { TestBed } from '@angular/core/testing';
import { HistorialService } from './historial.service';

describe('HistorialService', () => {
  let service: HistorialService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HistorialService] });
    service = TestBed.inject(HistorialService);
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe agregar registro clínico', () => {
    const inicial = service.getRegistros().length;
    service.addRegistro({
      mascotaId: '1',
      fecha: '2025-01-15',
      veterinario: 'Dra. Test',
      motivoConsulta: 'Control',
      diagnostico: 'Saludable',
      tratamiento: 'Ninguno',
      medicamentos: [],
      peso: 10,
      temperatura: 38.5,
      observaciones: 'OK'
    });
    expect(service.getRegistros().length).toBe(inicial + 1);
  });
});
