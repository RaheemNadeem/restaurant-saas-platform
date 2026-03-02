import { Routes } from '@angular/router';
import { ScreenPageComponent } from './screens/screen-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'merchant/signup' },
  { path: 'merchant/signup', loadComponent: () => import('./features/auth/auth').then(m => m.Auth) },
  { path: 'merchant/login', loadComponent: () => import('./features/auth/auth').then(m => m.Auth) },
  { path: 'merchant/onboarding', loadComponent: () => import('./features/onboarding/onboarding').then(m => m.Onboarding) },
  { path: 'merchant/brand-setup', component: ScreenPageComponent, data: { screenKey: 'brand-setup' } },
  { path: 'merchant/menu-manager', loadComponent: () => import('./features/menu/menu').then(m => m.Menu) },
  { path: 'merchant/payments-setup', component: ScreenPageComponent, data: { screenKey: 'payments-setup' } },
  { path: 'merchant/publish-status', component: ScreenPageComponent, data: { screenKey: 'publish-status' } },
  { path: 'merchant/dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard) },
  { path: 'merchant/order-manager', loadComponent: () => import('./features/order-manager/order-manager').then(m => m.OrderManagerComponent) },
  { path: 'merchant/promotions', loadComponent: () => import('./features/promotions/promotions-manager/promotions-manager').then(m => m.PromotionsManager) },
  { path: 'merchant/analytics', loadComponent: () => import('./features/analytics/analytics').then(m => m.Analytics) },

  { path: 'account/recover-link-sent', component: ScreenPageComponent, data: { screenKey: 'recover-link-sent' } },
  { path: 'account/reset-email-received', component: ScreenPageComponent, data: { screenKey: 'reset-email-received' } },
  { path: 'account/reset-email-template', component: ScreenPageComponent, data: { screenKey: 'reset-email-template' } },
  { path: 'account/reset-password-form', component: ScreenPageComponent, data: { screenKey: 'reset-password-form' } },
  { path: 'account/reset-password-weak', component: ScreenPageComponent, data: { screenKey: 'reset-password-weak' } },
  { path: 'account/reset-password-mismatch', component: ScreenPageComponent, data: { screenKey: 'reset-password-mismatch' } },
  { path: 'account/reset-password-success', component: ScreenPageComponent, data: { screenKey: 'reset-password-success' } },
  { path: 'account/reset-password-expired', component: ScreenPageComponent, data: { screenKey: 'reset-password-expired' } },

  { path: 'staff/login', component: ScreenPageComponent, data: { screenKey: 'staff-login' } },
  { path: 'staff/role-access-entry', component: ScreenPageComponent, data: { screenKey: 'role-access-entry' } },
  { path: 'staff/onboarding-invite', component: ScreenPageComponent, data: { screenKey: 'staff-onboarding-invite' } },
  { path: 'staff/management-auth', component: ScreenPageComponent, data: { screenKey: 'staff-management-auth' } },
  { path: 'staff/order-board', component: ScreenPageComponent, data: { screenKey: 'staff-order-board' } },
  { path: 'staff/board-advanced', component: ScreenPageComponent, data: { screenKey: 'staff-board-advanced' } },

  { path: 'customer/storefront', component: ScreenPageComponent, data: { screenKey: 'storefront' } },
  { path: 'customer/menu', component: ScreenPageComponent, data: { screenKey: 'customer-menu' } },
  { path: 'customer/menu-search-active', component: ScreenPageComponent, data: { screenKey: 'menu-search-active' } },
  { path: 'customer/cart-drawer', component: ScreenPageComponent, data: { screenKey: 'cart-drawer' } },
  { path: 'customer/checkout', loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout) },
  { path: 'customer/payment-failed', component: ScreenPageComponent, data: { screenKey: 'payment-failed' } },
  { path: 'customer/payment-canceled', component: ScreenPageComponent, data: { screenKey: 'payment-canceled' } },
  { path: 'customer/order-confirmation', component: ScreenPageComponent, data: { screenKey: 'order-confirmation' } },

  { path: '**', redirectTo: 'merchant/signup' }
];
