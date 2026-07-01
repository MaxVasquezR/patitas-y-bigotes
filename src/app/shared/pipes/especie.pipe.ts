import { Pipe, PipeTransform } from '@angular/core';
import { EspecieMascota } from '../../core/models/mascota.model';

@Pipe({ name: 'especie', standalone: true })
export class EspeciePipe implements PipeTransform {
  private readonly iconos: Record<EspecieMascota, string> = {
    perro: 'bi-heart-pulse',
    gato: 'bi-bandaid',
    ave: 'bi-wind',
    conejo: 'bi-droplet',
    otro: 'bi-patch-plus'
  };

  transform(especie: EspecieMascota, modo: 'icono' | 'label' | 'completo' = 'completo'): string {
    const labels: Record<EspecieMascota, string> = {
      perro: 'Perro',
      gato: 'Gato',
      ave: 'Ave',
      conejo: 'Conejo',
      otro: 'Otro'
    };
    if (modo === 'icono') return this.iconos[especie] ?? 'bi-patch-plus';
    if (modo === 'label') return labels[especie] ?? especie;
    return labels[especie] ?? especie;
  }
}
