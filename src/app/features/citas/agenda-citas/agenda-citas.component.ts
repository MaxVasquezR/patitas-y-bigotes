import { Component, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CitaService } from '../../../core/services/cita.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { DuenoService } from '../../../core/services/dueno.service';
import { Cita, EstadoCita } from '../../../core/models/cita.model';
import { CitaEntity } from '../../../core/models/entities/cita.entity';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToastService } from '../../../core/services/toast.service';
import { EstadoCitaPipe } from '../../../shared/pipes/estado-cita.pipe';
import { FechaCitaPipe } from '../../../shared/pipes/fecha-cita.pipe';
import { TelefonoPipe } from '../../../shared/pipes/telefono.pipe';
import { CitaProximaDirective } from '../../../shared/directives/cita-proxima.directive';
import { EstadoBadgeDirective } from '../../../shared/directives/estado-badge.directive';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { DIAS_SEMANA, ESTADOS_CITA } from '../../../core/constants/app.constants';

export interface DiaCalendario {
  fecha: string;
  dia: number;
  vacio: boolean;
}

@Component({
  selector: 'app-agenda-citas',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    EstadoCitaPipe, FechaCitaPipe, TelefonoPipe,
    CitaProximaDirective, EstadoBadgeDirective,
    PageHeaderComponent, StatCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agenda-citas.component.html',
  styleUrls: ['./agenda-citas.component.scss']
})
export class AgendaCitasComponent {
  readonly diasSemana = DIAS_SEMANA;
  readonly estadosCita = ESTADOS_CITA;

  fechaSeleccionada = signal(new Date().toISOString().split('T')[0]);
  filtroEstadoControl = new FormControl<EstadoCita | ''>('', { nonNullable: true });
  private filtroEstado = signal<EstadoCita | ''>('');

  citas = computed(() => {
    const lista = this.citaService.citas();
    const estado = this.filtroEstado();
    const filtradas = estado ? lista.filter(c => c.estado === estado) : lista;
    return [...filtradas].sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));
  });

  citasDelDia = computed(() =>
    this.citas().filter(c => c.fecha === this.fechaSeleccionada())
  );

  proximasCitas = computed(() => {
    this.citaService.citas();
    return this.citaService.getProximasCitas().slice(0, 5);
  });

  diasDelMes = computed(() => this.generarDiasMes());

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private duenoService: DuenoService,
    private auth: AuthService,
    private audit: AuditService,
    private confirmService: ConfirmService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.filtroEstadoControl.valueChanges.subscribe(v => this.filtroEstado.set(v));
  }

  asEntity(cita: Cita): CitaEntity {
    return CitaEntity.from(cita);
  }

  nombreMascota(cita: Cita): string {
    return this.mascotaService.getMascotaById(cita.mascotaId)?.nombre ?? '';
  }

  nombreDueno(cita: Cita): string {
    const m = this.mascotaService.getMascotaById(cita.mascotaId);
    const d = m ? this.duenoService.getDuenoById(m.duenoId) : undefined;
    return d ? `${d.nombre} ${d.apellido}` : '';
  }

  telefonoDueno(cita: Cita): string {
    const m = this.mascotaService.getMascotaById(cita.mascotaId);
    const d = m ? this.duenoService.getDuenoById(m.duenoId) : undefined;
    return d?.telefono ?? '';
  }

  cambiarEstado(id: string, estado: EstadoCita): void {
    const cita = this.citaService.getCitaById(id);
    this.citaService.updateEstado(id, estado);
    const s = this.auth.getSesionActual();
    if (s && cita) this.audit.registrar(s.nombre, s.rol, 'ACTUALIZAR', `Cita ${this.nombreMascota(cita)} → ${estado}`);
    this.toastService.success(`Cita ${estado}`);
  }

  completarCita(cita: Cita): void {
    this.router.navigate(['/atencion', cita.id]);
  }

  async eliminar(id: string): Promise<void> {
    const ok = await this.confirmService.confirm('¿Eliminar esta cita?', 'Eliminar cita');
    if (ok) {
      const cita = this.citaService.getCitaById(id);
      this.citaService.deleteCita(id);
      const s = this.auth.getSesionActual();
      if (s && cita) this.audit.registrar(s.nombre, s.rol, 'ELIMINAR', `Cita ${this.nombreMascota(cita)} eliminada`);
      this.toastService.success('Cita eliminada');
    }
  }

  tieneCitas(fecha: string): boolean {
    return this.citas().some(c => c.fecha === fecha);
  }

  citasCanceladas(fecha: string): boolean {
    const delDia = this.citas().filter(c => c.fecha === fecha);
    return delDia.length > 0 && delDia.every(c => c.estado === 'cancelada');
  }

  esHoy(fecha: string): boolean {
    return fecha === new Date().toISOString().split('T')[0];
  }

  generarDiasMes(): DiaCalendario[] {
    const [y, m] = this.fechaSeleccionada().split('-').map(Number);
    const primerDia = new Date(y, m - 1, 1).getDay();
    const ultimo = new Date(y, m, 0).getDate();
    const dias: DiaCalendario[] = [];

    for (let i = 0; i < primerDia; i++) {
      dias.push({ fecha: '', dia: 0, vacio: true });
    }
    for (let d = 1; d <= ultimo; d++) {
      const fecha = new Date(y, m - 1, d).toISOString().split('T')[0];
      dias.push({ fecha, dia: d, vacio: false });
    }
    return dias;
  }

  get mesAnio(): string {
    const [y, m] = this.fechaSeleccionada().split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
  }

  cambiarMes(delta: number): void {
    const [y, m] = this.fechaSeleccionada().split('-').map(Number);
    const nueva = new Date(y, m - 1 + delta, 1);
    this.fechaSeleccionada.set(nueva.toISOString().split('T')[0]);
  }

  seleccionarDia(fecha: string): void {
    if (fecha) this.fechaSeleccionada.set(fecha);
  }

  trackByCitaId(_index: number, cita: { id: string }): string {
    return cita.id;
  }

  trackByDia(_index: number, dia: DiaCalendario): string {
    return dia.vacio ? `empty-${_index}` : dia.fecha;
  }
}
