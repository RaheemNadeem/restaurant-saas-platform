import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartSummary } from '../../core/services/cart.service';
import { MenuService, Menu, MenuItem } from '../../core/services/menu';

@Component({
    selector: 'app-storefront-landing',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './storefront-landing.html',
    styleUrl: './storefront-landing.scss'
})
export class StorefrontLanding implements OnInit {
    cartSummary: CartSummary;
    featuredItems: MenuItem[] = [];

    constructor(
        private cartService: CartService,
        private menuService: MenuService
    ) {
        this.cartSummary = this.cartService.getSummary();
    }

    ngOnInit(): void {
        this.cartService.getCart().subscribe(() => {
            this.cartSummary = this.cartService.getSummary();
        });

        this.loadFeaturedItems();
    }

    loadFeaturedItems(): void {
        this.menuService.getMenu().subscribe({
            next: (menu) => {
                // Just take a few items for "Highlights"
                this.featuredItems = menu.categories
                    .flatMap(c => c.items)
                    .slice(0, 3);
            },
            error: (err) => console.error('Failed to load menu highlights', err)
        });
    }

    addToCart(item: MenuItem): void {
        this.cartService.addItem(item);
    }
}
