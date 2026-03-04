import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface OrderCard {
    orderId: string;
    customerName: string;
    itemCount: number;
    readyInMinutes: number;
    total: number;
    status: string;
}

@Component({
    selector: 'app-staff-board',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './staff-board.html',
    styleUrl: './staff-board.scss',
})
export class StaffBoard implements OnInit, OnDestroy {
    orders: OrderCard[] = [];
    isLoading = true;
    private pollInterval: any;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadOrders();
        // Poll every 10 seconds for live updates
        this.pollInterval = setInterval(() => this.loadOrders(), 10000);
    }

    ngOnDestroy() {
        if (this.pollInterval) clearInterval(this.pollInterval);
    }

    loadOrders() {
        this.http.get<OrderCard[]>(`${environment.apiUrl}/dashboard/live-orders`).subscribe({
            next: (data) => {
                this.orders = data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    get newOrders(): OrderCard[] {
        return this.orders.filter(o => o.status === 'Created' || o.status === 'New');
    }

    get preparingOrders(): OrderCard[] {
        return this.orders.filter(o => o.status === 'Preparing');
    }

    get readyOrders(): OrderCard[] {
        return this.orders.filter(o => o.status === 'Ready');
    }

    moveToStatus(orderId: string, newStatus: string) {
        // Extract numeric ID from order number like "#QS-7045"
        const id = orderId;
        this.http.put(`${environment.apiUrl}/orders/${id}/status`, { status: newStatus }).subscribe({
            next: () => this.loadOrders(),
            error: (err) => console.error('Status update failed', err)
        });
    }

    getElapsedTime(readyInMinutes: number): string {
        if (readyInMinutes <= 0) return 'Now';
        return `~${readyInMinutes} min`;
    }
}
