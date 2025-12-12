import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '../../app/shared/directives/count-up';

@Component({
  selector: 'app-us',
  standalone: true,
  imports: [CommonModule, CountUpDirective],
  templateUrl: './us.html',
  styleUrl: './us.scss'
})
export class Us {

  logos = [
    { alt: 'Simon',      src: '/logosanrasof1.png' },
    { alt: 'HomeSide',   src: '/logomarcos.png' },
    { alt: 'Pangea',     src: '/logosofia2.png' },
    { alt: 'Zeyve',      src: '/arboleda.jpg' },
    { alt: 'HomeCrest',  src: '/bellorizonte.jpeg' }
  ];

}
