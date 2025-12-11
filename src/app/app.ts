import { Component, signal } from '@angular/core';
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
export class App {
  protected readonly title = signal('admiservis');
}
