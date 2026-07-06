import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../../core/services/cita.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { DuenoService } from '../../../core/services/dueno.service';
import { HistorialService } from '../../../core/services/historial.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';
import { Cita } from '../../../core/models/cita.model';
import { Mascota, Dueno } from '../../../core/models/mascota.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormRequiredLegendComponent } from '../../../shared/components/form-required-legend/form-required-legend.component';
import { getFormErrorMessage, isFieldInvalid } from '../../../shared/utils/form-errors.util';
import { scrollToFirstInvalid } from '../../../shared/utils/form-validators.util';

@Component({
  selector: 'app-atender-cita',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, FormRequiredLegendComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './atender-cita.component.html',
  styleUrls: ['./atender-cita.component.scss']
})
export class AtenderCitaComponent implements OnInit {
  form: FormGroup;
  citaId = '';
  noEncontrada = false;
  veterinario = '';

  cita?: Cita;
  mascota?: Mascota;
  dueno?: Dueno;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private duenoService: DuenoService,
    private historialService: HistorialService,
    private auth: AuthService,
    private audit: AuditService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      diagnostico: ['', [Validators.required, Validators.minLength(5)]],
      observaciones: [''],
      tratamiento: ['', Validators.required],
      medicamentos: this.fb.array([])
    });
  }

  get medicamentos(): FormArray {
    return this.form.get('medicamentos') as FormArray;
  }

  ngOnInit(): void {
    this.citaId = this.route.snapshot.paramMap.get('citaId') ?? '';
    const cita = this.citaService.getCitaById(this.citaId);
    if (!cita) {
      this.noEncontrada = true;
      return;
    }
    this.cita = cita;
    this.mascota = this.mascotaService.getMascotaById(cita.mascotaId);
    this.dueno = this.mascota ? this.duenoService.getDuenoById(this.mascota.duenoId) : undefined;
    this.veterinario = this.auth.getSesionActual()?.nombre ?? '';
  }

  agregarMedicamento(): void {
    this.medicamentos.push(this.fb.group({
      nombre: ['', Validators.required],
      dosis: ['', Validators.required],
      duracion: ['', Validators.required]
    }));
  }

  quitarMedicamento(index: number): void {
    this.medicamentos.removeAt(index);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      scrollToFirstInvalid();
      this.toast.warning('Complete los campos obligatorios');
      return;
    }
    if (!this.cita || !this.mascota) return;

    const v = this.form.value;
    const s = this.auth.getSesionActual();

    this.historialService.addRegistro({
      mascotaId: this.mascota.id,
      citaId: this.cita.id,
      fecha: new Date().toISOString().split('T')[0],
      veterinario: this.veterinario,
      motivoConsulta: this.cita.motivo,
      diagnostico: v.diagnostico,
      tratamiento: v.tratamiento,
      medicamentos: v.medicamentos ?? [],
      peso: this.mascota.peso,
      observaciones: v.observaciones || ''
    }, s?.nombre);

    this.citaService.updateEstado(this.cita.id, 'completada');

    if (s) this.audit.registrar(s.nombre, s.rol, 'CREAR', `Atención registrada para mascota ${this.mascota.nombre}`);

    this.toast.success('Atención guardada y cita completada');
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
}
