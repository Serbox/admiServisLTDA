// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient;
  

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Registro (signup) — crea usuario con email + password
  async signUp(email: string, password: string) {
    const resp = await this.supabase.auth.signUp({ email, password });
    if (resp.error) throw resp.error;
    return resp.data; // contiene user + maybe session
  }

  // Iniciar sesión (sign in) con email/password
  async signIn(email: string, password: string) {
    const resp = await this.supabase.auth.signInWithPassword({ email, password });
    if (resp.error) throw resp.error;
    return resp.data; // session + user
  }

  // Cerrar sesión
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  // Enviar correo para reset password (si tu proyecto tiene email configurado)
  async resetPasswordForEmail(email: string) {
    const resp = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password' // opcional: donde aterriza el link
    });
    if (resp.error) throw resp.error;
    return resp;
  }

  // Obtener usuario actual / sesión
  async getUser() {
    const resp = await this.supabase.auth.getUser();
    if (resp.error) throw resp.error;
    return resp.data;
  }




  
}
