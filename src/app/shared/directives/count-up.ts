import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements AfterViewInit, OnDestroy {
  @Input() countTo: number = 0;          // número final
  @Input() duration: number = 1200;      // duración en ms
  @Input() prefix: string = '';          // prefijo: "+", "$", etc.
  @Input() suffix: string = '';          // sufijo opcional
  @Input() countOnce: boolean = true;    // animar solo una vez

  private observer?: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startCount();

          if (this.countOnce && this.observer) {
            this.observer.unobserve(this.el.nativeElement);
          }
        }
      });
    },
    { threshold: 0.3 });

    this.observer.observe(this.el.nativeElement);
  }

  private startCount() {
    const element = this.el.nativeElement;
    const start = 0;
    const end = this.countTo;
    const duration = this.duration;

    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.floor(start + (end - start) * progress);

      element.textContent = `${this.prefix}${current}${this.suffix}`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
