import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="shell" [class.theme-emerald]="theme() === 'emerald'">
      <div class="card">
        <h1>Restaurant SaaS UI Preview</h1>
        <p>Theme + screen skeleton preview (Sprint 1)</p>
        <button class="btn" (click)="toggleTheme()">Switch Theme</button>
      </div>
      <div class="card"><h3>Storefront</h3><p>Branded menu landing section preview.</p></div>
      <div class="card"><h3>Checkout</h3><p>Cart summary + payment CTA layout preview.</p></div>
      <div class="card"><h3>Merchant Admin</h3><p>Menu/items management shell preview.</p></div>
      <div class="card"><h3>Staff Board</h3><p>Order status column shell preview.</p></div>
      <router-outlet />
    </main>
  `,
})
export class App {
  theme = signal<'default' | 'emerald'>('default');
  toggleTheme() {
    this.theme.update(t => (t === 'default' ? 'emerald' : 'default'));
  }
}
