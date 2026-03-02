import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from './menu';

export interface CartItem extends MenuItem {
    quantity: number;
}

export interface CartSummary {
    items: CartItem[];
    subtotal: number;
    itemCount: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = new BehaviorSubject<CartItem[]>([]);
    private readonly STORAGE_KEY = 'quickserve_cart';

    constructor() {
        this.loadCart();
    }

    getCart(): Observable<CartItem[]> {
        return this.cartItems.asObservable();
    }

    addItem(item: MenuItem): void {
        const currentItems = this.cartItems.value;
        const existingItem = currentItems.find(i => i.id === item.id);

        if (existingItem) {
            existingItem.quantity += 1;
            this.cartItems.next([...currentItems]);
        } else {
            this.cartItems.next([...currentItems, { ...item, quantity: 1 }]);
        }
        this.saveCart();
    }

    removeItem(itemId: string): void {
        const currentItems = this.cartItems.value;
        const existingItem = currentItems.find(i => i.id === itemId);

        if (existingItem) {
            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
                this.cartItems.next([...currentItems]);
            } else {
                this.cartItems.next(currentItems.filter(i => i.id !== itemId));
            }
            this.saveCart();
        }
    }

    clearCart(): void {
        this.cartItems.next([]);
        this.saveCart();
    }

    getSummary(): CartSummary {
        const items = this.cartItems.value;
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        return {
            items,
            subtotal,
            itemCount
        };
    }

    private saveCart(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems.value));
    }

    private loadCart(): void {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                this.cartItems.next(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load cart from storage', e);
                this.cartItems.next([]);
            }
        }
    }
}
