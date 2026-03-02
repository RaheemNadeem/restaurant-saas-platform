import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OnboardingService {
    private apiUrl = 'https://localhost:7197/api/onboarding';

    constructor(private http: HttpClient) { }

    saveProfile(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/wizard/profile`, payload);
    }

    saveMenu(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/wizard/menu`, payload);
    }

    savePayments(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/wizard/payments`, payload);
    }
}
