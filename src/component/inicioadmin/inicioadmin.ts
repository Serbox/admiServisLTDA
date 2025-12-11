import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../app/core/auth.service';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { Supabase } from '../../app/core/supabase';

@Component({
  selector: 'app-inicioadmin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
  ],
  templateUrl: './inicioadmin.html',
  styleUrls: ['./inicioadmin.scss']
})
export class Inicioadmin {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  public supabase = inject(Supabase);
  private cdr = inject(ChangeDetectorRef);   // 👈 NUEVO

  public logoVisualizacion?: string = '';

  // Lista de servicios para la tabla
  public servicios: any[] = [];

  // id del servicio que se está editando (null = modo crear)
  public servicioEditandoId: number | null = null;

  // Form principal
  form = this.fb.group({
    nombre_Servicio: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    Logo: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    mini_descripcion: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)] }),
    descriptions: this.fb.array([]),
  });

  // Getters
  get f() {
    return this.form.controls;
  }

  get descriptions(): FormArray {
    return this.form.get('descriptions') as FormArray;
  }

  get descriptionControls(): FormGroup[] {
    return this.descriptions.controls as FormGroup[];
  }

  addDescription() {
    const group = this.fb.group({
      Descripcion: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(500)] }),
      id_tipo_servicio: this.fb.control<number>(0, { nonNullable: true }),
      urlImagen: this.fb.control('', { nonNullable: true }),
    });
    this.descriptions.push(group);
  }

  removeDescription(i: number) {
    this.descriptions.removeAt(i);
  }

  //Longitud para mini descripcion
  get miniDescLength() {
    return (this.form.get('mini_descripcion')?.value ?? '').length;
  }

  //Longitud para descripciones
  descLength(i: number) {
    const val = this.descriptions.at(i).get('Descripcion')?.value ?? '';
    return val.length;
  }

  async VisulizarLogo() {
    this.logoVisualizacion = this.form.get('Logo')?.value;
  }

  async logout() {
    try {
      await this.auth.signOut();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Sesión cerrada',
        showConfirmButton: false,
        timer: 1200
      });
      await this.router.navigateByUrl('/auth/login');
    } catch (err) {
      console.error('Logout error', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cerrar la sesión. Intenta de nuevo.'
      });
    }
  }

  // ========================================================
  //  MANEJO DE IMÁGENES EN DESCRIPCIONES
  // ========================================================
  pendingFiles = new Map<number, File>();
  previews = new Map<number, string>();

  onFileSelected(e: Event, index: number) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      Swal.fire(
        'Archivo muy grande',
        `El archivo debe ser menor a ${maxSizeMB} MB`,
        'warning'
      );
      input.value = '';
      return;
    }

    this.pendingFiles.set(index, file);
    const url = URL.createObjectURL(file);

    const prev = this.previews.get(index);
    if (prev) URL.revokeObjectURL(prev);

    this.previews.set(index, url);
    input.value = '';
  }

  // ========================================================
  //   GUARDAR / ACTUALIZAR SERVICIO
  // ========================================================
  async AgregarServicio() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    // 1️⃣ SUBIR LAS IMÁGENES (solo si existen)
    for (let i = 0; i < this.descriptions.length; i++) {
      const file = this.pendingFiles.get(i);
      if (file) {
        const safeName = file.name.replace(/\s+/g, '_');
        const filePath = `servicios/${Date.now()}_${safeName}`;
        try {
          const { publicUrl } = await this.supabase.uploadFile('public-assets', filePath, file);
          this.descriptions.at(i).get('urlImagen')?.setValue(publicUrl);
        } catch (error) {
          const msg = error instanceof Error ? error.message : JSON.stringify(error);
          Swal.fire('Error al subir la imagen', msg, 'error');
          return;
        }
      }
    }

    const raw = this.form.getRawValue();
    const payloadPadre = {
      nombre_Servicio: raw.nombre_Servicio,
      Logo: raw.Logo,
      mini_descripcion: raw.mini_descripcion
    };

    // 🔹 Si HAY id en edición → UPDATE
    if (this.servicioEditandoId) {
      try {
        const { error: errorUpdate } = await this.supabase
          .from('Tipo_Servicios')
          .update(payloadPadre)
          .eq('id', this.servicioEditandoId);

        if (errorUpdate) {
          console.error(errorUpdate);
          Swal.fire('Error', 'No se pudo actualizar el servicio', 'error');
          return;
        }

        const { error: errorDeleteDesc } = await this.supabase
          .from('Descripciones')
          .delete()
          .eq('Id_tipo_servicio', this.servicioEditandoId);

        if (errorDeleteDesc) {
          console.error(errorDeleteDesc);
          Swal.fire('Error', 'No se pudieron limpiar las descripciones anteriores', 'error');
          return;
        }

        const hijosAInsertar = raw.descriptions.map((d: any) => ({
          Descripcion: d.Descripcion ?? d.descripcion ?? '',
          urlImagen: d.urlImagen ?? '',
          Id_tipo_servicio: this.servicioEditandoId
        }));

        if (hijosAInsertar.length > 0) {
          await this.supabase.insert('Descripciones', hijosAInsertar);
        }

        Swal.fire({
          icon: 'success',
          title: 'Servicio actualizado correctamente',
          timer: 1300,
          showConfirmButton: false
        });

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : JSON.stringify(err);
        console.error('Error actualizando servicio', err);
        Swal.fire('Error', msg, 'error');
        return;
      }

    } else {
      // 🔹 Si NO hay id → INSERT
      let padreId: number;
      try {
        const insertedPadre = await this.supabase.insertAndReturn<{ id: number }>('Tipo_Servicios', payloadPadre);
        padreId = insertedPadre.id;
      } catch (error) {
        const msg = error instanceof Error ? error.message : JSON.stringify(error);
        Swal.fire('Error guardando servicio', msg, 'error');
        return;
      }

      const hijosAInsertar = raw.descriptions.map((d: any) => ({
        Descripcion: d.Descripcion ?? d.descripcion ?? '',
        urlImagen: d.urlImagen ?? '',
        Id_tipo_servicio: padreId
      }));

      try {
        if (hijosAInsertar.length > 0) {
          await this.supabase.insert('Descripciones', hijosAInsertar);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : JSON.stringify(err);
        console.error('Error insertando Descripciones', err);
        Swal.fire('Error guardando descripciones', msg, 'error');
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Servicio Guardado Correctamente',
        timer: 1300,
        showConfirmButton: false
      });
    }

    this.pendingFiles.clear();
    this.previews.clear();
    this.form.reset();
    while (this.descriptions.length) this.descriptions.removeAt(0);
    this.servicioEditandoId = null;

    await this.cargarServicios();
  }

  // ========================================================
  //   TABLA: CARGAR SERVICIOS (FIX AQUÍ)
  // ========================================================
  async cargarServicios() {
    const result = await this.supabase
      .from('Tipo_Servicios')
      .select('*') as any;

    console.log('RESULT SUPABASE', result);

    if (result.error) {
      console.error(result.error);
      Swal.fire('Error', 'No se pudieron cargar los servicios', 'error');
      return;
    }

    this.servicios = result.data ?? [];
    console.log('SERVICIOS EN COMPONENTE', this.servicios);

    // 👈 FORZAR QUE ANGULAR REDIBUJE
    this.cdr.detectChanges();
  }

  // ========================================================
  //   TABLA: EDITAR / ELIMINAR
  // ========================================================
  async editarServicio(servicio: any) {
    this.servicioEditandoId = servicio.id;

    this.form.patchValue({
      nombre_Servicio: servicio.nombre_Servicio,
      Logo: servicio.Logo,
      mini_descripcion: servicio.mini_descripcion
    });

    while (this.descriptions.length) this.descriptions.removeAt(0);
    this.pendingFiles.clear();
    this.previews.clear();

    const { data, error } = await this.supabase
      .from('Descripciones')
      .select('*')
      .eq('Id_tipo_servicio', servicio.id) as any;

    if (!error && data) {
      data.forEach((d: any) => {
        const group = this.fb.group({
          Descripcion: this.fb.control(d.Descripcion ?? '', {
            nonNullable: true,
            validators: [Validators.required, Validators.maxLength(500)]
          }),
          id_tipo_servicio: this.fb.control<number>(d.Id_tipo_servicio, { nonNullable: true }),
          urlImagen: this.fb.control(d.urlImagen ?? '', { nonNullable: true }),
        });
        this.descriptions.push(group);
      });
    }
  }

  async eliminarServicio(servicio: any) {
    const confirm = await Swal.fire({
      title: '¿Eliminar servicio?',
      text: `Se eliminará "${servicio.nombre_Servicio}" y sus descripciones`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
      const { error: errDesc } = await this.supabase
        .from('Descripciones')
        .delete()
        .eq('Id_tipo_servicio', servicio.id);

      if (errDesc) {
        console.error(errDesc);
        Swal.fire('Error', 'No se pudieron eliminar las descripciones', 'error');
        return;
      }

      const { error: errServ } = await this.supabase
        .from('Tipo_Servicios')
        .delete()
        .eq('id', servicio.id);

      if (errServ) {
        console.error(errServ);
        Swal.fire('Error', 'No se pudo eliminar el servicio', 'error');
        return;
      }

      Swal.fire('Eliminado', 'Servicio eliminado correctamente', 'success');
      await this.cargarServicios();

    } catch (e) {
      console.error(e);
      Swal.fire('Error', 'Error inesperado eliminando el servicio', 'error');
    }
  }

  // ========================================================
  //   NGONINIT → CARGAR TABLA
  // ========================================================
  async ngOnInit() {
    await this.cargarServicios();
  }
}
