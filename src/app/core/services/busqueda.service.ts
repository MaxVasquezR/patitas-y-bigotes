import { Injectable } from '@angular/core';
import { MascotaService } from './mascota.service';
import { DuenoService } from './dueno.service';
import { CitaService } from './cita.service';

export type TipoResultadoBusqueda = 'mascota' | 'propietario' | 'cita';

export interface ResultadoBusqueda {
  tipo: TipoResultadoBusqueda;
  id: string;
  titulo: string;
  subtitulo: string;
  ruta: string;
}

@Injectable({ providedIn: 'root' })
export class BusquedaService {
  constructor(
    private mascotaService: MascotaService,
    private duenoService: DuenoService,
    private citaService: CitaService
  ) {}

  buscar(query: string, limite = 8): ResultadoBusqueda[] {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const resultados: ResultadoBusqueda[] = [];

    for (const m of this.mascotaService.searchMascotas(q)) {
      resultados.push({
        tipo: 'mascota',
        id: m.id,
        titulo: m.nombre,
        subtitulo: `${m.raza} · ${m.dueno.nombre} ${m.dueno.apellido}`,
        ruta: `/mascotas/${m.id}`
      });
    }

    for (const d of this.duenoService.searchDuenos(q)) {
      resultados.push({
        tipo: 'propietario',
        id: d.id,
        titulo: `${d.nombre} ${d.apellido}`,
        subtitulo: d.telefono,
        ruta: `/propietarios/${d.id}`
      });
    }

    for (const c of this.citaService.getCitas()) {
      const match =
        c.nombreMascota.toLowerCase().includes(q) ||
        c.nombreDueno.toLowerCase().includes(q) ||
        c.motivo.toLowerCase().includes(q) ||
        c.veterinario.toLowerCase().includes(q);
      if (match) {
        resultados.push({
          tipo: 'cita',
          id: c.id,
          titulo: `${c.nombreMascota} — ${c.fecha}`,
          subtitulo: `${c.hora} · ${c.tipo} · ${c.estado}`,
          ruta: `/citas/${c.id}/editar`
        });
      }
    }

    return resultados.slice(0, limite);
  }
}
