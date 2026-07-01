import { Mascota } from '../mascota.model';
import { DuenoEntity } from './dueno.entity';

export class MascotaEntity {
  constructor(private readonly data: Mascota) {}

  get id(): string { return this.data.id; }
  get nombre(): string { return this.data.nombre; }
  get especie() { return this.data.especie; }
  get raza(): string { return this.data.raza; }
  get peso(): number { return this.data.peso; }
  get dueno(): DuenoEntity { return DuenoEntity.from(this.data.dueno); }

  calcularEdad(): string {
    const hoy = new Date();
    const nac = new Date(this.data.fechaNacimiento);
    let anios = hoy.getFullYear() - nac.getFullYear();
    let meses = hoy.getMonth() - nac.getMonth();
    if (meses < 0) { anios--; meses += 12; }
    if (anios === 0) return `${meses} mes${meses !== 1 ? 'es' : ''}`;
    if (meses === 0) return `${anios} año${anios !== 1 ? 's' : ''}`;
    return `${anios} año${anios !== 1 ? 's' : ''} y ${meses} mes${meses !== 1 ? 'es' : ''}`;
  }

  toJSON(): Mascota {
    return { ...this.data };
  }

  static from(data: Mascota): MascotaEntity {
    return new MascotaEntity(data);
  }
}
