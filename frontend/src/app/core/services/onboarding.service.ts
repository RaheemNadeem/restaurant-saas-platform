import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OnboardingService {
    private apiUrl = `${environment.apiUrl}/onboarding`;

    constructor(private http: HttpClient) { }

    saveProfile(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/wizard/profile`, payload);
    }

    saveBranding(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/wizard/branding`, payload);
    }

    saveMenu(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/wizard/menu`, payload);
    }

    savePayments(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/wizard/payments`, payload);
    }

    publish(): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/wizard/publish`, {});
    }

    getStatus(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/status`);
    }
}
