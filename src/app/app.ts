import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Header } from '../shared/header/header';
import { Footer } from "../shared/footer/footer";
import { Home } from "../component/home/home";
import { OurServices } from "../component/our-services/our-services";
import { Maintenance } from "../component/maintenance/maintenance";
import { Us } from "../component/us/us";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, Header, Footer, Home, OurServices, Maintenance, Us],
  templateUrl: './app.html',
  styleUrl: './app.scss',

})
export class App  implements OnInit{
  protected readonly title = signal('admiservis');


ngOnInit(): void {
  this.enableConstantCursorTrail();
}

private enableConstantCursorTrail() {
  window.addEventListener("mousemove", (e: MouseEvent) => {
    const trail = document.createElement("div");
    trail.className = "cursor-trail";
    trail.style.top = `${e.clientY}px`;
    trail.style.left = `${e.clientX}px`;
    document.body.appendChild(trail);

    // eliminar después de animar
    setTimeout(() => trail.remove(), 500);
  });
}

 

}
