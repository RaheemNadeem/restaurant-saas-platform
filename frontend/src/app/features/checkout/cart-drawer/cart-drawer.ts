import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem, CartSummary } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
})
export class CartDrawer implements OnInit {
  cartItems: CartItem[] = [];
  cartSummary!: CartSummary;

  get subtotal(): number {
    return this.cartSummary?.subtotal || 0;
  }

  get tax(): number {
    return this.subtotal * 0.08; // 8% tax
  }

  get total(): number {
    return this.subtotal + this.tax;
  }

  constructor(private cartService: CartService) {
    this.cartSummary = this.cartService.getSummary();
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => {
      this.cartItems = items;
      this.cartSummary = this.cartService.getSummary();
    });
  }

  addItem(item: CartItem): void {
    this.cartService.addItem(item);
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId);
  }
}
