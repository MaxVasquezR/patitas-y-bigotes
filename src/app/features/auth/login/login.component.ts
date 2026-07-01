import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CLINICA_NOMBRE, CLINICA_TAGLINE, CLINICA_DIRECCION, CLINICA_TELEFONO } from '../../../core/constants/app.constants';
import { getFormErrorMessage, isFieldInvalid } from '../../../shared/utils/form-errors.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  readonly clinicaNombre = CLINICA_NOMBRE;
  readonly clinicaTagline = CLINICA_TAGLINE;
  readonly direccion = CLINICA_DIRECCION;
  readonly telefono = CLINICA_TELEFONO;

  form: FormGroup;
  errorLogin = signal('');

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ingresar(): void {
    this.errorLogin.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { username, password } = this.form.value;
    if (this.auth.login(username, password)) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errorLogin.set('Usuario o contraseña incorrectos');
    }
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
