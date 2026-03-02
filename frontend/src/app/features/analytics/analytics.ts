import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface FunnelData {
    storefrontViews: number;
    cartAdditions: number;
    checkoutsStarted: number;
    ordersCompleted: number;
    totalRevenue: number;
}

export interface TenantHealth {
    activeOrders: number;
    completedToday: number;
    averagePrepTime: string;
    customerRating: number;
    topSeller: string;
}

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './analytics.html',
})
export class Analytics implements OnInit {
    funnel: FunnelData | null = null;
    health: TenantHealth | null = null;
    isLoading = true;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.isLoading = true;

        // In a real app we'd use forkJoin, but simple subscribers are fine for this sprint demo
        this.http.get<FunnelData>('http://localhost:5173/api/analytics/funnel').subscribe({
            next: (data) => this.funnel = data,
            error: (err) => console.error('Funnel load failed', err)
        });

        this.http.get<TenantHealth>('http://localhost:5173/api/analytics/tenant-health').subscribe({
            next: (data) => {
                this.health = data;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Health load failed', err);
                this.isLoading = false;
            }
        });
    }

    getConversionRate(): string {
        if (!this.funnel || this.funnel.storefrontViews === 0) return '0%';
        const rate = (this.funnel.ordersCompleted / this.funnel.storefrontViews) * 100;
        return rate.toFixed(1) + '%';
    }
}
