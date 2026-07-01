import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightHover]',
  standalone: true
})
export class HighlightHoverDirective {
  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, 'highlight-hover');
  }

  @HostListener('mouseenter')
  onEnter(): void {
    this.renderer.addClass(this.el.nativeElement, 'highlight-hover--active');
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.renderer.removeClass(this.el.nativeElement, 'highlight-hover--active');
  }
}
