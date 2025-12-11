import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, Button],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  email = 'admiservis@gmail.com';
  phone = '3125312276';
  logoSrc = '../assets/img/logo-solo.png';

  mailto() { window.location.href = `mailto:${this.email}`; }
  call()   { window.location.href = `tel:${this.phone}`;   }
}
