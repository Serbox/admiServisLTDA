import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements AfterViewInit, OnDestroy {
  /**
   * Tipo de animación:
   *  - 'up' | 'left' | 'right' | 'fade' | 'zoom'
   */
  @Input('appScrollReveal') animation: 'up' | 'left' | 'right' | 'fade' | 'zoom' = 'up';

  /** Solo animar la primera vez que aparece (default: true) */
  @Input() revealOnce = true;

  /** Delay base en ms (para el contenedor) */
  @Input() revealDelay = 0;

  /** Duración de la animación en ms */
  @Input() revealDuration = 600;

  /** Stagger: animar hijos en cascada */
  @Input() revealStagger = false;

  /** Paso entre cada hijo en ms (si stagger está activo) */
  @Input() revealStaggerStep = 80;

  private observer?: IntersectionObserver;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {
  
    this.renderer.addClass(this.el.nativeElement, 'reveal-base');
  }

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;

  
    const animationClass = this.getAnimationClass(this.animation);
    this.renderer.addClass(host, animationClass);

    // Duración y delay del contenedor
    this.renderer.setStyle(host, 'transition-duration', `${this.revealDuration}ms`);
    if (this.revealDelay > 0) {
      this.renderer.setStyle(host, 'transition-delay', `${this.revealDelay}ms`);
    }

    // Si hay stagger, preparamos hijos marcados con [data-reveal-item]
    if (this.revealStagger) {
      const children = host.querySelectorAll<HTMLElement>('[data-reveal-item]');
      children.forEach((child, index) => {
        this.renderer.addClass(child, 'reveal-base');
        this.renderer.addClass(child, animationClass);
        const delay = this.revealDelay + index * this.revealStaggerStep;
        this.renderer.setStyle(child, 'transition-duration', `${this.revealDuration}ms`);
        this.renderer.setStyle(child, 'transition-delay', `${delay}ms`);
      });
    }

    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.showElement();

            if (this.revealOnce && this.observer) {
              this.observer.unobserve(host);
            }
          } else if (!this.revealOnce) {
            this.hideElement();
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    this.observer.observe(host);
  }

  private showElement() {
    const host = this.el.nativeElement;
    this.renderer.addClass(host, 'is-visible');

    if (this.revealStagger) {
      const children = host.querySelectorAll<HTMLElement>('[data-reveal-item]');
      children.forEach(child => {
        this.renderer.addClass(child, 'is-visible');
      });
    }
  }

  private hideElement() {
    const host = this.el.nativeElement;
    this.renderer.removeClass(host, 'is-visible');

    if (this.revealStagger) {
      const children = host.querySelectorAll<HTMLElement>('[data-reveal-item]');
      children.forEach(child => {
        this.renderer.removeClass(child, 'is-visible');
      });
    }
  }

  private getAnimationClass(type: string): string {
    switch (type) {
      case 'left':
        return 'reveal-left';
      case 'right':
        return 'reveal-right';
      case 'fade':
        return 'reveal-fade';
      case 'zoom':
        return 'reveal-zoom';
      case 'up':
      default:
        return 'reveal-up';
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
