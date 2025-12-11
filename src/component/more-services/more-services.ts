import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceHoverCard } from './service-hover-card/service-hover-card';
import { Supabase } from '../../app/core/supabase';
import { Servicio } from '../our-services/constants';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-more-services',
  standalone: true,
  imports: [CommonModule, ServiceHoverCard],
  templateUrl: './more-services.html',
  styleUrls: ['./more-services.scss']
})
export class MoreServices implements OnInit {
  protected supabase = inject(Supabase);
  private cdr = inject(ChangeDetectorRef);

  protected services: Servicio[] = [];
  protected loading = false;
  protected errorMsg: string | null = null;

  ngOnInit(): void {
    this.loadServices();
  }

  async loadServices() {
    this.loading = true;
    this.errorMsg = null;
    try {
      const result = await this.supabase.from('Tipo_Servicios').select('*') as any;
      // flexible handling
      const data = result?.data ?? result ?? null;
      const error = result?.error ?? null;

      if (error) {
        console.error('Supabase error:', error);
        this.errorMsg = error?.message ?? 'No se pudieron cargar los servicios.';
        this.services = [];
        return;
      }

      this.services = (data ?? []) as Servicio[];
      console.log('[MoreServices] servicios asignados:', this.services);
    } catch (err: any) {
      console.error('Error al cargar servicios:', err);
      this.errorMsg = err?.message ?? 'Error inesperado al conectar';
      this.services = [];
    } finally {
      this.loading = false;
      // Forzamos actualización del template por si Angular no detectó cambios
      try {
        this.cdr.detectChanges();
      } catch (e) {
        // ignore
      }
      console.log('[MoreServices] loadServices finished - loading=false');
    }
  }

  trackById(index: number, item: Servicio) {
    return item?.id ?? index;
  }
}
