import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [Ripple, NgFor],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class Footer {
  email = 'admiservis@gmail.com';
  phone = '3125312276';
  year = new Date().getFullYear();

  mailto() { window.location.href = `mailto:${this.email}`; }
  call()   { window.location.href = `tel:${this.phone}`; }

  socials = [
    { icon: 'fa-brands fa-facebook',  label: 'Facebook',  url: 'https://facebook.com' },
    { icon: 'fa-brands fa-whatsapp',  label: 'WhatsApp', url: 'https://wa.me/57' + this.phone },
    { icon: 'fa-brands fa-instagram', label: 'Instagram', url: 'https://instagram.com' }
  ];
}
