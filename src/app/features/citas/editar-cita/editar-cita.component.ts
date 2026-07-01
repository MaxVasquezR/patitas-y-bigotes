import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../../core/services/cita.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';
import { Mascota } from '../../../core/models/mascota.model';
import { HORAS_DISPONIBLES, TIPOS_CITA, VETERINARIOS, ESTADOS_CITA } from '../../../core/constants/app.constants';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { getFormErrorMessage, isFieldInvalid, isFieldValid } from '../../../shared/utils/form-errors.util';
import { EstadoCita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-editar-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editar-cita.component.html',
  styleUrls: ['./editar-cita.component.scss']
})
export class EditarCitaComponent implements OnInit {
  form: FormGroup;
  citaId = '';
  noEncontrada = false;

  readonly tipos = TIPOS_CITA;
  readonly veterinarios = VETERINARIOS;
  readonly horas = HORAS_DISPONIBLES;
  readonly estados = ESTADOS_CITA;

  mascotas: Mascota[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private auth: AuthService,
    private audit: AuditService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      mascotaId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      tipo: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.minLength(5)]],
      veterinario: ['', Validators.required],
      estado: ['', Validators.required],
      notas: ['']
    });
  }

  ngOnInit(): void {
    this.mascotas = this.mascotaService.getMascotas();
    this.citaId = this.route.snapshot.paramMap.get('id') ?? '';
    const c = this.citaService.getCitaById(this.citaId);
    if (!c) {
      this.noEncontrada = true;
      return;
    }
    this.form.patchValue({
      mascotaId: c.mascotaId,
      fecha: c.fecha,
      hora: c.hora,
      tipo: c.tipo,
      motivo: c.motivo,
      veterinario: c.veterinario,
      estado: c.estado,
      notas: c.notas ?? ''
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const m = this.mascotas.find(x => x.id === v.mascotaId);
    if (!m) {
      this.toast.warning('Seleccione una mascota válida');
      return;
    }

    const resultado = this.citaService.updateCita(this.citaId, {
      mascotaId: v.mascotaId,
      nombreMascota: m.nombre,
      nombreDueno: `${m.dueno.nombre} ${m.dueno.apellido}`,
      telefonoDueno: m.dueno.telefono,
      fecha: v.fecha,
      hora: v.hora,
      tipo: v.tipo,
      motivo: v.motivo,
      veterinario: v.veterinario,
      estado: v.estado as EstadoCita,
      notas: v.notas
    });

    if (!resultado.valido) {
      this.toast.warning(resultado.mensaje ?? 'No se pudo actualizar la cita');
      return;
    }

    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'EDITAR', `Cita ${m.nombre} ${v.fecha} actualizada`);

    this.toast.success('Cita actualizada');
    this.router.navigate(['/citas']);
  }

  errorMsg(campo: string): string {
    const c = this.form.get(campo);
    return getFormErrorMessage(c?.errors, !!c?.touched);
  }

  isInvalid(campo: string): boolean {
    const c = this.form.get(campo);
    return isFieldInvalid(c?.invalid, c?.touched);
  }

  isValid(campo: string): boolean {
    const c = this.form.get(campo);
    return isFieldValid(c?.valid, c?.touched);
  }
}
