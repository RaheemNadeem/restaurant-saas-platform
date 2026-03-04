import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface NavItem {
    label: string;
    path: string;
    icon: string;
}

interface NavGroup {
    title: string;
    items: NavItem[];
    authRequired?: boolean;
}

@Component({
    selector: 'app-merchant-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './merchant-layout.html',
    styleUrl: './merchant-layout.scss'
})
export class MerchantLayoutComponent {
    constructor(public auth: AuthService, private router: Router) { }

    get isLoggedIn(): boolean {
        return this.auth.isLoggedIn();
    }

    get userName(): string {
        return this.auth.getUser()?.name ?? 'User';
    }

    get userRole(): string {
        return this.auth.getUser()?.role ?? '';
    }

    get navGroups(): NavGroup[] {
        const groups: NavGroup[] = [];

        if (this.isLoggedIn) {
            groups.push({
                title: 'Merchant',
                authRequired: true,
                items: [
                    { label: 'Dashboard', path: '/merchant/dashboard', icon: '📊' },
                    { label: 'Order Manager', path: '/merchant/order-manager', icon: '📋' },
                    { label: 'Staff Board', path: '/merchant/staff-board', icon: '🍳' },
                    { label: 'Menu Manager', path: '/merchant/menu', icon: '🍽️' },
                    { label: 'Promotions', path: '/merchant/promotions', icon: '🏷️' },
                    { label: 'Analytics', path: '/merchant/analytics', icon: '📈' },
                    { label: 'Settings', path: '/merchant/settings', icon: '⚙️' },
                ]
            });

            if (this.userRole === 'Admin') {
                groups.push({
                    title: 'Platform Admin',
                    authRequired: true,
                    items: [
                        { label: 'Admin Panel', path: '/admin', icon: '🛡️' },
                    ]
                });
            }
        }

        groups.push({
            title: 'Storefront',
            items: [
                { label: 'Landing Page', path: '/', icon: '🏠' },
                { label: 'Browse Menu', path: '/menu', icon: '📖' },
                { label: 'Checkout', path: '/checkout', icon: '🛒' },
            ]
        });

        return groups;
    }

    logout(): void {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
