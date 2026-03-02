import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuService, Menu, MenuItem, MenuCategory } from '../../core/services/menu';
import { CartService, CartSummary } from '../../core/services/cart.service';

@Component({
    selector: 'app-menu-browse',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './menu-browse.html',
    styleUrl: './menu-browse.scss'
})
export class MenuBrowse implements OnInit {
    menuData: Menu | null = null;
    selectedCategoryId: string = 'all';
    cartSummary: CartSummary;
    searchTerm: string = '';

    constructor(
        private menuService: MenuService,
        private cartService: CartService
    ) {
        this.cartSummary = this.cartService.getSummary();
    }

    ngOnInit(): void {
        this.loadMenu();
        this.cartService.getCart().subscribe(() => {
            this.cartSummary = this.cartService.getSummary();
        });
    }

    loadMenu(): void {
        this.menuService.getMenu().subscribe({
            next: (menu) => this.menuData = menu,
            error: (err) => console.error('Failed to load menu', err)
        });
    }

    get filteredCategories(): MenuCategory[] {
        if (!this.menuData) return [];
        if (this.selectedCategoryId === 'all') return this.menuData.categories;
        return this.menuData.categories.filter(c => c.id === this.selectedCategoryId);
    }

    addToCart(item: MenuItem): void {
        this.cartService.addItem(item);
    }

    removeFromCart(itemId: string): void {
        this.cartService.removeItem(itemId);
    }

    getItemQuantity(itemId: string): number {
        const item = this.cartSummary.items.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    }
}
