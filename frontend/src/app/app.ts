import { Component, OnDestroy, computed, signal } from '@angular/core';

type DemoScreenId =
  | 'login'
  | 'onboarding'
  | 'branding'
  | 'menu'
  | 'payments'
  | 'publish'
  | 'order-board';

interface DemoScreen {
  id: DemoScreenId;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main class="demo-shell" [class.theme-emerald]="theme() === 'emerald'">
      <header class="topbar">
        <div>
          <h1>QuickServe Demo Mode</h1>
          <p>Animated walkthrough with prefilled dummy data</p>
        </div>
        <div class="controls">
          <button class="btn btn-soft" (click)="prev()">Previous</button>
          <button class="btn" (click)="next()">Next</button>
          <button class="btn btn-outline" (click)="toggleAutoplay()">
            {{ autoplay() ? 'Pause Autoplay' : 'Start Autoplay' }}
          </button>
          <button class="btn btn-soft" (click)="toggleTheme()">Switch Theme</button>
        </div>
      </header>

      <section class="layout">
        <aside class="timeline">
          @for (screen of screens; track screen.id; let i = $index) {
            <button class="step" [class.active]="i === screenIndex()" (click)="goTo(i)">
              <span class="dot"></span>
              <span>{{ i + 1 }}. {{ screen.title }}</span>
            </button>
          }
        </aside>

        <section class="stage" [class.animating]="animating()">
          <div class="stage-head">
            <h2>{{ currentScreen().title }}</h2>
            <p>{{ currentScreen().subtitle }}</p>
          </div>

          @switch (currentScreen().id) {
            @case ('login') {
              <div class="card">
                <h3>Owner Login</h3>
                <div class="field"><label>Email</label><span>owner@quickservekitchen.com</span></div>
                <div class="field"><label>Password</label><span>********</span></div>
                <div class="row split"><span>Remember me</span><span class="link">Forgot password</span></div>
                <button class="btn wide">Sign In</button>
              </div>
            }
            @case ('onboarding') {
              <div class="grid-2">
                <div class="card">
                  <h3>Business Profile</h3>
                  <ul>
                    <li>Restaurant: QuickServe Kitchen</li>
                    <li>Owner: Ayesha Rahman</li>
                    <li>Email: owner@quickservekitchen.com</li>
                    <li>Phone: +1 (555) 123-4567</li>
                  </ul>
                </div>
                <div class="card">
                  <h3>Progress</h3>
                  <ul>
                    <li>Business: In progress</li>
                    <li>Branding: Pending</li>
                    <li>Menu: Pending</li>
                    <li>Payments: Pending</li>
                    <li>Publish: Pending</li>
                  </ul>
                </div>
              </div>
            }
            @case ('branding') {
              <div class="grid-2">
                <div class="card">
                  <h3>Brand Setup</h3>
                  <ul>
                    <li>Display name: QuickServe Kitchen</li>
                    <li>Primary color: #EF4444</li>
                    <li>Typography: Outfit + Inter</li>
                    <li>Logo: quickserve-logo.svg</li>
                  </ul>
                </div>
                <div class="card">
                  <h3>Storefront Preview</h3>
                  <div class="preview-box">
                    <strong>QuickServe Kitchen</strong>
                    <p>Fresh wraps and bowls ready for pickup</p>
                    <button class="btn">View Menu</button>
                  </div>
                </div>
              </div>
            }
            @case ('menu') {
              <div class="card">
                <h3>Menu Catalog</h3>
                <div class="menu-row">
                  <span>Chicken Shawarma Wrap</span><span>Prep 12 min</span><span>$12.90</span><span>Active</span>
                </div>
                <div class="menu-row">
                  <span>Falafel Bowl</span><span>Prep 10 min</span><span>$11.50</span><span>Active</span>
                </div>
                <div class="menu-row">
                  <span>Mango Lassi</span><span>Prep 3 min</span><span>$4.90</span><span>Unavailable</span>
                </div>
                <div class="row actions">
                  <button class="btn btn-outline">Upload Item Image</button>
                  <button class="btn btn-soft">Save Item</button>
                </div>
              </div>
            }
            @case ('payments') {
              <div class="grid-2">
                <div class="card">
                  <h3>Stripe Connect</h3>
                  <ul>
                    <li>Legal name: QuickServe Kitchen LLC</li>
                    <li>Tax ID: XX-XXXXXXX</li>
                    <li>Bank account: ...4821</li>
                    <li>Payouts: Daily</li>
                  </ul>
                </div>
                <div class="card">
                  <h3>Status</h3>
                  <ul>
                    <li>Stripe account linked</li>
                    <li>Webhook healthy</li>
                    <li>KYC pending</li>
                  </ul>
                  <button class="btn wide">Run Test Payment</button>
                </div>
              </div>
            }
            @case ('publish') {
              <div class="grid-2">
                <div class="card">
                  <h3>Launch Readiness</h3>
                  <ul>
                    <li>Business profile complete</li>
                    <li>Brand assets configured</li>
                    <li>Menu seeded with 12 items</li>
                    <li>Stripe onboarding pending</li>
                  </ul>
                </div>
                <div class="card">
                  <h3>Go Live</h3>
                  <p>Current status: Not ready (payments blocked)</p>
                  <button class="btn wide">Publish Storefront</button>
                </div>
              </div>
            }
            @case ('order-board') {
              <div class="card">
                <h3>Staff Order Board (Realtime Demo)</h3>
                <div class="menu-row">
                  <span>#QS-1061 Mia Davis</span><span>New</span><span>$9.80</span><span>2 min ago</span>
                </div>
                <div class="menu-row">
                  <span>#QS-1060 Chris Park</span><span>Preparing</span><span>$41.10</span><span>8 min ago</span>
                </div>
                <div class="menu-row">
                  <span>#QS-1059 Riley Chen</span><span>Ready</span><span>$21.40</span><span>Waiting</span>
                </div>
              </div>
            }
          }
        </section>
      </section>
    </main>
  `,
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  readonly screens: DemoScreen[] = [
    { id: 'login', title: 'Owner Login', subtitle: 'Authenticate merchant owner account' },
    { id: 'onboarding', title: 'Onboarding Wizard', subtitle: 'Collect business profile and setup data' },
    { id: 'branding', title: 'Brand Setup', subtitle: 'Configure colors, logo, and typography' },
    { id: 'menu', title: 'Menu Manager', subtitle: 'Prefilled catalog with image upload controls' },
    { id: 'payments', title: 'Payments Setup', subtitle: 'Stripe Connect with test transaction checks' },
    { id: 'publish', title: 'Publish Status', subtitle: 'Run readiness checks before launch' },
    { id: 'order-board', title: 'Staff Order Board', subtitle: 'Realtime order statuses and actions' }
  ];

  theme = signal<'default' | 'emerald'>('default');
  screenIndex = signal(0);
  autoplay = signal(true);
  animating = signal(false);
  currentScreen = computed(() => this.screens[this.screenIndex()]);
  private autoplayTimer?: ReturnType<typeof setInterval>;

  constructor() {
    this.setAutoplay(true);
  }

  toggleTheme() {
    this.theme.update(t => (t === 'default' ? 'emerald' : 'default'));
  }

  goTo(index: number) {
    this.setScreen(index);
  }

  next() {
    const nextIndex = (this.screenIndex() + 1) % this.screens.length;
    this.setScreen(nextIndex);
  }

  prev() {
    const prevIndex = (this.screenIndex() - 1 + this.screens.length) % this.screens.length;
    this.setScreen(prevIndex);
  }

  toggleAutoplay() {
    this.setAutoplay(!this.autoplay());
  }

  ngOnDestroy() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
    }
  }

  private setScreen(index: number) {
    if (index === this.screenIndex()) return;
    this.animating.set(true);
    this.screenIndex.set(index);
    setTimeout(() => this.animating.set(false), 320);
  }

  private setAutoplay(enabled: boolean) {
    this.autoplay.set(enabled);
    if (this.autoplayTimer) clearInterval(this.autoplayTimer);
    if (!enabled) return;
    this.autoplayTimer = setInterval(() => this.next(), 3500);
  }
}
