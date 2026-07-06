import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../../core/services/cita.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { DuenoService } from '../../../core/services/dueno.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';
import { Mascota } from '../../../core/models/mascota.model';
import { HORAS_DISPONIBLES, TIPOS_CITA, VETERINARIOS } from '../../../core/constants/app.constants';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TelefonoPipe } from '../../../shared/pipes/telefono.pipe';
import { getFormErrorMessage, isFieldInvalid, isFieldValid } from '../../../shared/utils/form-errors.util';

@Component({
  selector: 'app-nueva-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, TelefonoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nueva-cita.component.html',
  styleUrls: ['./nueva-cita.component.scss']
})
export class NuevaCitaComponent implements OnInit {
  form: FormGroup;
  guardado = false;

  readonly tipos = TIPOS_CITA;
  readonly veterinarios = VETERINARIOS;
  readonly horas = HORAS_DISPONIBLES;

  mascotas: Mascota[] = [];

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private duenoService: DuenoService,
    private auth: AuthService,
    private audit: AuditService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      mascotaId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      tipo: ['', Validators.required],
      motivo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
      veterinario: ['', Validators.required],
      notas: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.mascotas = this.mascotaService.getMascotas();
    const mascotaId = this.route.snapshot.queryParamMap.get('mascotaId');
    if (mascotaId) this.form.patchValue({ mascotaId });
  }

  get mascotaSeleccionada(): Mascota | undefined {
    const id = this.form.get('mascotaId')?.value;
    return this.mascotas.find(m => m.id === id);
  }

  nombreDueno(m: Mascota): string {
    const d = this.duenoService.getDuenoById(m.duenoId);
    return d ? `${d.nombre} ${d.apellido}` : '';
  }

  telefonoDueno(m: Mascota): string {
    return this.duenoService.getDuenoById(m.duenoId)?.telefono ?? '';
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const m = this.mascotaSeleccionada!;
    const resultado = this.citaService.addCita({
      mascotaId: v.mascotaId,
      fecha: v.fecha,
      hora: v.hora,
      tipo: v.tipo,
      motivo: v.motivo,
      estado: 'pendiente',
      veterinario: v.veterinario,
      notas: v.notas
    });

    if (!resultado.valido) {
      this.toastService.warning(resultado.mensaje ?? 'No se pudo agendar la cita');
      return;
    }

    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'CREAR', `Cita ${m.nombre} ${v.fecha} ${v.hora}`);
    this.guardado = true;
    this.toastService.success('Cita agendada correctamente');
    setTimeout(() => this.router.navigate(['/citas']), 1500);
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
