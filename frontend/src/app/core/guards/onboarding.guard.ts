import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OnboardingService } from '../services/onboarding.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const onboardingGuard: CanActivateFn = (route, state) => {
    const onboardingService = inject(OnboardingService);
    const router = inject(Router);

    return onboardingService.getStatus().pipe(
        map(status => {
            if (status && status.onboardingComplete) {
                return true;
            }
            return router.createUrlTree(['/merchant/onboarding']);
        }),
        catchError(() => {
            return of(router.createUrlTree(['/merchant/onboarding']));
        })
    );
};
