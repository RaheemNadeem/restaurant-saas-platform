import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main class="auth-shell" [class.theme-emerald]="theme() === 'emerald'">
      <div class="blob blob-a"></div>
      <div class="blob blob-b"></div>

      <section class="auth-card sticker-card">
        <div class="sticker">🍔 Goofy Mode</div>
        <div class="brand-row">
          <div class="brand-dot"></div>
          <div>
            <h1>Atif Bites Admin 🚀</h1>
            <p>Let’s serve orders, vibes, and a little chaos ✨</p>
          </div>
        </div>

        <label>Email</label>
        <input type="email" placeholder="owner@restaurant.com" />

        <label>Password</label>
        <input type="password" placeholder="••••••••" />

        <div class="row between">
          <label class="checkbox"><input type="checkbox" /> Keep me logged in 😎</label>
          <a href="#">I forgot it 😬</a>
        </div>

        <button class="btn">Sign In 🍟</button>

        <div class="divider">OR</div>
        <button class="btn btn-outline">Continue with Google 🧁</button>

        <div class="row between foot">
          <span>New restaurant?</span>
          <a href="#">Join the party 🎉</a>
        </div>
      </section>

      <aside class="preview-panel sticker-card">
        <h3>Theme Playground 🎨</h3>
        <p>Flip themes and preview screens with playful components.</p>
        <button class="btn" (click)="toggleTheme()">Switch Theme 🪄</button>

        <div class="mini-cards">
          <div class="mini">🍕 Storefront</div>
          <div class="mini">🛒 Checkout</div>
          <div class="mini">📋 Admin</div>
          <div class="mini">🧑‍🍳 Staff Board</div>
        </div>
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
