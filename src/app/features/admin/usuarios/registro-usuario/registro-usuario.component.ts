import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AuditService } from '../../../../core/services/audit.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FormRequiredLegendComponent } from '../../../../shared/components/form-required-legend/form-required-legend.component';
import { getFormErrorMessage, isFieldInvalid } from '../../../../shared/utils/form-errors.util';
import { scrollToFirstInvalid } from '../../../../shared/utils/form-validators.util';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, FormRequiredLegendComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.scss']
})
export class RegistroUsuarioComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private auth: AuthService,
    private audit: AuditService,
    private toast: ToastService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['asistente', Validators.required]
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      scrollToFirstInvalid();
      this.toast.warning('Complete los campos obligatorios marcados en rojo');
      return;
    }
    const v = this.form.value;
    const resultado = this.usuarioService.addUsuario({
      username: v.username,
      nombre: v.nombre,
      password: v.password,
      rol: v.rol,
      activo: true
    });

    if (!resultado.ok) {
      this.toast.warning(resultado.error);
      return;
    }

    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'CREAR', `Usuario ${v.username} registrado`);

    this.toast.success('Usuario registrado correctamente');
    this.router.navigate(['/usuarios']);
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
