import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Functional route guard that protects merchant-only routes.
 * Redirects unauthenticated users to /login.
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;
    }

    // Redirect to login, preserving the intended destination
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
    });
    return false;
};
