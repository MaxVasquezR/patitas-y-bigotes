import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';
import { EstadoCita } from '../../core/models/cita.model';

@Directive({
  selector: '[appEstadoBadge]',
  standalone: true
})
export class EstadoBadgeDirective implements OnChanges {
  @Input('appEstadoBadge') estado: EstadoCita | '' = '';

  private readonly clases = ['estado-pendiente', 'estado-confirmada', 'estado-completada', 'estado-cancelada'];

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.clases.forEach(c => this.renderer.removeClass(this.el.nativeElement, c));
    if (this.estado) {
      this.renderer.addClass(this.el.nativeElement, `estado-${this.estado}`);
    }
  }
}
