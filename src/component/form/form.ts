import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FORM_GROUP } from './const/foms';
import { Supabase } from '../../app/core/supabase';
import { CommonModule } from '@angular/common';


import Swal from 'sweetalert2'


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, CardModule,CommonModule],
  templateUrl: './form.html',
  styleUrl: './form.scss'
})
export class Form {
  

  personSrc = '/mujer-sin.png';
  heroTitle = 'Gama Completa de';
  heroHighlight = 'Servicios';
  heroTail = 'Generales';
  protected anos_experiencia?: number =2013;
  protected anos_experiencia_actual?: number;
  protected frm: FormGroup = FORM_GROUP;

  protected supabase = inject(Supabase);



  async ngOnInit() {    
 
    this.anos_experiencia_actual = new Date().getFullYear() - this.anos_experiencia! ;
  }

protected async enviar() {
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
