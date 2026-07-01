import { Component, OnInit, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HistorialService } from '../../../core/services/historial.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { ToastService } from '../../../core/services/toast.service';
import { RegistroHistorial } from '../../../core/models/historial.model';
import { EspeciePipe } from '../../../shared/pipes/especie.pipe';
import { EdadPipe } from '../../../shared/pipes/edad.pipe';
import { TelefonoPipe } from '../../../shared/pipes/telefono.pipe';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { VETERINARIOS, MUCOSAS_OPCIONES } from '../../../core/constants/app.constants';
import { getFormErrorMessage, isFieldInvalid, isFieldValid } from '../../../shared/utils/form-errors.util';
import { temperaturaValidator, scrollToFirstInvalid } from '../../../shared/utils/form-validators.util';
import { SiPermisoDirective } from '../../../shared/directives/si-permiso.directive';
import { FormRequiredLegendComponent } from '../../../shared/components/form-required-legend/form-required-legend.component';

@Component({
  selector: 'app-historial-mascota',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    EspeciePipe, EdadPipe, TelefonoPipe, PageHeaderComponent,
    SiPermisoDirective, FormRequiredLegendComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './historial-mascota.component.html',
  styleUrls: ['./historial-mascota.component.scss']
})
export class HistorialMascotaComponent implements OnInit {
  private mascotaId = signal('');
  registroExpandido = signal<string | null>(null);
  mostrarFormulario = signal(false);
  registroEditandoId = signal<string | null>(null);
  citaOrigenId = signal<string | null>(null);

  readonly veterinarios = VETERINARIOS;
  readonly mucosasOpciones = MUCOSAS_OPCIONES;
  form: FormGroup;

  readonly mascota = computed(() => this.mascotaService.getMascotaById(this.mascotaId()));
  readonly puedeEliminar = computed(() => this.auth.puedeEliminar());

  readonly historial = computed(() => {
    this.historialService.registros();
    const id = this.mascotaId();
    return id ? this.historialService.getHistorialByMascota(id) : [];
  });

  readonly ultimoRegistro = computed(() => this.historial()[0] ?? undefined);

  readonly tituloFormulario = computed(() =>
    this.registroEditandoId() ? 'Editar registro clínico' : 'Nuevo registro clínico'
  );

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private historialService: HistorialService,
    private mascotaService: MascotaService,
    private citaService: CitaService,
    private auth: AuthService,
    private audit: AuditService,
    private confirm: ConfirmService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
      veterinario: ['', Validators.required],
      motivoConsulta: ['', [Validators.required, Validators.minLength(5)]],
      diagnostico: ['', [Validators.required, Validators.minLength(5)]],
      tratamiento: ['', Validators.required],
      peso: ['', [Validators.required, Validators.min(0.1)]],
      temperatura: ['', [Validators.required, temperaturaValidator()]],
      frecuenciaCardiaca: ['', [Validators.min(40), Validators.max(220)]],
      frecuenciaRespiratoria: ['', [Validators.min(5), Validators.max(80)]],
      mucosas: [''],
      observaciones: [''],
      proximaVisita: [''],
      medicamentos: this.fb.array([])
    });
  }

  get medicamentos(): FormArray {
    return this.form.get('medicamentos') as FormArray;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.mascotaId.set(id);
    const m = this.mascotaService.getMascotaById(id);
    if (m) this.form.patchValue({ peso: m.peso });

    const citaId = this.route.snapshot.queryParamMap.get('citaId');
    const nuevo = this.route.snapshot.queryParamMap.get('nuevo');
    if (citaId && nuevo === '1') {
      this.prefillDesdeCita(citaId);
    }
  }

  private prefillDesdeCita(citaId: string): void {
    const cita = this.citaService.getCitaById(citaId);
    if (!cita) return;
    this.citaOrigenId.set(citaId);
    this.abrirFormulario();
    this.form.patchValue({
      veterinario: cita.veterinario,
      motivoConsulta: cita.motivo,
      fecha: new Date().toISOString().split('T')[0]
    });
  }

  abrirFormulario(): void {
    this.registroEditandoId.set(null);
    this.mostrarFormulario.set(true);
    if (this.medicamentos.length === 0) this.agregarMedicamento();
  }

  abrirEdicion(registro: RegistroHistorial): void {
    if (!this.historialService.puedeEditarRegistro(registro.id, this.auth.isAdmin())) {
      this.toast.warning(this.auth.mensajeSinPermiso('editar registros con más de 24 horas'));
      return;
    }
    this.registroEditandoId.set(registro.id);
    this.mostrarFormulario.set(true);
    this.medicamentos.clear();
    this.form.patchValue({
      fecha: registro.fecha,
      veterinario: registro.veterinario,
      motivoConsulta: registro.motivoConsulta,
      diagnostico: registro.diagnostico,
      tratamiento: registro.tratamiento,
      peso: registro.peso,
      temperatura: registro.temperatura,
      frecuenciaCardiaca: registro.frecuenciaCardiaca ?? '',
      frecuenciaRespiratoria: registro.frecuenciaRespiratoria ?? '',
      mucosas: registro.mucosas ?? '',
      observaciones: registro.observaciones ?? '',
      proximaVisita: registro.proximaVisita ?? ''
    });
    for (const med of registro.medicamentos) {
      this.medicamentos.push(this.fb.group({
        nombre: [med.nombre, Validators.required],
        dosis: [med.dosis, Validators.required],
        duracion: [med.duracion, Validators.required]
      }));
    }
    if (this.medicamentos.length === 0) this.agregarMedicamento();
  }

  cerrarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.registroEditandoId.set(null);
    this.citaOrigenId.set(null);
    this.form.reset({ fecha: new Date().toISOString().split('T')[0] });
    this.medicamentos.clear();
    const m = this.mascota();
    if (m) this.form.patchValue({ peso: m.peso });
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

  guardarRegistro(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      scrollToFirstInvalid();
      this.toast.warning('Complete los campos obligatorios del registro clínico');
      return;
    }
    const v = this.form.value;
    const id = this.mascotaId();
    const editId = this.registroEditandoId();
    const datos = {
      mascotaId: id,
      fecha: v.fecha,
      veterinario: v.veterinario,
      motivoConsulta: v.motivoConsulta,
      diagnostico: v.diagnostico,
      tratamiento: v.tratamiento,
      peso: +v.peso,
      temperatura: +v.temperatura,
      frecuenciaCardiaca: v.frecuenciaCardiaca ? +v.frecuenciaCardiaca : undefined,
      frecuenciaRespiratoria: v.frecuenciaRespiratoria ? +v.frecuenciaRespiratoria : undefined,
      mucosas: v.mucosas || undefined,
      observaciones: v.observaciones ?? '',
      proximaVisita: v.proximaVisita || undefined,
      medicamentos: v.medicamentos ?? [],
      citaId: this.citaOrigenId() ?? undefined
    };

    const s = this.auth.getSesionActual();

    if (editId) {
      this.historialService.updateRegistro(editId, datos, s?.nombre);
      if (s) this.audit.registrar(s.nombre, s.rol, 'EDITAR', `Registro clínico ${editId} actualizado`);
      this.toast.success('Registro actualizado');
    } else {
      this.historialService.addRegistro(datos, s?.nombre);
      const citaId = this.citaOrigenId();
      if (citaId) this.citaService.updateEstado(citaId, 'completada');
      if (s) this.audit.registrar(s.nombre, s.rol, 'CREAR', `Registro clínico para mascota ${id}`);
      this.toast.success('Registro clínico guardado');
    }

    this.mascotaService.updateMascota(id, { peso: +v.peso });
    this.cerrarFormulario();
  }

  async eliminarRegistro(registro: RegistroHistorial): Promise<void> {
    const ok = await this.confirm.confirm('¿Eliminar este registro clínico?', 'Eliminar registro');
    if (!ok) return;
    this.historialService.deleteRegistro(registro.id);
    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'ELIMINAR', `Registro ${registro.id} eliminado`);
    this.toast.success('Registro eliminado');
  }

  toggleExpand(id: string): void {
    this.registroExpandido.set(this.registroExpandido() === id ? null : id);
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

  trackByRegistroId(_index: number, registro: { id: string }): string {
    return registro.id;
  }
}
