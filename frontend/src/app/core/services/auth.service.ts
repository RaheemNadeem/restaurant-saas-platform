import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
    token: string;
}

export interface SignupResponse {
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'https://localhost:7197/api/auth';

    // Basic token cache in memory for the sprint
    private currentToken: string | null = null;

    constructor(private http: HttpClient) { }

    login(payload: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
            tap(res => {
                if (res && res.token) {
                    this.currentToken = res.token;
                    // In a real app we'd secure this in HTTP-only cookies or carefully managed localStorage
                    localStorage.setItem('qs_auth_token', res.token);
                }
            })
        );
    }

    signup(payload: any): Observable<SignupResponse> {
        return this.http.post<SignupResponse>(`${this.apiUrl}/signup`, payload);
    }

    getToken(): string | null {
        if (!this.currentToken) {
            this.currentToken = localStorage.getItem('qs_auth_token');
        }
        return this.currentToken;
    }

    // --- Mocked Recovery Methods (Sprint 9) ---
    requestPasswordReset(email: string): Observable<any> {
        // Mock a 1-second delay for the email sending process
        return new Observable(observer => {
            console.log(`[Mock] Send reset link to: ${email}`);
            setTimeout(() => {
                observer.next({ success: true, message: 'Link sent' });
                observer.complete();
            }, 1000);
        });
    }

    resetPassword(token: string, newPassword: string): Observable<any> {
        // Mock a 1-second delay for saving the new password
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
