import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../app/core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;

  get f() {
    return this.form.controls;
  }

  async onSubmit() {
    // marcar controles para mostrar errores si hay
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.form.value as { email: string; password: string };

    try {
      // signIn usando tu AuthService (Supabase)
      await this.auth.signIn(email, password);

      // feedback
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Bienvenido',
        showConfirmButton: false,
        timer: 1400,
        timerProgressBar: true
      });

      // redirigir a returnUrl si existe, si no a /dashboard
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      await this.router.navigateByUrl(returnUrl);
    } catch (error: any) {
      console.error('Login error', error);

      // mensaje legible
      const msg = error?.message ?? (error?.error?.message ?? 'Credenciales inválidas');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg
      });
    } finally {
      this.loading = false;
    }
  }
}
