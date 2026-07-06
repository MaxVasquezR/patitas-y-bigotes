import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, FormRequiredLegendComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss']
})
export class EditarUsuarioComponent implements OnInit {
  form: FormGroup;
  usuarioId = '';
  noEncontrado = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private auth: AuthService,
    private audit: AuditService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      password: ['', Validators.minLength(6)],
      rol: ['asistente', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.paramMap.get('id') ?? '';
    const u = this.usuarioService.getUsuarioById(this.usuarioId);
    if (!u) {
      this.noEncontrado = true;
      return;
    }
    this.form.patchValue({
      username: u.username,
      nombre: u.nombre,
      rol: u.rol,
      activo: u.activo
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      scrollToFirstInvalid();
      this.toast.warning('Complete los campos obligatorios');
      return;
    }
    const v = this.form.value;
    const resultado = this.usuarioService.updateUsuario(this.usuarioId, {
      username: v.username,
      nombre: v.nombre,
      rol: v.rol,
      activo: !!v.activo,
      ...(v.password ? { password: v.password } : {})
    });

    if (!resultado.ok) {
      this.toast.warning(resultado.error);
      return;
    }

    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'EDITAR', `Usuario ${v.username} actualizado`);

    this.toast.success('Usuario actualizado correctamente');
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
