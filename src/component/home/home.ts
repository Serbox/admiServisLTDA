import { Component } from '@angular/core';
import { OurServices } from "../our-services/our-services";
import { Maintenance } from "../maintenance/maintenance";
import { Us } from "../us/us";
import { Form } from "../form/form";

@Component({
  selector: 'app-home',
  imports: [OurServices, Maintenance, Us, Form],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
