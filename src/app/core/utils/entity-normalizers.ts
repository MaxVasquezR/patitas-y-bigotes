import { Dueno, Mascota } from '../models/mascota.model';
import { RegistroHistorial } from '../models/historial.model';

export function normalizarDueno(d: Partial<Dueno> & { id: string }): Dueno {
  return {
    id: d.id,
    nombre: d.nombre ?? '',
    apellido: d.apellido ?? '',
    numeroDocumento: d.numeroDocumento ?? '',
    telefono: d.telefono ?? '',
    email: d.email,
    direccion: d.direccion ?? '',
    distrito: d.distrito ?? '',
    aceptaDatos: d.aceptaDatos ?? true
  };
}

export function normalizarMascota(m: Partial<Mascota> & { id: string; duenoId: string }): Mascota {
  return {
    id: m.id,
    nombre: m.nombre ?? '',
    especie: m.especie ?? 'perro',
    otraEspecie: m.otraEspecie,
    raza: m.raza ?? '',
    fechaNacimiento: m.fechaNacimiento ?? '',
    sexo: m.sexo ?? 'macho',
    peso: m.peso ?? 0,
    color: m.color ?? '',
    microchip: m.microchip,
    alergias: m.alergias,
    castrado: m.castrado ?? false,
    estado: m.estado ?? 'activo',
    observaciones: m.observaciones,
    duenoId: m.duenoId,
    foto: m.foto,
    fechaRegistro: m.fechaRegistro ?? new Date().toISOString().split('T')[0]
  };
}

export function normalizarHistorial(r: Partial<RegistroHistorial> & { id: string; mascotaId: string }): RegistroHistorial {
  return {
    id: r.id,
    mascotaId: r.mascotaId,
    citaId: r.citaId,
    fecha: r.fecha ?? '',
    veterinario: r.veterinario ?? '',
    motivoConsulta: r.motivoConsulta ?? '',
    diagnostico: r.diagnostico ?? '',
    tratamiento: r.tratamiento ?? '',
    medicamentos: r.medicamentos ?? [],
    peso: r.peso ?? 0,
    temperatura: r.temperatura,
    frecuenciaCardiaca: r.frecuenciaCardiaca,
    frecuenciaRespiratoria: r.frecuenciaRespiratoria,
    mucosas: r.mucosas,
    observaciones: r.observaciones ?? '',
    proximaVisita: r.proximaVisita,
    creadoPor: r.creadoPor,
    modificadoPor: r.modificadoPor,
    fechaModificacion: r.fechaModificacion
  };
}
