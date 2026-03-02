import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  label: string;
  path: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly navGroups: NavGroup[] = [
    {
      title: 'Merchant Setup',
      items: [
        { label: 'Owner Signup', path: '/merchant/signup' },
        { label: 'Owner Login', path: '/merchant/login' },
        { label: 'Onboarding Wizard', path: '/merchant/onboarding' },
        { label: 'Brand Setup', path: '/merchant/brand-setup' },
        { label: 'Menu Manager', path: '/merchant/menu-manager' },
        { label: 'Payments Setup', path: '/merchant/payments-setup' },
        { label: 'Publish Status', path: '/merchant/publish-status' },
        { label: 'Owner Dashboard', path: '/merchant/dashboard' },
        { label: 'Order Manager', path: '/merchant/order-manager' },
        { label: 'Store Analytics', path: '/merchant/analytics' }
      ]
    },
    {
      title: 'Recovery',
      items: [
        { label: 'Recover Link Sent', path: '/account/recover-link-sent' },
        { label: 'Reset Email Received', path: '/account/reset-email-received' },
        { label: 'Reset Email Template', path: '/account/reset-email-template' },
        { label: 'Reset Form', path: '/account/reset-password-form' },
        { label: 'Weak Password', path: '/account/reset-password-weak' },
        { label: 'Password Mismatch', path: '/account/reset-password-mismatch' },
        { label: 'Reset Success', path: '/account/reset-password-success' },
        { label: 'Link Expired', path: '/account/reset-password-expired' }
      ]
    },
    {
      title: 'Customer Journey',
      items: [
        { label: 'Storefront Landing', path: '/customer/storefront' },
        { label: 'Menu Page', path: '/customer/menu' },
        { label: 'Menu Search Active', path: '/customer/menu-search-active' },
        { label: 'Cart Drawer', path: '/customer/cart-drawer' },
        { label: 'Checkout Details', path: '/customer/checkout' },
        { label: 'Payment Failed', path: '/customer/payment-failed' },
        { label: 'Payment Canceled', path: '/customer/payment-canceled' },
        { label: 'Order Confirmation', path: '/customer/order-confirmation' }
      ]
    },
    {
      title: 'Staff',
      items: [
        { label: 'Staff Login', path: '/staff/login' },
        { label: 'Role Access Entry', path: '/staff/role-access-entry' },
        { label: 'Onboarding Invite', path: '/staff/onboarding-invite' },
        { label: 'Staff Management', path: '/staff/management-auth' },
        { label: 'Staff Order Board', path: '/staff/order-board' },
        { label: 'Board Advanced', path: '/staff/board-advanced' }
      ]
    }
  ];
}
