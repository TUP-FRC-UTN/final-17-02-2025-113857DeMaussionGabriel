import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  let isLogged = localStorage.getItem('user');

  if (isLogged) {
    return true;
  }
  
  router.navigate(['/login']);
  alert('Debes iniciar sesión para acceder a esta página');
  return false;
};
