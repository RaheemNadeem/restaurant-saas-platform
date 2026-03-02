import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  couponCode: string = '';
  subtotal: number = 29.50;
  tax: number = 2.14;
  discount: number = 0;

  get total(): number {
    const rawTotal = this.subtotal + this.tax;
    const finalTotal = rawTotal - this.discount;
    return finalTotal < 0 ? 0 : finalTotal;
  }

  isApplying = false;
  promoApplied = false;
  promoError: string | null = null;

  constructor(private http: HttpClient) { }

  applyPromo() {
    if (!this.couponCode) return;
    this.isApplying = true;
    this.promoError = null;

    // Simulate backend call to OrdersController/Checkout or a validate endpoint
    this.http.post<any>('http://localhost:5173/api/orders/checkout', {
      subtotal: this.subtotal,
      couponCode: this.couponCode
    }).subscribe({
      next: (res) => {
        // Because the controller evaluates discount against subtotal natively, 
        // we can infer the discount from the response Total.
        this.discount = this.subtotal - res.finalTotal;
        this.promoApplied = true;
        this.isApplying = false;
      },
      error: (err) => {
        this.promoError = 'Invalid or expired coupon code.';
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
}
