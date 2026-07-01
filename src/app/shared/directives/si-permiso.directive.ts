import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnChanges } from '@angular/core';
import { AuthService, Permiso } from '../../core/services/auth.service';

@Directive({
  selector: '[appSiPermiso]',
  standalone: true
})
export class SiPermisoDirective implements OnChanges {
  @Input({ required: true }) appSiPermiso!: Permiso;
  @Input() appSiPermisoElse?: TemplateRef<unknown>;

  private readonly auth = inject(AuthService);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);

  ngOnChanges(): void {
    this.vcr.clear();
    if (this.auth.tienePermiso(this.appSiPermiso)) {
      this.vcr.createEmbeddedView(this.template);
    } else if (this.appSiPermisoElse) {
      this.vcr.createEmbeddedView(this.appSiPermisoElse);
    }
  }
}
