import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CitasBannerService, CitaBanner } from '../../../core/services/citas-banner.service';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';
import { EstadoCita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-citas-banner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './citas-banner.component.html',
  styleUrls: ['./citas-banner.component.scss']
})
export class CitasBannerComponent {
  private readonly bannerService = inject(CitasBannerService);
  private readonly citaService = inject(CitaService);
  private readonly auth = inject(AuthService);
  private readonly audit = inject(AuditService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly citas = computed(() => {
    this.citaService.citas();
    return this.bannerService.getCitasDestacadas();
  });

  readonly visible = computed(() => this.citas().length > 0);

  claseUrgencia(item: CitaBanner): string {
    return `banner-${item.urgencia}`;
  }

  confirmar(item: CitaBanner, event: Event): void {
    event.stopPropagation();
    this.cambiarEstado(item, 'confirmada');
  }

  atender(item: CitaBanner, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/historial', item.cita.mascotaId], {
      queryParams: { citaId: item.cita.id, nuevo: '1' }
    });
  }

  verAgenda(): void {
    this.router.navigate(['/citas']);
  }

  private cambiarEstado(item: CitaBanner, estado: EstadoCita): void {
    this.citaService.updateEstado(item.cita.id, estado);
    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'ACTUALIZAR', `Cita ${item.cita.nombreMascota} → ${estado}`);
    this.toast.success(`Cita ${estado}`);
  }

  trackById(_i: number, item: CitaBanner): string {
    return item.cita.id;
  }
}
