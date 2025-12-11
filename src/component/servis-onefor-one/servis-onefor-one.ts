import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../app/core/supabase';
import { ChangeDetectorRef, NgZone } from '@angular/core';
import { FORM_GROUP } from '../form/const/foms';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
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
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule, CardModule,CommonModule],
  templateUrl: './servis-onefor-one.html',
  styleUrls: ['./servis-onefor-one.scss']
})
export class ServisOneforOne implements OnInit {
  protected supabase = inject(Supabase);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  protected frm: FormGroup = FORM_GROUP;

  items: Desc[] = [];
  itemsservice: any[] = [];
  serviceItem: any | null = null;
  loading = false;
  error = '';
  tipoId: number | null = null;

  async ngOnInit() {
    const queryParams = new URLSearchParams(window.location.search);
    const idParam = queryParams.get('id');
    this.tipoId = idParam ? Number(idParam) : null;

    if (!this.tipoId) {
      this.error = 'No se especificó id de tipo de servicio';
      return;
    }


    this.loading = true;
    try {
    const ress = await this.supabase
      .from('Tipo_Servicios')
      .select('*')
      .eq('id', this.tipoId)
      .single() as any; 

    const datas = ress?.data ?? null;
    const error = ress?.error ?? null;

    if (error) {
      console.error('Supabase error', error);
      this.error = error?.message ?? 'Error cargando servicio';
      this.serviceItem = null;
    } else {
      // asigna el objeto
      this.ngZone.run(() => {
        this.serviceItem = datas;
      });
    }
  
      




      const res = await this.supabase
        .from('Descripciones')
        .select('*')
        .eq('Id_tipo_servicio', this.tipoId)
        .order('id', { ascending: true }) as any;

      const data = Array.isArray(res) ? res : (res?.data ?? []);
      const err = res?.error ?? null;

      if (err) {
        console.error('Supabase error', err);
        this.error = err?.message ?? 'Error cargando descripciones';
        this.items = [];
      } else {
        this.ngZone.run(() => {
          this.items = (data ?? []) as Desc[];
        });
      }
    } catch (e: any) {
      console.error('Unexpected', e);
      this.error = e?.message ?? String(e);
      this.items = [];
    } finally {
      this.loading = false;
      try { this.cdr.detectChanges(); } catch (e) { /* noop */ }
    }
  }

  // <-- trackBy para usar en *ngFor (evita re-render innecesario)
  trackByIndex(index: number, item: Desc) {
    return item?.id ?? index;
  }



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
  
  //Swal.fire('Listo', 'Ya recibimos tu solicitud', 'success');
  Swal.fire({
    toast: true,               
    position: "top-end",
    icon: "success",
    title: "Ya resibimos tu solicitud",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  });
  
    this.frm.reset();
  } catch (err) {
    console.error('Error guardando en Supabase:', err);
  
    Swal.fire({
      icon: "error",
      title: "Ups...",
      text: "Ocurrió un error al enviar tu solicitud, inténtalo de nuevo."
    });
  }
  
  }
}
