import { FormControl, FormGroup, Validators } from "@angular/forms";

export interface FormData {
  Nombre: string;
  Correo: string;
  Celular?: string;
  Tipo_Limpieza?: string;
  Tipo_servicio_id?: number
}

export const FORM_GROUP = new FormGroup({
  Nombre: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  Correo: new FormControl<string>('', { nonNullable: true , validators: [Validators.required, Validators.email]}),
  Celular: new FormControl<string>('', { nonNullable: true , validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10)]}),
  Tipo_Limpieza: new FormControl<string>('', { nonNullable: true }),
  Tipo_servicio_id: new FormControl<number | null>(null)

});
