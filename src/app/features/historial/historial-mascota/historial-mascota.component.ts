import { Component, OnInit, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HistorialService } from '../../../core/services/historial.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { DuenoService } from '../../../core/services/dueno.service';
import { EspeciePipe } from '../../../shared/pipes/especie.pipe';
import { EdadPipe } from '../../../shared/pipes/edad.pipe';
import { TelefonoPipe } from '../../../shared/pipes/telefono.pipe';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-historial-mascota',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    EspeciePipe, EdadPipe, TelefonoPipe, PageHeaderComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './historial-mascota.component.html',
  styleUrls: ['./historial-mascota.component.scss']
})
export class HistorialMascotaComponent implements OnInit {
  private mascotaId = signal('');
  registroExpandido = signal<string | null>(null);

  readonly mascota = computed(() => this.mascotaService.getMascotaById(this.mascotaId()));
  readonly dueno = computed(() => {
    const m = this.mascota();
    return m ? this.duenoService.getDuenoById(m.duenoId) : undefined;
  });

  readonly historial = computed(() => {
    this.historialService.registros();
    const id = this.mascotaId();
    return id ? this.historialService.getHistorialByMascota(id) : [];
  });

  readonly ultimoRegistro = computed(() => this.historial()[0] ?? undefined);

  constructor(
    private route: ActivatedRoute,
    private historialService: HistorialService,
    private mascotaService: MascotaService,
    private duenoService: DuenoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.mascotaId.set(id);
  }

  toggleExpand(id: string): void {
    this.registroExpandido.set(this.registroExpandido() === id ? null : id);
  }

  trackByRegistroId(_index: number, registro: { id: string }): string {
    return registro.id;
  }
}
