import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    getSummary(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/summary`);
    }

    getLiveOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/live-orders`);
    }
}
