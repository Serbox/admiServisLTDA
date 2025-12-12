import { Component } from '@angular/core';
import { OurServices } from "../our-services/our-services";
import { Maintenance } from "../maintenance/maintenance";
import { Us } from "../us/us";
import { Form } from "../form/form";
import { ScrollRevealDirective } from '../../app/shared/directives/scroll-reveal';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [OurServices, Maintenance, Us, Form, ScrollRevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home { }
