import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { createClient , SupabaseClient} from '@supabase/supabase-js';


@Injectable({
  providedIn: 'root'
})
export class Supabase {
  
private supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

//Esto trea todos los registros de una tabla
 async getAll<T = any>(table: string) {
    const { data, error } = await this.supabaseClient
      .from(table)
      .select('*');

    if (error) throw error;
    return data as T[];
  }

  //Esto inserta un registro en una tabla

// async insert<T = any>(table: string, payload: Partial<T>): Promise<void> {
//   const { error } = await this.supabaseClient
//     .from(table)
//     .insert(payload);  

//   if (error) throw error;
// }


  


  //actualizar un registro de una tabla
  async updateById<T = any>(table: string, id: number | string, payload: Partial<T>) {
    const { data, error } = await this.supabaseClient
      .from(table)
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data as T[];
  }

//eliminar un registro de una tabla
 async deleteById(table: string, id: number | string) {
    const { error } = await this.supabaseClient
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }


// async uploadFile(bucket: string, path: string, file: File): Promise<{ data: any; publicUrl: string }> {
// try{
// const { data, error } = await this.supabaseClient
//     .storage
//     .from(bucket)
//     .upload(path, file, { cacheControl: '3600', upsert: false });

//   if (error) {
//     const msg = (error as any)?.message ?? JSON.stringify(error);
//     throw new Error(msg);
//   }


//   const getUrlResp = this.supabaseClient.storage.from(bucket).getPublicUrl(path);
//   const publicUrl = getUrlResp.data ? (getUrlResp.data as any).publicUrl : '';

//   return { data, publicUrl };
// }catch(err){
//   console.log('Error al subir el archivo:', err);
//   throw err;
// }
  
// }


// async insertAndReturn<T = any>(table: string, payload: Partial<T>) {

//   const { data, error } = await this.supabaseClient
//     .from(table)
//     .insert(payload)
//     .select('id')    // pide que devuelva el id
//     .single();      // esperamos un solo objeto

//   if (error) {
//     // normaliza el error a Error para poder manejarlo en el componente
//     const msg = (error as any)?.message ?? JSON.stringify(error);
//     throw new Error(msg);
//   }
//   return data as T;
// }




public from(table: string) {
  return this.supabaseClient.from(table);
}

// Insert genérico que devuelve array (ya tenías uno similar)
async insert<T = any>(table: string, payload: Partial<T> | Partial<T>[]) {
  const { data, error } = await this.supabaseClient.from(table).insert(payload).select();
  if (error) {
    const msg = (error as any)?.message ?? JSON.stringify(error);
    throw new Error(msg);
  }
  return data as T[];
}

// Insert y devolver el objeto insertado (ej. para pedir id con .single())
// Recibe payload flexible (Partial<any>) y devuelve any (puedes tiparlo al llamar)
async insertAndReturn<T = any>(table: string, payload: Partial<any>) : Promise<T> {
  const { data, error } = await this.supabaseClient
    .from(table)
    .insert(payload)
    .select('id')
    .single();

  if (error) {
    const msg = (error as any)?.message ?? JSON.stringify(error);
    throw new Error(msg);
  }
  return data as T;
}

// uploadFile (si lo tienes, mantenlo igual)...
async uploadFile(bucket: string, path: string, file: File) {
  const { data, error } = await this.supabaseClient
    .storage
    .from(bucket)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) {
    const msg = (error as any)?.message ?? JSON.stringify(error);
    throw new Error(msg);
  }

  const getUrlResp = this.supabaseClient.storage.from(bucket).getPublicUrl(path);
  const publicUrl = getUrlResp.data?.publicUrl ?? '';
  return { data, publicUrl };
}

}
