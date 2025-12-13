import { Component, OnInit, signal } from '@angular/core';
import {
  Router,
  RouterOutlet,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Event as RouterEvent
} from '@angular/router';

import { ButtonModule } from 'primeng/button';

// Tus componentes standalone
import { Header } from '../shared/header/header';
import { Footer } from '../shared/footer/footer';
import { Home } from '../component/home/home';
import { OurServices } from '../component/our-services/our-services';
import { Maintenance } from '../component/maintenance/maintenance';
import { Us } from '../component/us/us';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonModule,
    Header,
    Footer,
    Home,
    OurServices,
    Maintenance,
    Us
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {

  // para el spinner de rutas
  loadingRoutes = false;

  // ejemplo de signal para el título
  protected readonly title = signal('admiservis');

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.loadingRoutes = true;
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => (this.loadingRoutes = false), 200);
      }
    });
  }

  ngOnInit(): void {
    this.enableConstantCursorTrail();
  }

  private enableConstantCursorTrail() {
    let lastTime = 0;

    window.addEventListener('mousemove', (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTime < 20) return; // limita la frecuencia
      lastTime = now;

      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.top = `${e.clientY}px`;
      trail.style.left = `${e.clientX}px`;
      document.body.appendChild(trail);

      setTimeout(() => trail.remove(), 500);
    });
  }
}
