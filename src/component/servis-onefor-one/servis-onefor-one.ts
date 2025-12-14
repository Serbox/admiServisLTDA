import { Component, inject, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../app/core/supabase';
import { FORM_GROUP } from '../form/const/foms';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

type Desc = {
  id?: number;
  Descripcion?: string;
  Id_tipo_servicio?: number;
  urlImagen?: string;
};

@Component({
  selector: 'app-servis-onefor-one',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule],
  templateUrl: './servis-onefor-one.html',
  styleUrls: ['./servis-onefor-one.scss'],
})
export class ServisOneforOne implements OnInit {
  // servicios / inyecciones
  protected supabase = inject(Supabase);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  // formulario
  protected frm: FormGroup = FORM_GROUP;

  // datos
  items: Desc[] = [];
  serviceItem: any | null = null;

  // estado UI
  loading = false;
  error = '';
  tipoId: number | null = null;

  async ngOnInit(): Promise<void> {
    // 🔝 siempre subir al inicio cuando se entra a este componente
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // leer query param ?id=...
    const queryParams = new URLSearchParams(window.location.search);
    const idParam = queryParams.get('id');
    this.tipoId = idParam ? Number(idParam) : null;

    if (!this.tipoId) {
      this.error = 'No se especificó id de tipo de servicio';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      // ==========================
      // 1. Cargar info del servicio
      // ==========================
      const {
        data: servicio,
        error: errorServicio,
      } = await this.supabase
        .from('Tipo_Servicios')
        .select('*')
        .eq('id', this.tipoId)
        .single();

      if (errorServicio) {
        console.error('Supabase error servicio', errorServicio);
        this.error = errorServicio?.message ?? 'Error cargando servicio';
        this.serviceItem = null;
      } else {
        // aseguramos cambio de zona para que Angular actualice bien
        this.ngZone.run(() => {
          this.serviceItem = servicio;
        });
      }

      // ==========================
      // 2. Cargar descripciones
      // ==========================
      const {
        data: descripciones,
        error: errorDesc,
      } = await this.supabase
        .from('Descripciones')
        .select('*')
        .eq('Id_tipo_servicio', this.tipoId)
        .order('id', { ascending: true });

      if (errorDesc) {
        console.error('Supabase error descripciones', errorDesc);
        this.error = errorDesc?.message ?? 'Error cargando descripciones';
        this.items = [];
      } else {
        this.ngZone.run(() => {
          this.items = (descripciones ?? []) as Desc[];
        });
      }
    } catch (e: any) {
      console.error('Unexpected error', e);
      this.error = e?.message ?? String(e);
      this.items = [];
    } finally {
      this.loading = false;
      try {
        this.cdr.detectChanges();
      } catch {
        // noop
      }
    }
  }

  // trackBy para *ngFor
  trackByIndex(index: number, item: Desc) {
    return item?.id ?? index;
  }

  // envío del formulario a Supabase
  protected async enviar() {
    this.frm.get('Tipo_servicio_id')?.setValue(this.tipoId ?? null);

    if (this.frm.invalid) {
      this.frm.markAllAsTouched();
      return;
    }

    const payload = this.frm.getRawValue();

    try {
      await this.supabase.insert('Formulario_Registro', payload);
      console.log('Insert OK');

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Ya recibimos tu solicitud',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      this.frm.reset();
    } catch (err) {
      console.error('Error guardando en Supabase:', err);

      Swal.fire({
        icon: 'error',
        title: 'Ups...',
        text: 'Ocurrió un error al enviar tu solicitud, inténtalo de nuevo.',
      });
    }
  }
}
