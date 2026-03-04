import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RouteCategory {
    title: string;
    routes: { path: string; label: string }[];
}

@Component({
    selector: 'app-dev-sitemap',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dev-sitemap.html',
    styleUrl: './dev-sitemap.scss'
})
export class DevSitemapComponent {
    categories: RouteCategory[] = [
        {
            title: 'Customer Storefront',
            routes: [
                { path: '/', label: 'Landing Page' },
                { path: '/menu', label: 'Browse Menu' },
                { path: '/checkout', label: 'Checkout' },
                { path: '/order-confirmation', label: 'Order Confirmation' },
            ]
        },
        {
            title: 'Auth & Onboarding',
            routes: [
                { path: '/login', label: 'Login' },
                { path: '/signup', label: 'Signup' },
                { path: '/recover', label: 'Recover Account' },
                { path: '/merchant/onboarding', label: 'Onboarding Wizard (Protected)' },
            ]
        },
        {
            title: 'Merchant Dashboard',
            routes: [
                { path: '/merchant/dashboard', label: 'Dashboard Main' },
                { path: '/merchant/order-manager', label: 'Order Manager' },
                { path: '/merchant/staff-board', label: 'Staff Kanban Board' },
                { path: '/merchant/menu', label: 'Menu Manager' },
                { path: '/merchant/promotions', label: 'Promotions' },
                { path: '/merchant/analytics', label: 'Analytics' },
                { path: '/merchant/settings', label: 'Settings' },
            ]
        },
        {
            title: 'Platform Admin',
            routes: [
                { path: '/admin', label: 'Super Admin Panel' },
            ]
        }
    ];
}
