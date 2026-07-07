import { Mascota } from '../models/mascota.model';
import { Dueno } from '../models/mascota.model';
import { Cita } from '../models/cita.model';
import { RegistroHistorial } from '../models/historial.model';

export const DUENOS_INICIALES: Dueno[] = [
  {
    id: 'd1',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    numeroDocumento: '45678901',
    telefono: '987654321',
    email: 'carlos@email.com',
    direccion: 'Av. Javier Prado 120',
    distrito: 'Miraflores',
    aceptaDatos: true
  },
  {
    id: 'd2',
    nombre: 'María',
    apellido: 'Torres',
    numeroDocumento: '42345678',
    telefono: '945678321',
    email: 'maria@email.com',
    direccion: 'Calle Las Flores 45',
    distrito: 'San Isidro',
    aceptaDatos: true
  },
  {
    id: 'd3',
    nombre: 'Ana',
    apellido: 'García',
    numeroDocumento: '40123456',
    telefono: '912345678',
    email: 'ana@email.com',
    direccion: 'Jr. Lima 89',
    distrito: 'Surco',
    aceptaDatos: true
  }
];

export const MASCOTAS_INICIALES: Mascota[] = [
  {
    id: '1',
    nombre: 'Max',
    especie: 'perro',
    raza: 'Labrador Retriever',
    fechaNacimiento: '2020-03-15',
    sexo: 'macho',
    peso: 28.5,
    color: 'Dorado',
    microchip: '985112004567890',
    alergias: 'Ninguna conocida',
    castrado: true,
    estado: 'activo',
    fechaRegistro: '2023-01-10',
    duenoId: DUENOS_INICIALES[0].id
  },
  {
    id: '2',
    nombre: 'Luna',
    especie: 'gato',
    raza: 'Siamés',
    fechaNacimiento: '2021-07-20',
    sexo: 'hembra',
    peso: 4.2,
    color: 'Crema con puntas oscuras',
    castrado: true,
    estado: 'activo',
    alergias: 'Polen (leve)',
    fechaRegistro: '2023-02-14',
    duenoId: DUENOS_INICIALES[1].id
  },
  {
    id: '3',
    nombre: 'Rocky',
    especie: 'perro',
    raza: 'Bulldog Francés',
    fechaNacimiento: '2019-11-05',
    sexo: 'macho',
    peso: 12.0,
    color: 'Atigrado',
    castrado: false,
    estado: 'en_tratamiento',
    observaciones: 'Control post-operatorio programado',
    fechaRegistro: '2022-06-01',
    duenoId: DUENOS_INICIALES[2].id
  },
  {
    id: '4',
    nombre: 'Copito',
    especie: 'otro',
    otraEspecie: 'Hámster',
    raza: 'Sirio',
    fechaNacimiento: '2024-02-10',
    sexo: 'macho',
    peso: 0.15,
    color: 'Blanco',
    castrado: false,
    estado: 'activo',
    fechaRegistro: '2024-03-01',
    duenoId: DUENOS_INICIALES[0].id
  }
];

function hoy(): string {
  return new Date().toISOString().split('T')[0];
}

function manana(): string {
  return new Date(Date.now() + 86400000).toISOString().split('T')[0];
}

export const CITAS_INICIALES: Cita[] = [
  {
    id: 'c1',
    mascotaId: '1',
    fecha: hoy(),
    hora: '09:00',
    tipo: 'consulta',
    motivo: 'Revisión anual y vacunas',
    estado: 'confirmada',
    veterinario: 'Dra. Lucía Ríos',
    notas: 'Traer cartilla de vacunación',
    fechaCreacion: '2024-01-05'
  },
  {
    id: 'c2',
    mascotaId: '2',
    fecha: hoy(),
    hora: '11:30',
    tipo: 'vacuna',
    motivo: 'Vacuna antirrábica',
    estado: 'pendiente',
    veterinario: 'Dr. Pedro Castro',
    fechaCreacion: '2024-01-06'
  },
  {
    id: 'c3',
    mascotaId: '3',
    fecha: manana(),
    hora: '15:00',
    tipo: 'control',
    motivo: 'Control post-operatorio',
    estado: 'confirmada',
    veterinario: 'Dra. Lucía Ríos',
    fechaCreacion: '2024-01-07'
  }
];

export const HISTORIAL_INICIAL: RegistroHistorial[] = [
  {
    id: 'h1',
    mascotaId: '1',
    citaId: 'c1',
    fecha: '2024-06-15',
    veterinario: 'Dra. Lucía Ríos',
    motivoConsulta: 'Control anual',
    diagnostico: 'Paciente en buen estado de salud general',
    tratamiento: 'Vacunación antirrábica y desparasitación',
    medicamentos: [
      { nombre: 'Drontal Plus', dosis: '1 tableta', duracion: 'Dosis única' }
    ],
    peso: 28.5,
    temperatura: 38.5,
    frecuenciaCardiaca: 90,
    frecuenciaRespiratoria: 22,
    mucosas: 'Rosadas',
    observaciones: 'Se recomienda dieta balanceada y ejercicio diario',
    proximaVisita: '2025-06-15',
    creadoPor: 'Dra. Lucía Ríos'
  },
  {
    id: 'h2',
    mascotaId: '1',
    fecha: '2023-12-10',
    veterinario: 'Dr. Pedro Castro',
    motivoConsulta: 'Vómitos y decaimiento',
    diagnostico: 'Gastritis aguda leve',
    tratamiento: 'Dieta blanda y medicación',
    medicamentos: [
      { nombre: 'Metronidazol', dosis: '250mg', duracion: '5 días' },
      { nombre: 'Omeprazol', dosis: '20mg', duracion: '7 días' }
    ],
    peso: 29.0,
    temperatura: 39.1,
    frecuenciaCardiaca: 110,
    mucosas: 'Pálidas',
    observaciones: 'Mejoría esperada en 48-72 horas. Dieta blanda.',
    creadoPor: 'Dr. Pedro Castro'
  },
  {
    id: 'h3',
    mascotaId: '2',
    fecha: '2024-04-20',
    veterinario: 'Dra. Lucía Ríos',
    motivoConsulta: 'Revisión anual',
    diagnostico: 'Salud óptima',
    tratamiento: 'Vacuna triple felina',
    medicamentos: [],
    peso: 4.2,
    temperatura: 38.3,
    frecuenciaRespiratoria: 28,
    mucosas: 'Rosadas',
    observaciones: 'Luna está en excelente condición',
    creadoPor: 'Dra. Lucía Ríos'
  }
];