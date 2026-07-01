import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DuenoService } from '../../../core/services/dueno.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';
import { TIPOS_DOCUMENTO } from '../../../core/constants/app.constants';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormRequiredLegendComponent } from '../../../shared/components/form-required-legend/form-required-legend.component';
import { getFormErrorMessage, isFieldInvalid } from '../../../shared/utils/form-errors.util';
import { documentoValidator, scrollToFirstInvalid } from '../../../shared/utils/form-validators.util';
import { normalizarDueno } from '../../../core/utils/entity-normalizers';

@Component({
  selector: 'app-editar-propietario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent, FormRequiredLegendComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editar-propietario.component.html',
  styleUrls: ['./editar-propietario.component.scss']
})
export class EditarPropietarioComponent implements OnInit {
  form: FormGroup;
  propietarioId = '';
  noEncontrado = false;
  readonly tiposDocumento = TIPOS_DOCUMENTO;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private duenoService: DuenoService,
    private mascotaService: MascotaService,
    private auth: AuthService,
    private audit: AuditService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      tipoDocumento: ['DNI', Validators.required],
      numeroDocumento: ['', [Validators.required, documentoValidator()]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      telefonoAlt: ['', Validators.pattern(/^[0-9]{9}$/)],
      email: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      distrito: ['', [Validators.required, Validators.maxLength(80)]],
      contactoEmergencia: ['', Validators.maxLength(120)]
    });
  }

  ngOnInit(): void {
    this.propietarioId = this.route.snapshot.paramMap.get('id') ?? '';
    const p = this.duenoService.getDuenoById(this.propietarioId);
    if (!p) {
      this.noEncontrado = true;
      return;
    }
    this.form.patchValue(p);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      scrollToFirstInvalid();
      this.toast.warning('Complete los campos obligatorios');
      return;
    }
    const v = this.form.value;
    const actual = this.duenoService.getDuenoById(this.propietarioId);
    const resultado = this.duenoService.updateDueno(this.propietarioId, {
      ...v,
      aceptaDatos: actual?.aceptaDatos ?? true
    });

    if (!resultado.ok) {
      this.toast.warning(resultado.error);
      return;
    }

    const dueno = normalizarDueno({ ...actual!, ...v });
    this.mascotaService.syncDuenoEnMascotas(dueno);

    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'EDITAR', `Propietario ${v.nombre} ${v.apellido} actualizado`);

    this.toast.success('Propietario actualizado en todas las fichas vinculadas');
    this.router.navigate(['/propietarios', this.propietarioId]);
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
