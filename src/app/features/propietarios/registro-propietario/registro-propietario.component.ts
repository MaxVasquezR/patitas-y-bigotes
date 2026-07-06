import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DuenoService } from '../../../core/services/dueno.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormRequiredLegendComponent } from '../../../shared/components/form-required-legend/form-required-legend.component';
import { getFormErrorMessage, isFieldInvalid, isFieldValid } from '../../../shared/utils/form-errors.util';
import { documentoValidator, scrollToFirstInvalid } from '../../../shared/utils/form-validators.util';
import { Dueno } from '../../../core/models/mascota.model';

@Component({
  selector: 'app-registro-propietario',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    PageHeaderComponent, FormRequiredLegendComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registro-propietario.component.html',
  styleUrls: ['./registro-propietario.component.scss']
})
export class RegistroPropietarioComponent {
  form: FormGroup;
  propietarioCreado = signal<Dueno | null>(null);

  constructor(
    private fb: FormBuilder,
    private duenoService: DuenoService,
    private auth: AuthService,
    private audit: AuditService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      numeroDocumento: ['', [Validators.required, documentoValidator()]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      email: ['', Validators.email],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      distrito: ['', [Validators.required, Validators.maxLength(80)]],
      aceptaDatos: [false]
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      scrollToFirstInvalid();
      this.toastService.warning('Complete los campos obligatorios marcados en rojo');
      return;
    }
    const v = this.form.value;
    const resultado = this.duenoService.addDueno({
      nombre: v.nombre,
      apellido: v.apellido,
      numeroDocumento: v.numeroDocumento,
      telefono: v.telefono,
      email: v.email || undefined,
      direccion: v.direccion,
      distrito: v.distrito,
      aceptaDatos: !!v.aceptaDatos
    });

    if (!resultado.ok) {
      this.toastService.warning(resultado.error);
      return;
    }

    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'CREAR', `Propietario ${v.nombre} ${v.apellido}`);

    this.propietarioCreado.set(resultado.dueno);
    this.toastService.success('Propietario registrado correctamente');
  }

  irLista(): void {
    this.router.navigate(['/propietarios']);
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