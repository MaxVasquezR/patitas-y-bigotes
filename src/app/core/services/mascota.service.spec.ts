import { TestBed } from '@angular/core/testing';
import { MascotaService } from './mascota.service';
import { DuenoService } from './dueno.service';

describe('MascotaService', () => {
  let service: MascotaService;
  let duenoService: DuenoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MascotaService, DuenoService]
    });
    service = TestBed.inject(MascotaService);
    duenoService = TestBed.inject(DuenoService);
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe retornar mascotas iniciales', () => {
    expect(service.getMascotas().length).toBeGreaterThanOrEqual(3);
  });

  it('debe agregar y eliminar mascota', () => {
    const inicial = service.getMascotas().length;
    const resultadoDueno = duenoService.addDueno({
      nombre: 'Test',
      apellido: 'User',
      numeroDocumento: '88776655',
      telefono: '999999999',
      email: 'test@test.com',
      direccion: 'Test 123',
      distrito: 'Lima',
      aceptaDatos: true
    });
    expect(resultadoDueno.ok).toBe(true);
    if (!resultadoDueno.ok) return;

    const nueva = service.addMascota({
      nombre: 'Test',
      especie: 'perro',
      raza: 'Test',
      fechaNacimiento: '2022-01-01',
      sexo: 'macho',
      peso: 10,
      color: 'Negro',
      estado: 'activo',
      duenoId: resultadoDueno.dueno.id
    });
    expect(service.getMascotas().length).toBe(inicial + 1);
    service.deleteMascota(nueva.id);
    expect(service.getMascotas().length).toBe(inicial);
  });

  it('debe buscar mascotas por nombre', () => {
    const resultados = service.searchMascotas('Max');
    expect(resultados.some(m => m.nombre === 'Max')).toBe(true);
  });
});
