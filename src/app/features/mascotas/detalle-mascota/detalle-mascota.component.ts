import { Component, OnInit, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../../core/services/mascota.service';
import { CitaService } from '../../../core/services/cita.service';
import { HistorialService } from '../../../core/services/historial.service';
import { AuthService } from '../../../core/services/auth.service';
import { EspeciePipe } from '../../../shared/pipes/especie.pipe';
import { EdadPipe } from '../../../shared/pipes/edad.pipe';
import { EstadoCitaPipe } from '../../../shared/pipes/estado-cita.pipe';
import { TelefonoPipe } from '../../../shared/pipes/telefono.pipe';
import { EstadoBadgeDirective } from '../../../shared/directives/estado-badge.directive';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

type TabFicha = 'resumen' | 'citas' | 'historial' | 'peso';

@Component({
  selector: 'app-detalle-mascota',
  standalone: true,
  imports: [
    CommonModule, RouterLink, EspeciePipe, EdadPipe, EstadoCitaPipe,
    TelefonoPipe, EstadoBadgeDirective, PageHeaderComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './detalle-mascota.component.html',
  styleUrls: ['./detalle-mascota.component.scss']
})
export class DetalleMascotaComponent implements OnInit {
  private mascotaId = signal('');
  tabActiva = signal<TabFicha>('resumen');

  readonly mascota = computed(() => this.mascotaService.getMascotaById(this.mascotaId()));

  readonly citas = computed(() => {
    this.citaService.citas();
    const id = this.mascotaId();
    return id
      ? [...this.citaService.getCitasByMascota(id)].sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora))
      : [];
  });

  readonly historial = computed(() => {
    this.historialService.registros();
    const id = this.mascotaId();
    return id ? this.historialService.getHistorialByMascota(id) : [];
  });

  readonly evolucionPeso = computed(() => {
    const id = this.mascotaId();
    return id ? this.historialService.getEvolucionPeso(id) : [];
  });

  readonly puedeEliminar = computed(() => this.auth.puedeEliminar());

  constructor(
    private route: ActivatedRoute,
    private mascotaService: MascotaService,
    private citaService: CitaService,
    private historialService: HistorialService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.mascotaId.set(id);
    const tab = this.route.snapshot.queryParamMap.get('tab') as TabFicha | null;
    if (tab && ['resumen', 'citas', 'historial', 'peso'].includes(tab)) {
      this.tabActiva.set(tab);
    }
  }

  cambiarTab(tab: TabFicha): void {
    this.tabActiva.set(tab);
  }

  trackByCitaId(_index: number, cita: { id: string }): string {
    return cita.id;
  }

  trackByRegistroId(_index: number, r: { id: string }): string {
    return r.id;
  }

  trackByPeso(_index: number, p: { fecha: string }): string {
    return p.fecha;
  }
}
