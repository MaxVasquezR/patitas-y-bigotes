import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { DUENOS_INICIALES, MASCOTAS_INICIALES, CITAS_INICIALES, HISTORIAL_INICIAL } from '../constants/seed.data';

const KEYS = {
  duenos: 'pb_duenos',
  mascotas: 'pb_mascotas',
  citas: 'pb_citas',
  historial: 'pb_historial',
  auditoria: 'pb_auditoria'
};

export interface BackupData {
  version: number;
  exportado: string;
  duenos: unknown[];
  mascotas: unknown[];
  citas: unknown[];
  historial: unknown[];
}

@Injectable({ providedIn: 'root' })
export class BackupService {
  constructor(private storage: StorageService) {}

  exportar(): BackupData {
    return {
      version: 2,
      exportado: new Date().toISOString(),
      duenos: this.storage.get(KEYS.duenos) ?? [],
      mascotas: this.storage.get(KEYS.mascotas) ?? [],
      citas: this.storage.get(KEYS.citas) ?? [],
      historial: this.storage.get(KEYS.historial) ?? []
    };
  }

  descargarJson(): void {
    const data = this.exportar();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patitas-bigotes-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  restaurarDemo(): void {
    this.storage.set(KEYS.duenos, [...DUENOS_INICIALES]);
    this.storage.set(KEYS.mascotas, [...MASCOTAS_INICIALES]);
    this.storage.set(KEYS.citas, [...CITAS_INICIALES]);
    this.storage.set(KEYS.historial, [...HISTORIAL_INICIAL]);
    this.storage.remove(KEYS.auditoria);
  }

  importar(data: BackupData): boolean {
    if (!data.duenos || !data.mascotas) return false;
    this.storage.set(KEYS.duenos, data.duenos);
    this.storage.set(KEYS.mascotas, data.mascotas);
    if (data.citas) this.storage.set(KEYS.citas, data.citas);
    if (data.historial) this.storage.set(KEYS.historial, data.historial);
    return true;
  }
}
