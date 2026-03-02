import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
    token: string;
    userId: string;
    name: string;
    role: string;
    expiresIn: number;
}

export interface RegisterResponse {
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private readonly TOKEN_KEY = 'qs_auth_token';
    private readonly USER_KEY = 'qs_user';

    private isAuthenticated$ = new BehaviorSubject<boolean>(this.hasValidToken());

    constructor(private http: HttpClient) { }

    login(payload: { email: string; password: string }): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
            tap(res => {
                if (res?.token) {
                    localStorage.setItem(this.TOKEN_KEY, res.token);
                    localStorage.setItem(this.USER_KEY, JSON.stringify({
                        userId: res.userId,
                        name: res.name,
                        role: res.role
                    }));
                    this.isAuthenticated$.next(true);
                }
            })
        );
    }

    register(payload: { name?: string; email: string; password: string }): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, payload);
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.isAuthenticated$.next(false);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isLoggedIn(): boolean {
        return this.hasValidToken();
    }

    isLoggedIn$(): Observable<boolean> {
        return this.isAuthenticated$.asObservable();
    }

    getUser(): { userId: string; name: string; role: string } | null {
        const raw = localStorage.getItem(this.USER_KEY);
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return null; }
    }

    private hasValidToken(): boolean {
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (!token) return false;

        // Basic JWT expiry check (decode payload without library)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    // --- Mocked Recovery Methods (Sprint 9) ---
    requestPasswordReset(email: string): Observable<any> {
        return new Observable(observer => {
            console.log(`[Mock] Send reset link to: ${email}`);
            setTimeout(() => {
                observer.next({ success: true, message: 'Link sent' });
                observer.complete();
            }, 1000);
        });
    }

    resetPassword(token: string, newPassword: string): Observable<any> {
        return new Observable(observer => {
            console.log(`[Mock] Password reset for token: ${token}`);
            setTimeout(() => {
                if (token === 'expired') {
                    observer.error({ status: 400, message: 'Token expired' });
                } else {
                    observer.next({ success: true, message: 'Password updated' });
                }
                observer.complete();
            }, 1000);
        });
    }
}
