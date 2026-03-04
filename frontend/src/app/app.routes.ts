import { Routes } from '@angular/router';
import { StorefrontLanding } from './features/storefront/storefront-landing';
import { MenuBrowse } from './features/menu-browse/menu-browse';
import { Checkout } from './features/checkout/checkout';
import { OrderConfirmation } from './features/checkout/order-confirmation';
import { RecoverAccountComponent } from './features/auth/recover-account';
import { ResetPasswordComponent } from './features/auth/reset-password';
import { ResetSuccessComponent } from './features/auth/reset-success';
import { OrderManagerComponent } from './features/order-manager/order-manager';
import { Dashboard } from './features/dashboard/dashboard';
import { Auth } from './features/auth/auth';
import { Onboarding } from './features/onboarding/onboarding';
import { Menu } from './features/menu/menu';
import { PromotionsManager } from './features/promotions/promotions-manager/promotions-manager';
import { Analytics } from './features/analytics/analytics';
import { Settings } from './features/settings/settings';
import { StaffBoard } from './features/staff-board/staff-board';
import { authGuard } from './core/guards/auth.guard';
import { onboardingGuard } from './core/guards/onboarding.guard';
import { AdminComponent } from './features/admin/admin.component';
import { MerchantLayoutComponent } from './core/layouts/merchant-layout';
import { DevSitemapComponent } from './features/dev-sitemap/dev-sitemap';

export const routes: Routes = [
  // Developer Testing Route
  { path: 'dev', component: DevSitemapComponent },

  // Customer Storefront (no auth required)
  { path: '', component: StorefrontLanding },
  { path: 'menu', component: MenuBrowse },
  { path: 'checkout', component: Checkout },
  { path: 'cart', loadComponent: () => import('./features/checkout/cart-drawer/cart-drawer').then(m => m.CartDrawer) },
  { path: 'order-confirmation', component: OrderConfirmation },

  // Authentication & Recovery (no auth required)
  { path: 'login', component: Auth },
  { path: 'signup', component: Auth },
  { path: 'merchant/login', redirectTo: 'login' },
  { path: 'merchant/signup', redirectTo: 'signup' },
  { path: 'recover', component: RecoverAccountComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-success', component: ResetSuccessComponent },

  // Merchant Portal - Onboarding (Protected, but NO Sidebar)
  { path: 'merchant/onboarding', component: Onboarding, canActivate: [authGuard] },

  // Super-Admin (protected by authGuard — role check happens at API level)
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },

  // Merchant Portal Internal Pages (Protected, WITH Sidebar wrapper)
  {
    path: 'merchant',
    component: MerchantLayoutComponent,
    canActivate: [authGuard, onboardingGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'menu', component: Menu },
      { path: 'promotions', component: PromotionsManager },
      { path: 'order-manager', component: OrderManagerComponent },
      { path: 'analytics', component: Analytics },
      { path: 'settings', component: Settings },
      { path: 'staff-board', component: StaffBoard },
    ]
  },

  // Catch all
  { path: '**', redirectTo: '' }
];
