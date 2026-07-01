import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../core/services/audit.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent {
  readonly registros = this.audit.registros;

  constructor(private audit: AuditService) {}

  trackById(_i: number, r: { id: string }): string {
    return r.id;
  }
}
