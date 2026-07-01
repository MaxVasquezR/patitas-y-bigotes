import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'telefono', standalone: true })
export class TelefonoPipe implements PipeTransform {
  transform(valor: string): string {
    if (!valor) return '';
    const limpio = valor.replace(/\D/g, '');
    if (limpio.length === 9) {
      return `${limpio.slice(0, 3)} ${limpio.slice(3, 6)} ${limpio.slice(6)}`;
    }
    return valor;
  }
}
