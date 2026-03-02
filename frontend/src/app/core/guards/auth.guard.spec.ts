import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    const mockRoute = {} as ActivatedRouteSnapshot;

    beforeEach(() => {
        authService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
        router = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router }
            ]
        });
    });

    it('should allow access when authenticated', () => {
        authService.isLoggedIn.and.returnValue(true);
        const mockState = { url: '/merchant/dashboard' } as RouterStateSnapshot;

        const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should redirect to /login when not authenticated', () => {
        authService.isLoggedIn.and.returnValue(false);
        const mockState = { url: '/merchant/dashboard' } as RouterStateSnapshot;

        const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(
            ['/login'],
            { queryParams: { returnUrl: '/merchant/dashboard' } }
        );
    });

    it('should preserve the return URL for deep links', () => {
        authService.isLoggedIn.and.returnValue(false);
        const mockState = { url: '/merchant/analytics' } as RouterStateSnapshot;

        TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

        expect(router.navigate).toHaveBeenCalledWith(
            ['/login'],
            { queryParams: { returnUrl: '/merchant/analytics' } }
        );
    });
});
