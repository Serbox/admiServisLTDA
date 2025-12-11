import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';      // <- para *ngIf
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

type ServiceItem = {
  icon: string;
  title: string;
  alt: string;
  desc: string;
};

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: './maintenance.html',
  styleUrls: ['./maintenance.scss']
})
export class Maintenance {
  services: ServiceItem[] = [
    {
      icon: '/grifo.png',
      title: 'Plomería',
      alt: 'Ícono de plomería',
      desc: 'Reparaciones de fugas, instalación de tuberías, mantenimiento de sistemas de agua y limpieza de drenajes.'
    },
    {
      icon: '/enchufe.png',
      title: 'Electricidad',
      alt: 'Ícono de electricidad',
      desc: 'Solución de fallas eléctricas, mantenimiento de sistemas, instalación de luces y tomacorrientes.'
    },
    {
      icon: '/pintura.png',
      title: 'Pintura y Remodelación',
      alt: 'Ícono de pintura',
      desc: 'Pintura interior y exterior, remodelación de espacios y personalización de acabados.'
    },
    {
      icon: '/mantenimiento.png',
      title: 'Mantenimiento Preventivo',
      alt: 'Ícono de mantenimiento',
      desc: 'Planes regulares para mantener en óptimo estado los sistemas de tu hogar o negocio.'
    }
  ];

  workerImage = '/tobero.png';
}
