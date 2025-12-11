// src/app/core/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    const resp = await auth.getUser();
    const user = resp?.user ?? null;

    if (!user) {
      // redirige al login y pasa la ruta que quería abrir en returnUrl
      await router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    return true;
  } catch (err) {
    console.error('Auth guard error', err);
    await router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
};
