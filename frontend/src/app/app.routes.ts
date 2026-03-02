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

export const routes: Routes = [
  // Customer Storefront
  { path: '', component: StorefrontLanding },
  { path: 'menu', component: MenuBrowse },
  { path: 'checkout', component: Checkout },
  { path: 'order-confirmation', component: OrderConfirmation },

  // Authentication & Recovery
  { path: 'merchant/login', component: Auth },
  { path: 'merchant/signup', component: Auth },
  { path: 'recover', component: RecoverAccountComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'reset-success', component: ResetSuccessComponent },

  // Merchant Portal
  { path: 'merchant/onboarding', component: Onboarding },
  { path: 'merchant/dashboard', component: Dashboard },
  { path: 'merchant/menu', component: Menu },
  { path: 'merchant/promotions', component: PromotionsManager },
  { path: 'merchant/order-manager', component: OrderManagerComponent },
  { path: 'merchant/analytics', component: Analytics },

  // Catch all
  { path: '**', redirectTo: '' }
];
