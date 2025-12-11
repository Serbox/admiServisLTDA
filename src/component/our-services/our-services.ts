import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CardService } from '../card-service/card-service';
import { Supabase } from '../../app/core/supabase';
import { Servicio } from './constants';
import { ChangeDetectorRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-our-services',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardService],
  templateUrl: './our-services.html',
  styleUrls: ['./our-services.scss'],
})
export class OurServices implements OnInit {
  private supabase = inject(Supabase);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  services: Servicio[] = [];
  loading = false;
  error = '';

  otherCard: Partial<Servicio> = {
    id: -1,
    nombre_Servicio: 'Otros servicios',
    Logo: 'fa-solid fa-bars',
    mini_descripcion: 'Explora la lista completa de servicios'
  };

  ngOnInit(): void {
    this.loadFeatured();
  }

  async loadFeatured() {
    this.loading = true;
    this.error = '';
    try {
      const result = await this.supabase.from('Tipo_Servicios').select('*').range(0, 1) as any;
      const data = Array.isArray(result) ? result : (result?.data ?? []);
      const err = result?.error ?? null;

      if (err) {
        console.error('Error al cargar servicios:', err);
        this.error = err?.message ?? 'No se pudieron cargar los servicios';
        this.services = [];
      } else {
      
        this.ngZone.run(() => {
          this.services = (data ?? []) as Servicio[];
        });
      }
    } catch (e: any) {
      console.error(e);
      this.error = e?.message ?? 'Error inesperado';
      this.services = [];
    } finally {
      this.loading = false;

      try { this.cdr.detectChanges(); } catch (e) { /* noop */ }
      console.log('[OurServices] loadFeatured finished, loading=false, services:', this.services?.length);
    }
  }

  goToServices() {
    this.router.navigate(['/more']);
  }

  trackById(index: number, item: Servicio) {
    return item?.id ?? index;
  }
}
