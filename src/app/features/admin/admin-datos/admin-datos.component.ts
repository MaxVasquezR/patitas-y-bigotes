import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BackupService } from '../../../core/services/backup.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuditService } from '../../../core/services/audit.service';
import { ToastService } from '../../../core/services/toast.service';
import { ConfirmService } from '../../../core/services/confirm.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-admin-datos',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-datos.component.html'
})
export class AdminDatosComponent {
  private readonly backup = inject(BackupService);
  private readonly auth = inject(AuthService);
  private readonly audit = inject(AuditService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);
  private readonly router = inject(Router);

  exportar(): void {
    this.backup.descargarJson();
    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'BACKUP', 'Exportación de datos JSON');
    this.toast.success('Backup descargado');
  }

  async restaurarDemo(): Promise<void> {
    const ok = await this.confirm.confirm(
      '¿Restaurar todos los datos a la demostración inicial? Se perderán los cambios locales.',
      'Restaurar datos demo'
    );
    if (!ok) return;
    this.backup.restaurarDemo();
    const s = this.auth.getSesionActual();
    if (s) this.audit.registrar(s.nombre, s.rol, 'RESTAURAR', 'Datos demo restaurados');
    this.toast.success('Datos restaurados. Recargando...');
    setTimeout(() => window.location.reload(), 1200);
  }

  onImportar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (this.backup.importar(data)) {
          const s = this.auth.getSesionActual();
          if (s) this.audit.registrar(s.nombre, s.rol, 'IMPORTAR', 'Backup importado');
          this.toast.success('Datos importados. Recargando...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          this.toast.warning('Archivo de backup inválido');
        }
      } catch {
        this.toast.warning('No se pudo leer el archivo');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }
}
