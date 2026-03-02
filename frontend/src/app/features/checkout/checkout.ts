import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CartService, CartSummary } from '../../core/services/cart.service';
import { environment } from '../../../environments/environment';

export interface CartItemDto {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  couponCode: string = '';
  cartSummary: CartSummary;
  discount: number = 0;
  isOrdering = false;

  get subtotal(): number {
    return this.cartSummary.subtotal;
  }

  get tax(): number {
    return this.subtotal * 0.08; // 8% tax
  }

  get total(): number {
    const rawTotal = this.subtotal + this.tax;
    const finalTotal = rawTotal - this.discount;
    return finalTotal < 0 ? 0 : finalTotal;
  }

  isApplying = false;
  promoApplied = false;
  promoError: string | null = null;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private router: Router
  ) {
    this.cartSummary = this.cartService.getSummary();
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(() => {
      this.cartSummary = this.cartService.getSummary();
    });
  }

  applyPromo() {
    if (!this.couponCode) return;
    this.isApplying = true;
    this.promoError = null;

    this.http.post<any>(`${environment.apiUrl}/orders/validate-coupon`, {
      subtotal: this.subtotal,
      couponCode: this.couponCode
    }).subscribe({
      next: (res) => {
        this.discount = this.subtotal - res.discountedSubtotal;
        this.promoApplied = true;
        this.isApplying = false;
      },
      error: (err) => {
        this.promoError = err.error || 'Invalid or expired coupon code.';
        this.isApplying = false;
      }
    });
  }

  removePromo() {
    this.couponCode = '';
    this.discount = 0;
    this.promoApplied = false;
    this.promoError = null;
  }

  placeOrder() {
    if (this.cartSummary.items.length === 0) return;

    this.isOrdering = true;

    const cartItems: CartItemDto[] = this.cartSummary.items.map(i => ({
      menuItemId: i.id,
      name: i.name,
      quantity: i.quantity,
      price: i.price
    }));

    const orderPayload = {
      customerName: 'Guest Customer',  // Will be replaced by JWT claim in Sprint 10 Phase 5
      customerEmail: 'customer@quickserve.app',
      subtotal: this.subtotal,
      couponCode: this.couponCode || null,
      items: cartItems
    };

    this.http.post<any>(`${environment.apiUrl}/orders/checkout`, orderPayload).subscribe({
      next: (res) => {
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation'], { queryParams: { orderNumber: res.orderNumber } });
      },
      error: (err) => {
        console.error('Failed to place order', err);
        this.isOrdering = false;
      }
    });
  }
}
