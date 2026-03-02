import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = 'http://localhost:5173/api/orders';

    constructor(private http: HttpClient) { }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    updateOrderStatus(orderId: string, status: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${orderId}/status`, { status });
    }
}
