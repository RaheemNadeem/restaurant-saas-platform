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
}
