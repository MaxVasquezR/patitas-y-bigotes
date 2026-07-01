import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'edad', standalone: true })
export class EdadPipe implements PipeTransform {
  transform(fechaNacimiento: string): string {
    const hoy = new Date();
    const nac = new Date(fechaNacimiento);
    let anios = hoy.getFullYear() - nac.getFullYear();
    let meses = hoy.getMonth() - nac.getMonth();
    if (meses < 0) { anios--; meses += 12; }
    if (anios === 0) return `${meses} mes${meses !== 1 ? 'es' : ''}`;
    if (meses === 0) return `${anios} año${anios !== 1 ? 's' : ''}`;
    return `${anios} año${anios !== 1 ? 's' : ''} y ${meses} mes${meses !== 1 ? 'es' : ''}`;
  }
}
