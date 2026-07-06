import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../../core/services/mascota.service';
import { DuenoService } from '../../../core/services/dueno.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';
import { ESPECIES, SEXOS } from '../../../core/constants/app.constants';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { getFormErrorMessage, isFieldInvalid, isFieldValid } from '../../../shared/utils/form-errors.util';

@Component({
  selector: 'app-editar-mascota',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editar-mascota.component.html',
  styleUrls: ['./editar-mascota.component.scss']
})
export class EditarMascotaComponent implements OnInit {
  form: FormGroup;
  mascotaId = '';
  noEncontrada = false;

  readonly especies = ESPECIES;
  readonly sexos = SEXOS;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mascotaService: MascotaService,
    private duenoService: DuenoService,
    private auth: AuthService,
    private audit: AuditService,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      especie: ['', Validators.required],
      otraEspecie: ['', Validators.maxLength(50)],
      raza: ['', [Validators.required, Validators.maxLength(80)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      peso: ['', [Validators.required, Validators.min(0.1)]],
      color: ['', [Validators.required, Validators.maxLength(100)]],
      dueno_nombre: ['', [Validators.required, Validators.minLength(2)]],
      dueno_apellido: ['', [Validators.required, Validators.minLength(2)]],
      dueno_telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      dueno_email: ['', [Validators.required, Validators.email]],
      dueno_direccion: ['', [Validators.required, Validators.maxLength(200)]]
    });
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

  ngOnInit(): void {
    this.mascotaId = this.route.snapshot.paramMap.get('id') ?? '';
    const m = this.mascotaService.getMascotaById(this.mascotaId);
    if (!m) {
      this.noEncontrada = true;
      return;
    }
    const dueno = this.duenoService.getDuenoById(m.duenoId);
    this.form.patchValue({
      nombre: m.nombre,
      especie: m.especie,
      otraEspecie: m.otraEspecie,
      raza: m.raza,
      fechaNacimiento: m.fechaNacimiento,
      sexo: m.sexo,
      peso: m.peso,
      color: m.color,
      dueno_nombre: dueno?.nombre,
      dueno_apellido: dueno?.apellido,
      dueno_telefono: dueno?.telefono,
      dueno_email: dueno?.email,
      dueno_direccion: dueno?.direccion
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const actual = this.mascotaService.getMascotaById(this.mascotaId);
    if (!actual) return;

    this.mascotaService.updateMascota(this.mascotaId, {
      nombre: v.nombre,
      especie: v.especie,
      otraEspecie: v.especie === 'otro' ? v.otraEspecie : undefined,
      raza: v.raza,
      fechaNacimiento: v.fechaNacimiento,
      sexo: v.sexo,
      peso: +v.peso,
      color: v.color
    });

    this.duenoService.updateDueno(actual.duenoId, {
      nombre: v.dueno_nombre,
      apellido: v.dueno_apellido,
      telefono: v.dueno_telefono,
      email: v.dueno_email,
      direccion: v.dueno_direccion
    });

    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'EDITAR', `Mascota ${v.nombre} actualizada`);

    this.toast.success('Mascota actualizada correctamente');
    this.router.navigate(['/mascotas', this.mascotaId]);
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
