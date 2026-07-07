import { Dueno } from '../mascota.model';

export class DuenoEntity {
  constructor(private readonly data: Dueno) {}

  get id(): string { return this.data.id; }
  get nombre(): string { return this.data.nombre; }
  get apellido(): string { return this.data.apellido; }
  get telefono(): string { return this.data.telefono; }
  get direccion(): string { return this.data.direccion; }

  get nombreCompleto(): string {
    return `${this.data.nombre} ${this.data.apellido}`;
  }

  get telefonoFormateado(): string {
    const t = this.data.telefono;
    if (t.length === 9) {
      return `${t.slice(0, 3)} ${t.slice(3, 6)} ${t.slice(6)}`;
    }
    return t;
  }

  toJSON(): Dueno {
    return { ...this.data };
  }

  static from(data: Dueno): DuenoEntity {
    return new DuenoEntity(data);
  }
}
