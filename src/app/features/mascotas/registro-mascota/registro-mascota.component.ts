import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../../core/services/mascota.service';
import { DuenoService } from '../../../core/services/dueno.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';
import { ESPECIES, SEXOS, ESTADOS_MASCOTA } from '../../../core/constants/app.constants';
import { Dueno } from '../../../core/models/mascota.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormRequiredLegendComponent } from '../../../shared/components/form-required-legend/form-required-legend.component';
import { getFormErrorMessage, isFieldInvalid, isFieldValid } from '../../../shared/utils/form-errors.util';
import { documentoValidator, noFutureDateValidator, scrollToFirstInvalid } from '../../../shared/utils/form-validators.util';

type ModoDueno = 'existente' | 'nuevo';

@Component({
  selector: 'app-registro-mascota',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, FormRequiredLegendComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registro-mascota.component.html',
  styleUrls: ['./registro-mascota.component.scss']
})
export class RegistroMascotaComponent implements OnInit {
  form: FormGroup;
  pasoActual = 1;
  modoDueno = signal<ModoDueno>('nuevo');
  propietarios: Dueno[] = [];

  readonly especies = ESPECIES;
  readonly sexos = SEXOS;
  readonly estados = ESTADOS_MASCOTA;

  constructor(
    private fb: FormBuilder,
    private mascotaService: MascotaService,
    private duenoService: DuenoService,
    private auth: AuthService,
    private audit: AuditService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      especie: ['', Validators.required],
      otraEspecie: ['', Validators.maxLength(50)],
      raza: ['', [Validators.required, Validators.maxLength(80)]],
      fechaNacimiento: ['', [Validators.required, noFutureDateValidator()]],
      sexo: ['', Validators.required],
      peso: ['', [Validators.required, Validators.min(0.1)]],
      color: ['', [Validators.required, Validators.maxLength(100)]],
      microchip: ['', Validators.maxLength(20)],
      alergias: ['', Validators.maxLength(300)],
      castrado: [false],
      estado: ['activo', Validators.required],
      observaciones: ['', Validators.maxLength(500)],
      dueno_modo: ['nuevo'],
      dueno_id: [''],
      dueno_nombre: ['', [Validators.required, Validators.minLength(2)]],
      dueno_apellido: ['', [Validators.required, Validators.minLength(2)]],
      dueno_numeroDocumento: ['', [Validators.required, documentoValidator()]],
      dueno_telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      dueno_email: ['', Validators.email],
      dueno_direccion: ['', [Validators.required, Validators.maxLength(200)]],
      dueno_distrito: ['', [Validators.required, Validators.maxLength(80)]]
    });
  }

  ngOnInit(): void {
    this.propietarios = this.duenoService.getDuenos();
    const duenoId = this.route.snapshot.queryParamMap.get('duenoId');
    if (duenoId) {
      this.setModoDueno('existente');
      this.form.patchValue({ dueno_id: duenoId });
      this.onDuenoSeleccionado();
    }
    this.form.get('dueno_modo')?.valueChanges.subscribe(m => this.setModoDueno(m as ModoDueno));
    this.form.get('especie')?.valueChanges.subscribe(e => this.setOtraEspecieValidator(e));
  }

  private setOtraEspecieValidator(especie: string): void {
    const ctrl = this.form.get('otraEspecie');
    if (especie === 'otro') {
      ctrl?.setValidators([Validators.required, Validators.maxLength(50)]);
    } else {
      ctrl?.setValidators([Validators.maxLength(50)]);
    }
    ctrl?.updateValueAndValidity();
  }

  setModoDueno(modo: ModoDueno): void {
    this.modoDueno.set(modo);
    const idCtrl = this.form.get('dueno_id');
    if (modo === 'existente') {
      idCtrl?.setValidators([Validators.required]);
      this.clearDuenoNuevoValidators();
    } else {
      idCtrl?.clearValidators();
      this.setDuenoNuevoValidators();
    }
    idCtrl?.updateValueAndValidity();
  }

  onDuenoSeleccionado(): void {
    const id = this.form.get('dueno_id')?.value;
    const d = this.duenoService.getDuenoById(id);
    if (!d) return;
    this.form.patchValue({
      dueno_nombre: d.nombre,
      dueno_apellido: d.apellido,
      dueno_numeroDocumento: d.numeroDocumento,
      dueno_telefono: d.telefono,
      dueno_email: d.email,
      dueno_direccion: d.direccion,
      dueno_distrito: d.distrito
    });
  }

  paso1Valido(): boolean {
    return ['nombre', 'especie', 'otraEspecie', 'raza', 'fechaNacimiento', 'sexo', 'peso', 'color', 'estado']
      .every(k => this.form.get(k)?.valid);
  }

  siguiente(): void {
    if (!this.paso1Valido()) {
      this.form.markAllAsTouched();
      this.toastService.warning('Complete los datos del paciente');
      return;
    }
    this.pasoActual = 2;
  }

  anterior(): void {
    this.pasoActual = 1;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      scrollToFirstInvalid();
      this.toastService.warning('Complete los campos obligatorios marcados en rojo');
      return;
    }
    const v = this.form.value;
    let dueno: Dueno;

    if (this.modoDueno() === 'existente') {
      const existente = this.duenoService.getDuenoById(v.dueno_id);
      if (!existente) {
        this.toastService.warning('Seleccione un propietario válido');
        return;
      }
      dueno = existente;
    } else {
      const dup = this.duenoService.existeDuplicado({
        numeroDocumento: v.dueno_numeroDocumento,
        telefono: v.dueno_telefono
      });
      if (dup) {
        this.toastService.warning(dup + '. Use "Propietario existente".');
        return;
      }
      const creado = this.duenoService.addDueno({
        nombre: v.dueno_nombre,
        apellido: v.dueno_apellido,
        numeroDocumento: v.dueno_numeroDocumento,
        telefono: v.dueno_telefono,
        email: v.dueno_email || undefined,
        direccion: v.dueno_direccion,
        distrito: v.dueno_distrito,
        aceptaDatos: true
      });
      if (!creado.ok) {
        this.toastService.warning(creado.error);
        return;
      }
      dueno = creado.dueno;
    }

    const mascota = this.mascotaService.addMascota({
      nombre: v.nombre,
      especie: v.especie,
      otraEspecie: v.especie === 'otro' ? v.otraEspecie : undefined,
      raza: v.raza,
      fechaNacimiento: v.fechaNacimiento,
      sexo: v.sexo,
      peso: +v.peso,
      color: v.color,
      microchip: v.microchip || undefined,
      alergias: v.alergias || undefined,
      castrado: !!v.castrado,
      estado: v.estado,
      observaciones: v.observaciones || undefined,
      dueno
    });

    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'CREAR', `Mascota ${v.nombre} registrada`);

    this.toastService.success('Mascota registrada correctamente');
    this.router.navigate(['/mascotas', mascota.id]);
  }

  private setDuenoNuevoValidators(): void {
    ['dueno_nombre', 'dueno_apellido', 'dueno_numeroDocumento', 'dueno_telefono', 'dueno_email', 'dueno_direccion', 'dueno_distrito']
      .forEach(k => this.form.get(k)?.setValidators(k.includes('telefono') ? [Validators.required, Validators.pattern(/^[0-9]{9}$/)] :
        k === 'dueno_numeroDocumento' ? [Validators.required, documentoValidator()] :
        k === 'dueno_email' ? [Validators.email] :
        [Validators.required]));
    this.form.updateValueAndValidity();
  }

  private clearDuenoNuevoValidators(): void {
    ['dueno_nombre', 'dueno_apellido', 'dueno_numeroDocumento', 'dueno_telefono', 'dueno_email', 'dueno_direccion', 'dueno_distrito']
      .forEach(k => this.form.get(k)?.clearValidators());
    this.form.updateValueAndValidity();
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

  labelEstado(e: string): string {
    return e.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
  }
}
