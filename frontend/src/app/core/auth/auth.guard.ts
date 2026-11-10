import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

/** Allows the route only for a logged-in user (asks GET /auth/me when the user is not loaded yet). */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.ensureUser().pipe(map((user) => (user ? true : router.createUrlTree(['/signin']))));
};

/** Sends an already logged-in user from the sign-in page to the main screen. */
export const signinGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth
    .ensureUser()
    .pipe(map((user) => (user ? router.createUrlTree(['/main/sidework-calendar']) : true)));
};
