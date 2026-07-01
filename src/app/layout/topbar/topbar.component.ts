import { Component, ChangeDetectionStrategy, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CLINICA_NOMBRE } from '../../core/constants/app.constants';
import { SidebarService } from '../../core/services/sidebar.service';
import { RoleBadgeComponent } from '../../shared/components/role-badge/role-badge.component';
import { BusquedaService, ResultadoBusqueda } from '../../core/services/busqueda.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RoleBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  readonly clinicaNombre = CLINICA_NOMBRE;
  readonly busquedaControl = new FormControl('', { nonNullable: true });
  readonly resultados = signal<ResultadoBusqueda[]>([]);
  readonly mostrarResultados = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    readonly sidebarService: SidebarService,
    private busquedaService: BusquedaService,
    private router: Router
  ) {
    this.busquedaControl.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(q => {
      const res = this.busquedaService.buscar(q);
      this.resultados.set(res);
      this.mostrarResultados.set(q.trim().length >= 2);
    });
  }

  irA(resultado: ResultadoBusqueda): void {
    this.mostrarResultados.set(false);
    this.busquedaControl.setValue('');
    this.router.navigateByUrl(resultado.ruta);
  }

  cerrarBusqueda(): void {
    this.mostrarResultados.set(false);
  }

  iconoTipo(tipo: ResultadoBusqueda['tipo']): string {
    const map = { mascota: 'bi-heart-pulse', propietario: 'bi-person', cita: 'bi-calendar-event' };
    return map[tipo];
  }
}
