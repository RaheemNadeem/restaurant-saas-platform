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

declare var Stripe: any;

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

  stripe: any;
  elements: any;
  paymentElement: any;

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
      next: async (res) => {
        const clientSecret = res.clientSecret;

        if (!this.stripe) {
          // Note: Replace with your actual Stripe publishable key
          this.stripe = Stripe('pk_test_...your_stripe_publishable_key_here...');
        }

        this.elements = this.stripe.elements({ clientSecret });
        this.paymentElement = this.elements.create('payment');
        this.paymentElement.mount('#payment-element');

        const { error } = await this.stripe.confirmPayment({
          elements: this.elements,
          confirmParams: {
            return_url: `${window.location.origin}/order-confirmation?orderNumber=${res.orderNumber}`,
          },
        });

        if (error) {
          const messageContainer = document.querySelector('#payment-message');
          if (messageContainer) {
            messageContainer.textContent = error.message;
            messageContainer.classList.remove('hidden');
          }
          this.isOrdering = false;
        } else {
          this.cartService.clearCart();
          // The router redirect is natively handled by confirmPayment return_url
        }
      },
      error: (err) => {
        console.error('Failed to place order', err);
        this.isOrdering = false;
      }
    });
  }
}
