import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCitaProxima]',
  standalone: true
})
export class CitaProximaDirective implements OnInit {
  @Input() appCitaProxima = '';
  @Input() estadoCita = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const hoy = new Date();
    const fecha = new Date(this.appCitaProxima + 'T00:00:00');
    const diffMs = fecha.getTime() - hoy.getTime();
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (this.estadoCita === 'cancelada') return;

    if (diffDias === 0) {
      this.renderer.addClass(this.el.nativeElement, 'cita-hoy');
    } else if (diffDias > 0 && diffDias <= 2) {
      this.renderer.addClass(this.el.nativeElement, 'cita-proxima');
    } else if (diffDias < 0) {
      this.renderer.addClass(this.el.nativeElement, 'cita-pasada');
    }
  }
}
