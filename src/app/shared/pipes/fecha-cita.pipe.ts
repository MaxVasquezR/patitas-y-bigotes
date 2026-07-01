import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fechaCita', standalone: true })
export class FechaCitaPipe implements PipeTransform {
  transform(fecha: string, hora?: string): string {
    if (!fecha) return '';
    const date = new Date(fecha + 'T00:00:00');
    const formateada = date.toLocaleDateString('es-PE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    return hora ? `${formateada} · ${hora}` : formateada;
  }
}
