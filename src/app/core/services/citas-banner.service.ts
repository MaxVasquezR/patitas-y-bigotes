import { Injectable } from '@angular/core';
import { CitaService } from './cita.service';
import { MascotaService } from './mascota.service';
import { DuenoService } from './dueno.service';
import { Cita } from '../models/cita.model';

export type UrgenciaCita = 'urgente' | 'hoy' | 'proxima';

export interface CitaBanner {
  cita: Cita;
  nombreMascota: string;
  nombreDueno: string;
  urgencia: UrgenciaCita;
  minutosRestantes?: number;
  etiqueta: string;
}

@Injectable({ providedIn: 'root' })
export class CitasBannerService {
  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private duenoService: DuenoService
  ) {}

  getCitasDestacadas(): CitaBanner[] {
    const ahora = new Date();
    const hoy = ahora.toISOString().split('T')[0];
    const citas = this.citaService.getCitas()
      .filter(c => c.estado !== 'cancelada' && c.estado !== 'completada' && c.fecha >= hoy)
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

    const resultado: CitaBanner[] = [];

    for (const cita of citas) {
      const urgencia = this.calcularUrgencia(cita, ahora, hoy);
      if (!urgencia) continue;
      const mascota = this.mascotaService.getMascotaById(cita.mascotaId);
      const dueno = mascota ? this.duenoService.getDuenoById(mascota.duenoId) : undefined;
      const nombreMascota = mascota?.nombre ?? '';
      const nombreDueno = dueno ? `${dueno.nombre} ${dueno.apellido}` : '';
      resultado.push({
        cita,
        nombreMascota,
        nombreDueno,
        urgencia: urgencia.tipo,
        minutosRestantes: urgencia.minutos,
        etiqueta: this.etiqueta(cita, nombreMascota, urgencia.tipo, urgencia.minutos)
      });
      if (resultado.length >= 5) break;
    }
    return resultado;
  }

  tieneCitasUrgentes(): boolean {
    return this.getCitasDestacadas().some(c => c.urgencia === 'urgente' || c.urgencia === 'hoy');
  }

  private calcularUrgencia(cita: Cita, ahora: Date, hoy: string): { tipo: UrgenciaCita; minutos: number } | null {
    if (cita.fecha < hoy) return null;
    const [hh, mm] = cita.hora.split(':').map(Number);
    const citaDate = new Date(cita.fecha + 'T00:00:00');
    citaDate.setHours(hh, mm, 0, 0);
    const diffMin = Math.round((citaDate.getTime() - ahora.getTime()) / 60000);

    if (cita.fecha === hoy && diffMin >= -15 && diffMin <= 60) {
      return { tipo: diffMin <= 30 ? 'urgente' : 'hoy', minutos: diffMin };
    }
    if (cita.fecha === hoy) return { tipo: 'hoy', minutos: diffMin };
    const manana = new Date(ahora);
    manana.setDate(manana.getDate() + 1);
    if (cita.fecha === manana.toISOString().split('T')[0]) {
      return { tipo: 'proxima', minutos: diffMin };
    }
    return null;
  }

  private etiqueta(cita: Cita, nombreMascota: string, tipo: UrgenciaCita, minutos: number): string {
    if (tipo === 'urgente') {
      return minutos <= 0 ? `¡En curso! ${cita.hora} — ${nombreMascota}` : `En ${minutos} min — ${nombreMascota}`;
    }
    if (tipo === 'hoy') return `Hoy ${cita.hora} — ${nombreMascota} (${cita.tipo})`;
    return `Mañana ${cita.hora} — ${nombreMascota}`;
  }
}
