import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main class="auth-shell" [class.theme-emerald]="theme() === 'emerald'">
      <section class="auth-card">
        <div class="brand-row">
          <div class="brand-dot"></div>
          <div>
            <h1>Atif Bites Admin</h1>
            <p>Sign in to manage menus, orders, and staff.</p>
          </div>
        </div>

        <label>Email</label>
        <input type="email" placeholder="owner@restaurant.com" />

        <label>Password</label>
        <input type="password" placeholder="••••••••" />

        <div class="row between">
          <label class="checkbox"><input type="checkbox" /> Remember me</label>
          <a href="#">Forgot password?</a>
        </div>

        <button class="btn">Sign In</button>

        <div class="divider">OR</div>
        <button class="btn btn-outline">Continue with Google</button>

        <div class="row between foot">
          <span>New restaurant?</span>
          <a href="#">Create account</a>
        </div>
      </section>

      <aside class="preview-panel">
        <h3>Live Theme Preview</h3>
        <p>Switch tenant theme to preview white-label branding.</p>
        <button class="btn" (click)="toggleTheme()">Switch Theme</button>
        <ul>
          <li>Storefront</li>
          <li>Checkout</li>
          <li>Merchant Admin</li>
          <li>Staff Board</li>
        </ul>
      </aside>
    </main>
  `,
  styleUrl: './app.scss'
})
export class App {
  theme = signal<'default' | 'emerald'>('default');
  toggleTheme() {
    this.theme.update(t => (t === 'default' ? 'emerald' : 'default'));
  }
}
