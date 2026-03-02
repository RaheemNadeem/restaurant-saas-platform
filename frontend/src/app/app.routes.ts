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
import { authGuard } from './core/guards/auth.guard';
import { AdminComponent } from './features/admin/admin.component';

export const routes: Routes = [
  // Customer Storefront (no auth required)
  { path: '', component: StorefrontLanding },
  { path: 'menu', component: MenuBrowse },
  { path: 'checkout', component: Checkout },
  { path: 'order-confirmation', component: OrderConfirmation },

  // Authentication & Recovery (no auth required)
  { path: 'login', component: Auth },
  { path: 'signup', component: Auth },
  { path: 'merchant/login', redirectTo: 'login' },
  { path: 'merchant/signup', redirectTo: 'signup' },
  { path: 'recover', component: RecoverAccountComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-success', component: ResetSuccessComponent },

  // Merchant Portal (protected by authGuard)
  { path: 'merchant/onboarding', component: Onboarding, canActivate: [authGuard] },
  { path: 'merchant/dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'merchant/menu', component: Menu, canActivate: [authGuard] },
  { path: 'merchant/promotions', component: PromotionsManager, canActivate: [authGuard] },
  { path: 'merchant/order-manager', component: OrderManagerComponent, canActivate: [authGuard] },
  { path: 'merchant/analytics', component: Analytics, canActivate: [authGuard] },

  // Super-Admin (protected by authGuard — role check happens at API level)
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },

  // Catch all
  { path: '**', redirectTo: '' }
];
