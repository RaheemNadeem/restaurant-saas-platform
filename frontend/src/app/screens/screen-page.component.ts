import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface ScreenSection {
  title: string;
  points: string[];
}

interface ScreenModel {
  title: string;
  subtitle: string;
  status: string;
  actions: string[];
  sections: ScreenSection[];
}

const SCREEN_MODELS: Record<string, ScreenModel> = {
  'merchant-signup': {
    title: 'Owner Signup',
    subtitle: 'Create merchant owner account and workspace',
    status: 'Sprint flow: Merchant Setup',
    actions: ['Create Account', 'Continue with GitHub'],
    sections: [
      { title: 'Identity', points: ['Full name', 'Business email', 'Strong password'] },
      { title: 'Organization', points: ['Workspace name', 'Industry type', 'Country and timezone'] }
    ]
  },
  'merchant-login': {
    title: 'Owner Login',
    subtitle: 'Authenticate and access merchant setup',
    status: 'Sprint flow: Merchant Setup',
    actions: ['Sign In', 'Recover Account'],
    sections: [
      { title: 'Credentials', points: ['Email', 'Password', 'Remember session'] },
      { title: 'Access', points: ['Role guard: Admin', 'Redirect to dashboard'] }
    ]
  },
  'merchant-onboarding': {
    title: 'Owner Onboarding Wizard',
    subtitle: 'Collect operational foundation data',
    status: 'Sprint flow: Onboarding',
    actions: ['Save and Continue', 'Back'],
    sections: [
      { title: 'Business Profile', points: ['Restaurant legal name', 'Contact phone', 'Pickup window defaults'] },
      { title: 'Operational Setup', points: ['Fulfillment mode', 'Order prep defaults', 'Notification preferences'] }
    ]
  },
  'brand-setup': {
    title: 'Brand Setup',
    subtitle: 'Establish visual identity and storefront baseline',
    status: 'Sprint flow: Onboarding',
    actions: ['Upload Logo', 'Apply Theme'],
    sections: [
      { title: 'Brand Core', points: ['Display name', 'Primary/secondary colors', 'Typography pairing'] },
      { title: 'Assets', points: ['Logo variants', 'Hero image', 'Social preview metadata'] }
    ]
  },
  'menu-manager': {
    title: 'Menu Manager',
    subtitle: 'Manage catalog, pricing, and image-rich items',
    status: 'Sprint flow: Onboarding',
    actions: ['Add Item', 'Upload Item Image'],
    sections: [
      { title: 'Catalog Controls', points: ['Items, categories, modifiers', 'Availability toggles', 'Prep time SLA'] },
      { title: 'Media', points: ['Menu item image upload', 'Image preview state', 'Fallback placeholder'] }
    ]
  },
  'payments-setup': {
    title: 'Payments Setup',
    subtitle: 'Configure Stripe Connect and payout readiness',
    status: 'Sprint flow: Onboarding',
    actions: ['Connect Stripe', 'Run Test Charge'],
    sections: [
      { title: 'Compliance', points: ['KYC status', 'Bank account verification', 'Tax profile'] },
      { title: 'Runtime', points: ['Webhook health', 'Retry strategy', 'Error handling state'] }
    ]
  },
  'publish-status': {
    title: 'Storefront Publish Status',
    subtitle: 'Launch readiness gates before going live',
    status: 'Sprint flow: Onboarding',
    actions: ['Re-run Checks', 'Publish Storefront'],
    sections: [
      { title: 'Readiness', points: ['Brand complete', 'Menu complete', 'Payments ready'] },
      { title: 'Blocking Risks', points: ['Missing legal details', 'Disabled payment method', 'Empty required category'] }
    ]
  },
  'owner-dashboard': {
    title: 'Owner Dashboard',
    subtitle: 'Operational KPIs and action center',
    status: 'Sprint flow: Post-Onboarding',
    actions: ['Invite Staff', 'View Analytics'],
    sections: [
      { title: 'KPIs', points: ['Orders today', 'Revenue', 'Avg pickup time'] },
      { title: 'Action Center', points: ['Priority tasks', 'Policy reminders', 'At-risk queue alerts'] }
    ]
  },
  'order-manager': {
    title: 'Order Manager',
    subtitle: 'Track order lifecycle and transitions',
    status: 'Sprint flow: Operations',
    actions: ['Refresh Queue', 'Export CSV'],
    sections: [
      { title: 'Lifecycle', points: ['Created', 'Paid', 'Preparing', 'Ready', 'Completed'] },
      { title: 'Controls', points: ['Transition validation', 'Assigned staff', 'Status timestamping'] }
    ]
  },
  'recover-link-sent': {
    title: 'Recover Account: Link Sent',
    subtitle: 'Confirmation state after requesting recovery',
    status: 'Sprint flow: Account Recovery',
    actions: ['Open Mail', 'Back to Login'],
    sections: [
      { title: 'Message', points: ['Reset link dispatched', 'Check spam folder', 'Link expiry window shown'] },
      { title: 'Safety', points: ['No account leakage', 'Rate-limited resend', 'IP logging'] }
    ]
  },
  'reset-email-received': {
    title: 'Reset Email Received',
    subtitle: 'Mailbox confirmation state',
    status: 'Sprint flow: Account Recovery',
    actions: ['Open Email Template', 'Resend Link'],
    sections: [
      { title: 'Delivery', points: ['Email delivery timestamp', 'Recipient address', 'Fallback instructions'] },
      { title: 'UX', points: ['Single CTA focus', 'Clear next step', 'Support access'] }
    ]
  },
  'reset-email-template': {
    title: 'Reset Password Email Template',
    subtitle: 'HTML mail layout user receives',
    status: 'Sprint flow: Account Recovery',
    actions: ['Preview HTML', 'Copy Safe Link'],
    sections: [
      { title: 'Template Blocks', points: ['Brand header', 'Reset CTA', 'Security notice'] },
      { title: 'Guardrails', points: ['One-time token', 'Expiration notice', 'Ignore-if-not-you copy'] }
    ]
  },
  'reset-password-form': {
    title: 'Reset Password Form',
    subtitle: 'Set a new password from secure link',
    status: 'Sprint flow: Account Recovery',
    actions: ['Update Password', 'Cancel'],
    sections: [
      { title: 'Fields', points: ['New password', 'Confirm password', 'Strength meter'] },
      { title: 'Validation', points: ['Minimum requirements', 'Real-time mismatch state', 'Token validity check'] }
    ]
  },
  'reset-password-weak': {
    title: 'Reset Password: Weak Password',
    subtitle: 'Validation error state for low-strength password',
    status: 'Sprint flow: Account Recovery',
    actions: ['Use Stronger Password', 'Show Requirements'],
    sections: [
      { title: 'Error Copy', points: ['Minimum 8 chars', 'Upper/lower/number', 'Special character recommendation'] },
      { title: 'Assist', points: ['Inline hints', 'Requirement checklist', 'No destructive loss of input'] }
    ]
  },
  'reset-password-mismatch': {
    title: 'Reset Password: Password Mismatch',
    subtitle: 'Validation state when values do not match',
    status: 'Sprint flow: Account Recovery',
    actions: ['Fix Confirmation', 'Show Typed Toggle'],
    sections: [
      { title: 'Error State', points: ['Mismatch message', 'Field highlight', 'Preserve input'] },
      { title: 'Recovery', points: ['Keyboard focus restore', 'Accessible hint text', 'Retry without refresh'] }
    ]
  },
  'reset-password-success': {
    title: 'Reset Password: Success',
    subtitle: 'Password changed confirmation screen',
    status: 'Sprint flow: Account Recovery',
    actions: ['Sign In', 'Go to Dashboard'],
    sections: [
      { title: 'Confirmation', points: ['Password updated', 'Timestamp shown', 'Device/session notice'] },
      { title: 'Post Action', points: ['Redirect to login', 'Session revocation option', 'Support fallback'] }
    ]
  },
  'reset-password-expired': {
    title: 'Reset Password: Link Expired',
    subtitle: 'Expired token state',
    status: 'Sprint flow: Account Recovery',
    actions: ['Request New Link', 'Back to Login'],
    sections: [
      { title: 'Expiration', points: ['Token expired', 'Safety explanation', 'No sensitive leak'] },
      { title: 'Recovery', points: ['Generate new token', 'Rate-limited resend', 'Help center link'] }
    ]
  },
  'staff-login': {
    title: 'Staff Login',
    subtitle: 'Operational access for staff users',
    status: 'Sprint 3',
    actions: ['Sign In', 'Need Access?'],
    sections: [
      { title: 'Auth', points: ['Staff credential validation', 'Session policy', 'Role-aware redirect'] },
      { title: 'Guard', points: ['Staff scope only', 'Unauthorized view block', 'Audit trail'] }
    ]
  },
  'role-access-entry': {
    title: 'Role Access Entry',
    subtitle: 'Admin vs Staff path selection',
    status: 'Sprint 3',
    actions: ['Continue as Admin', 'Continue as Staff'],
    sections: [
      { title: 'Role Split', points: ['Scoped permissions', 'View-level restrictions', 'API guard alignment'] },
      { title: 'UX', points: ['Clear role descriptions', 'Safe default route', 'Permission fallback'] }
    ]
  },
  'staff-onboarding-invite': {
    title: 'Staff Onboarding Invite',
    subtitle: 'Invite team members into operational flow',
    status: 'Sprint 3',
    actions: ['Send Invite', 'Copy Invite Link'],
    sections: [
      { title: 'Invite Setup', points: ['Name and email', 'Role assignment', 'Permission preset'] },
      { title: 'State Handling', points: ['Pending/accepted/expired', 'Resend controls', 'Audit logs'] }
    ]
  },
  'staff-management-auth': {
    title: 'Staff Management & Authorization',
    subtitle: 'Manage roles, permissions, and invites',
    status: 'Sprint 3',
    actions: ['Invite Staff', 'Save Permissions'],
    sections: [
      { title: 'Team List', points: ['Active staff', 'Admins', 'Pending invites'] },
      { title: 'Role Controls', points: ['Role matrix', 'Access logs', 'Reset permissions'] }
    ]
  },
  'staff-order-board': {
    title: 'Staff Order Board',
    subtitle: 'Baseline real-time queue for kitchen/front desk',
    status: 'Sprint 3',
    actions: ['Bump to Ready', 'Mark Picked Up'],
    sections: [
      { title: 'Queue', points: ['Live order feed', 'Status chips', 'ETA visibility'] },
      { title: 'Order Details', points: ['Checklist', 'Priority info', 'Amount and customer'] }
    ]
  },
  'staff-board-advanced': {
    title: 'Staff Board Advanced',
    subtitle: 'Filtering, search, and queue prioritization',
    status: 'Sprint 5',
    actions: ['Reassign', 'Escalate'],
    sections: [
      { title: 'Advanced Controls', points: ['Search by order/customer', 'SLA-risk filters', 'Sort by breach risk'] },
      { title: 'Prioritization', points: ['Critical/at-risk labeling', 'Queue urgency ranking', 'SLA breach countdown'] }
    ]
  },
  storefront: {
    title: 'Customer Storefront Landing',
    subtitle: 'Public ordering entry point',
    status: 'Sprint 3',
    actions: ['Browse Menu', 'Start Pickup Order'],
    sections: [
      { title: 'Discovery', points: ['Hero + value proposition', 'Menu highlights', 'Promotional modules'] },
      { title: 'Trust', points: ['Social proof', 'FAQ', 'Store and pickup context'] }
    ]
  },
  'customer-menu': {
    title: 'Customer Menu Page',
    subtitle: 'Category browse and item selection',
    status: 'Sprint 3',
    actions: ['Add to Cart', 'View Cart'],
    sections: [
      { title: 'Menu Grid', points: ['Category tabs', 'Item cards', 'Image + price + ETA'] },
      { title: 'Cart Integration', points: ['Badge count updates', 'Increment/decrement controls', 'Stateful add flow'] }
    ]
  },
  'menu-search-active': {
    title: 'Customer Menu Search Active',
    subtitle: 'Search and filter state transition',
    status: 'Sprint 3',
    actions: ['Apply Search', 'Reset Filters'],
    sections: [
      { title: 'Search UX', points: ['Focused input state', 'Dynamic results', 'No-result handling'] },
      { title: 'Context', points: ['Category fallback', 'Sort controls', 'Quick clear chips'] }
    ]
  },
  'cart-drawer': {
    title: 'Customer Cart Drawer',
    subtitle: 'Inline order summary before checkout',
    status: 'Sprint 3',
    actions: ['Update Qty', 'Proceed to Checkout'],
    sections: [
      { title: 'Cart Items', points: ['Line item controls', 'Modifiers and notes', 'Running subtotal'] },
      { title: 'Checkout Entry', points: ['Tax/fees total', 'Pickup ETA', 'Primary checkout CTA'] }
    ]
  },
  checkout: {
    title: 'Customer Checkout Details',
    subtitle: 'Contact, pickup, and payment method capture',
    status: 'Sprint 3',
    actions: ['Complete Payment', 'Return to Cart'],
    sections: [
      { title: 'Checkout Form', points: ['Customer identity', 'Pickup slot', 'Billing details'] },
      { title: 'Payment Options', points: ['Card', 'Apple Pay', 'Google Pay', 'Samsung Pay'] }
    ]
  },
  'payment-failed': {
    title: 'Customer Payment Failed',
    subtitle: 'Declined transaction retry flow',
    status: 'Sprint 3',
    actions: ['Retry Payment', 'Use Different Method'],
    sections: [
      { title: 'Failure State', points: ['No charge captured', 'Decline reason surface', 'Recovery steps'] },
      { title: 'Recovery', points: ['Retry secure checkout', 'Change payment method', 'Support path'] }
    ]
  },
  'payment-canceled': {
    title: 'Customer Payment Canceled',
    subtitle: 'User-canceled transaction recovery',
    status: 'Sprint 3',
    actions: ['Resume Checkout', 'Back to Menu'],
    sections: [
      { title: 'Canceled State', points: ['Canceled by user', 'No charge captured', 'Order remains pending'] },
      { title: 'Next Steps', points: ['Resume checkout', 'Confirm payment', 'Return to menu'] }
    ]
  },
  'order-confirmation': {
    title: 'Customer Order Confirmation',
    subtitle: 'Successful order placement and pickup guidance',
    status: 'Sprint 3',
    actions: ['Track Order', 'Download Receipt'],
    sections: [
      { title: 'Confirmation', points: ['Order number + timestamp', 'Progress tracker', 'Pickup instructions'] },
      { title: 'Summary', points: ['Receipt breakdown', 'ETA', 'Post-order actions'] }
    ]
  }
};

@Component({
  selector: 'app-screen-page',
  standalone: true,
  template: `
    <article class="screen-page">
      <header class="hero">
        <p class="status">{{ model().status }}</p>
        <h1>{{ model().title }}</h1>
        <p class="subtitle">{{ model().subtitle }}</p>
      </header>

      <section class="actions">
        @for (action of model().actions; track action; let i = $index) {
          <button [class.secondary]="i > 0">{{ action }}</button>
        }
      </section>

      @if (isMerchantFlow()) {
        <section class="merchant-layout">
          <div class="card card-main">
            @switch (screenKey()) {
              @case ('merchant-signup') {
                <h2>Create merchant workspace</h2>
                <div class="field-row">
                  <div class="field"><label>Owner Name</label><span>Ayesha Rahman</span></div>
                  <div class="field"><label>Business Email</label><span>owner@quickservekitchen.com</span></div>
                </div>
                <div class="field-row">
                  <div class="field"><label>Password</label><span>Minimum 8 chars + symbol</span></div>
                  <div class="field"><label>Workspace Name</label><span>quickserve-downtown</span></div>
                </div>
                <div class="chip-row">
                  <span class="chip">Multi-tenant ready</span>
                  <span class="chip">RBAC bootstrap</span>
                  <span class="chip">Audit logging enabled</span>
                </div>
              }
              @case ('merchant-login') {
                <h2>Merchant access</h2>
                <div class="field-row">
                  <div class="field"><label>Email</label><span>owner@quickservekitchen.com</span></div>
                  <div class="field"><label>Password</label><span>********</span></div>
                </div>
                <div class="chip-row">
                  <span class="chip">Session timeout: 30m</span>
                  <span class="chip">Last login: 2h ago</span>
                </div>
              }
              @case ('merchant-onboarding') {
                <h2>Onboarding progress</h2>
                <div class="progress">
                  <div class="bar"><span style="width: 42%"></span></div>
                  <p>42% complete · next: brand setup</p>
                </div>
                <ul class="step-list">
                  <li class="done">Business profile completed</li>
                  <li class="active">Pickup defaults in progress</li>
                  <li>Brand setup pending</li>
                  <li>Menu import pending</li>
                  <li>Payments verification pending</li>
                </ul>
              }
              @case ('brand-setup') {
                <h2>Brand token setup</h2>
                <div class="field-row">
                  <div class="field"><label>Display Name</label><span>QuickServe Kitchen</span></div>
                  <div class="field"><label>Typography</label><span>Outfit + Inter</span></div>
                </div>
                <div class="field-row">
                  <div class="field"><label>Primary</label><span>#EF4444</span></div>
                  <div class="field"><label>Accent</label><span>#FDBA74</span></div>
                </div>
              }
              @case ('menu-manager') {
                <h2>Menu catalog with media</h2>
                <div class="menu-table">
                  <div class="row head"><span>Item</span><span>Price</span><span>Status</span><span>Image</span></div>
                  <div class="row"><span>Chicken Shawarma Wrap</span><span>$12.90</span><span>Active</span><span>Uploaded</span></div>
                  <div class="row"><span>Falafel Bowl</span><span>$11.50</span><span>Active</span><span>Uploaded</span></div>
                  <div class="row"><span>Mango Lassi</span><span>$4.90</span><span>Unavailable</span><span>Missing</span></div>
                </div>
              }
              @case ('payments-setup') {
                <h2>Payment readiness</h2>
                <div class="kpi-row">
                  <div class="kpi"><strong>Stripe</strong><span>Connected</span></div>
                  <div class="kpi"><strong>KYC</strong><span>Pending</span></div>
                  <div class="kpi"><strong>Webhooks</strong><span>Healthy</span></div>
                </div>
                <ul class="step-list">
                  <li>Bank account verification in review</li>
                  <li>Test charge endpoint available</li>
                  <li>Idempotency key policy enabled</li>
                </ul>
              }
              @case ('publish-status') {
                <h2>Launch gate checks</h2>
                <ul class="step-list">
                  <li class="done">Branding complete</li>
                  <li class="done">Menu has required categories</li>
                  <li class="active">Payments KYC pending</li>
                  <li>Storefront domain verification pending</li>
                </ul>
              }
              @case ('owner-dashboard') {
                <h2>Ops snapshot</h2>
                <div class="kpi-row">
                  <div class="kpi"><strong>128</strong><span>Orders Today</span></div>
                  <div class="kpi"><strong>$4,982</strong><span>Revenue</span></div>
                  <div class="kpi"><strong>17m</strong><span>Avg Pickup</span></div>
                </div>
              }
              @case ('order-manager') {
                <h2>Order lifecycle board</h2>
                <div class="menu-table">
                  <div class="row head"><span>Order</span><span>Status</span><span>Total</span><span>ETA</span></div>
                  <div class="row"><span>#QS-1061</span><span>New</span><span>$9.80</span><span>2m</span></div>
                  <div class="row"><span>#QS-1060</span><span>Preparing</span><span>$41.10</span><span>11m</span></div>
                  <div class="row"><span>#QS-1059</span><span>Ready</span><span>$21.40</span><span>Waiting</span></div>
                </div>
              }
              @default {
                <h2>Merchant screen</h2>
              }
            }
          </div>

          <div class="card card-side">
            <h3>Implementation notes</h3>
            <ul>
              @for (section of model().sections; track section.title) {
                <li>
                  <strong>{{ section.title }}</strong>
                  <p>{{ section.points[0] }}</p>
                </li>
              }
            </ul>
          </div>
        </section>
      } @else if (isRecoveryFlow()) {
        <section class="recovery-layout">
          <div class="card card-main">
            <h2>{{ model().title }}</h2>
            @switch (screenKey()) {
              @case ('recover-link-sent') {
                <p class="muted">We sent a secure recovery link to owner@quickservekitchen.com.</p>
                <ul class="step-list">
                  <li>Check inbox and spam folder</li>
                  <li>Link expires in 20 minutes</li>
                  <li>Use the latest link only</li>
                </ul>
              }
              @case ('reset-email-received') {
                <p class="muted">Email received. Open the message and follow the reset CTA.</p>
                <div class="chip-row">
                  <span class="chip">Delivery: successful</span>
                  <span class="chip">Recipient: owner@quickservekitchen.com</span>
                </div>
              }
              @case ('reset-email-template') {
                <div class="email-preview">
                  <h3>QuickServe Account Security</h3>
                  <p>Use the button below to reset your password. This link expires in 20 minutes.</p>
                  <button>Reset Password</button>
                  <p class="hint">If you did not request this, you can ignore this email.</p>
                </div>
              }
              @case ('reset-password-form') {
                <div class="field-row">
                  <div class="field"><label>New Password</label><span>At least 8 characters</span></div>
                  <div class="field"><label>Confirm Password</label><span>Must match</span></div>
                </div>
              }
              @case ('reset-password-weak') {
                <p class="error">Password is too weak. Use upper/lowercase, number, and symbol.</p>
              }
              @case ('reset-password-mismatch') {
                <p class="error">Passwords do not match. Please re-enter confirmation.</p>
              }
              @case ('reset-password-success') {
                <p class="success">Password updated successfully. You can sign in with the new credentials.</p>
              }
              @case ('reset-password-expired') {
                <p class="error">Reset link expired. Request a new secure link.</p>
              }
            }
          </div>

          <div class="card card-side">
            <h3>Security checklist</h3>
            <ul>
              <li>One-time token validation</li>
              <li>Rate-limited recovery attempts</li>
              <li>Audit event recorded</li>
              <li>No account existence leakage</li>
            </ul>
          </div>
        </section>
      } @else if (isStaffFlow()) {
        <section class="staff-layout">
          <div class="card card-main">
            @switch (screenKey()) {
              @case ('staff-login') {
                <h2>Staff authentication</h2>
                <div class="field-row">
                  <div class="field"><label>Staff Email</label><span>staff@quickservekitchen.com</span></div>
                  <div class="field"><label>Password</label><span>********</span></div>
                </div>
              }
              @case ('role-access-entry') {
                <h2>Access role routing</h2>
                <div class="chip-row">
                  <span class="chip">Admin: full controls</span>
                  <span class="chip">Staff: operational only</span>
                </div>
              }
              @case ('staff-onboarding-invite') {
                <h2>Invite team member</h2>
                <div class="field-row">
                  <div class="field"><label>Name</label><span>Noah Patel</span></div>
                  <div class="field"><label>Email</label><span>noah@quickservekitchen.com</span></div>
                </div>
                <div class="field-row">
                  <div class="field"><label>Role</label><span>Kitchen Lead</span></div>
                  <div class="field"><label>Status</label><span>Pending Invite</span></div>
                </div>
              }
              @case ('staff-management-auth') {
                <h2>Staff authorization matrix</h2>
                <div class="table">
                  <div class="table-row head"><span>Name</span><span>Role</span><span>Status</span><span>Last Active</span></div>
                  <div class="table-row"><span>Ava Johnson</span><span>Admin</span><span>Active</span><span>5m ago</span></div>
                  <div class="table-row"><span>Noah Patel</span><span>Staff</span><span>Active</span><span>2m ago</span></div>
                  <div class="table-row"><span>Mia Chen</span><span>Staff</span><span>Pending</span><span>Invite sent</span></div>
                </div>
              }
              @case ('staff-order-board') {
                <h2>Live order board</h2>
                <div class="table">
                  <div class="table-row head"><span>Order</span><span>Status</span><span>Total</span><span>ETA</span></div>
                  <div class="table-row"><span>#QS-1061</span><span>New</span><span>$9.80</span><span>2m</span></div>
                  <div class="table-row"><span>#QS-1060</span><span>Preparing</span><span>$41.10</span><span>11m</span></div>
                  <div class="table-row"><span>#QS-1059</span><span>Ready</span><span>$21.40</span><span>Waiting</span></div>
                </div>
              }
              @case ('staff-board-advanced') {
                <h2>Advanced queue prioritization</h2>
                <div class="chip-row">
                  <span class="chip">Sort: SLA Risk</span>
                  <span class="chip">Filter: Unassigned</span>
                  <span class="chip">Search: active</span>
                </div>
                <div class="table">
                  <div class="table-row head"><span>Order</span><span>Priority</span><span>Risk</span><span>Action</span></div>
                  <div class="table-row"><span>#QS-1060</span><span>Critical</span><span>3m breach</span><span>Escalate</span></div>
                  <div class="table-row"><span>#QS-1061</span><span>At Risk</span><span>5m breach</span><span>Reassign</span></div>
                </div>
              }
            }
          </div>
          <div class="card card-side">
            <h3>Ops safeguards</h3>
            <ul>
              <li>Route + API role guards synced</li>
              <li>Transition validation on server source of truth</li>
              <li>Realtime queue updates with safe fallbacks</li>
            </ul>
          </div>
        </section>
      } @else if (isCustomerFlow()) {
        <section class="customer-layout">
          <div class="card card-main">
            @switch (screenKey()) {
              @case ('storefront') {
                <h2>Storefront landing</h2>
                <p class="muted">Hero, menu highlights, social proof, and pickup-focused CTA.</p>
                <div class="chip-row">
                  <span class="chip">Pickup ETA visible</span>
                  <span class="chip">Promo banner active</span>
                </div>
              }
              @case ('customer-menu') {
                <h2>Menu catalog + cart state</h2>
                <div class="table">
                  <div class="table-row head"><span>Item</span><span>Price</span><span>ETA</span><span>Cart</span></div>
                  <div class="table-row"><span>Chicken Shawarma Wrap</span><span>$12.90</span><span>12m</span><span>Add</span></div>
                  <div class="table-row"><span>Falafel Bowl</span><span>$11.50</span><span>10m</span><span>+/-</span></div>
                </div>
              }
              @case ('menu-search-active') {
                <h2>Search active state</h2>
                <div class="chip-row">
                  <span class="chip">Query: shawarma</span>
                  <span class="chip">Results: 4</span>
                </div>
              }
              @case ('cart-drawer') {
                <h2>Cart drawer</h2>
                <div class="table">
                  <div class="table-row head"><span>Item</span><span>Qty</span><span>Price</span><span>Total</span></div>
                  <div class="table-row"><span>Shawarma Wrap</span><span>1</span><span>$12.90</span><span>$12.90</span></div>
                  <div class="table-row"><span>Fries</span><span>2</span><span>$4.25</span><span>$8.50</span></div>
                </div>
              }
              @case ('checkout') {
                <h2>Checkout details + payment methods</h2>
                <div class="chip-row">
                  <span class="chip">Card</span>
                  <span class="chip">Apple Pay</span>
                  <span class="chip">Google Pay</span>
                  <span class="chip">Samsung Pay</span>
                </div>
              }
              @case ('payment-failed') {
                <h2>Payment failed recovery</h2>
                <p class="error">Card declined. No charge captured.</p>
              }
              @case ('payment-canceled') {
                <h2>Payment canceled recovery</h2>
                <p class="muted">Canceled by user. Resume checkout to complete order.</p>
              }
              @case ('order-confirmation') {
                <h2>Order confirmation</h2>
                <div class="kpi-row">
                  <div class="kpi"><strong>#QS-1062</strong><span>Order ID</span></div>
                  <div class="kpi"><strong>6:35 PM</strong><span>Pickup ETA</span></div>
                  <div class="kpi"><strong>$31.64</strong><span>Total</span></div>
                </div>
              }
            }
          </div>
          <div class="card card-side">
            <h3>Customer UX checklist</h3>
            <ul>
              <li>Cart badge and quantity controls stay synchronized</li>
              <li>Checkout + payment states show deterministic recovery</li>
              <li>Order confirmation includes ETA and receipt action</li>
            </ul>
          </div>
        </section>
      } @else {
        <section class="grid">
          @for (section of model().sections; track section.title) {
            <div class="card">
              <h2>{{ section.title }}</h2>
              <ul>
                @for (point of section.points; track point) {
                  <li>{{ point }}</li>
                }
              </ul>
            </div>
          }
        </section>
      }
    </article>
  `,
  styles: `
    .screen-page {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 24px;
      min-height: calc(100vh - 40px);
    }

    .hero h1 {
      margin: 6px 0;
      font-size: clamp(1.4rem, 3vw, 2rem);
    }

    .status {
      margin: 0;
      color: #9a3412;
      font-weight: 700;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .subtitle {
      margin: 0;
      color: #4b5563;
      max-width: 60ch;
    }

    .actions {
      margin-top: 18px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .actions button {
      border: 0;
      border-radius: 10px;
      background: var(--brand-primary);
      color: #fff;
      padding: 10px 14px;
      font-weight: 700;
      cursor: pointer;
    }

    .actions .secondary {
      background: #ffffff;
      color: #9a3412;
      border: 1px solid #fdba74;
    }

    .merchant-layout {
      margin-top: 18px;
      display: grid;
      gap: 12px;
      grid-template-columns: 2fr 1fr;
    }

    .card-main h2 {
      margin: 0 0 12px;
      font-size: 1.1rem;
    }

    .card-side h3 {
      margin: 0 0 10px;
      font-size: 1rem;
    }

    .recovery-layout {
      margin-top: 18px;
      display: grid;
      gap: 12px;
      grid-template-columns: 1.6fr 1fr;
    }

    .staff-layout,
    .customer-layout {
      margin-top: 18px;
      display: grid;
      gap: 12px;
      grid-template-columns: 1.8fr 1fr;
    }

    .muted {
      color: #4b5563;
    }

    .hint {
      color: #6b7280;
      font-size: 0.85rem;
    }

    .error {
      color: #991b1b;
      border: 1px solid #fca5a5;
      background: #fef2f2;
      border-radius: 10px;
      padding: 10px 12px;
      font-weight: 700;
    }

    .success {
      color: #065f46;
      border: 1px solid #86efac;
      background: #ecfdf3;
      border-radius: 10px;
      padding: 10px 12px;
      font-weight: 700;
    }

    .email-preview {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      background: #f9fafb;
      padding: 14px;
      display: grid;
      gap: 10px;
    }

    .email-preview h3 {
      margin: 0;
      font-size: 1rem;
    }

    .email-preview p {
      margin: 0;
      color: #374151;
    }

    .email-preview button {
      border: 0;
      border-radius: 10px;
      background: var(--brand-primary);
      color: #fff;
      font-weight: 700;
      padding: 10px 12px;
      width: fit-content;
      cursor: pointer;
    }

    .card-side ul {
      margin: 0;
      padding-left: 18px;
      display: grid;
      gap: 10px;
    }

    .card-side p {
      margin: 4px 0 0;
      color: #4b5563;
    }

    .field-row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 10px;
    }

    .field {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      background: #fff;
      padding: 10px;
      display: grid;
      gap: 4px;
    }

    .field label {
      font-size: 0.78rem;
      color: #6b7280;
      font-weight: 700;
    }

    .field span {
      font-weight: 600;
      color: #111827;
      overflow-wrap: anywhere;
    }

    .chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .chip {
      border: 1px solid #fed7aa;
      background: #fff7ed;
      color: #9a3412;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .progress p {
      margin: 8px 0 0;
      color: #4b5563;
      font-size: 0.86rem;
    }

    .bar {
      width: 100%;
      height: 10px;
      border-radius: 999px;
      background: #e5e7eb;
      overflow: hidden;
    }

    .bar span {
      display: block;
      height: 100%;
      background: var(--brand-primary);
    }

    .step-list {
      margin: 0;
      padding-left: 18px;
      display: grid;
      gap: 8px;
    }

    .step-list li {
      color: #374151;
      overflow-wrap: anywhere;
    }

    .step-list li.done {
      color: #065f46;
      font-weight: 700;
    }

    .step-list li.active {
      color: #9a3412;
      font-weight: 700;
    }

    .menu-table {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
    }

    .table {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
    }

    .table-row {
      display: grid;
      grid-template-columns: 1.8fr 1fr 1fr 1fr;
      gap: 8px;
      padding: 10px 12px;
      border-top: 1px solid #f1f5f9;
      align-items: center;
      font-size: 0.86rem;
      overflow-wrap: anywhere;
    }

    .table-row.head {
      border-top: 0;
      background: #f9fafb;
      font-weight: 800;
      color: #374151;
    }

    .row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 8px;
      padding: 10px 12px;
      border-top: 1px solid #f1f5f9;
      align-items: center;
      font-size: 0.88rem;
    }

    .row.head {
      border-top: 0;
      background: #f9fafb;
      font-weight: 800;
      color: #374151;
    }

    .kpi-row {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    .kpi {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      background: #fff;
      padding: 10px;
      display: grid;
      gap: 4px;
    }

    .kpi strong {
      font-size: 1.05rem;
    }

    .kpi span {
      color: #4b5563;
      font-size: 0.85rem;
    }

    .grid {
      margin-top: 18px;
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 14px;
    }

    .card h2 {
      margin: 0 0 10px;
      font-size: 1rem;
    }

    .card ul {
      margin: 0;
      padding-left: 18px;
      display: grid;
      gap: 8px;
    }

    @media (max-width: 900px) {
      .screen-page {
        padding: 16px;
      }

      .merchant-layout {
        grid-template-columns: 1fr;
      }

      .recovery-layout {
        grid-template-columns: 1fr;
      }

      .staff-layout,
      .customer-layout {
        grid-template-columns: 1fr;
      }

      .field-row {
        grid-template-columns: 1fr;
      }

      .kpi-row {
        grid-template-columns: 1fr;
      }

      .row {
        grid-template-columns: 1.6fr 1fr 1fr 1fr;
        font-size: 0.8rem;
      }

      .table-row {
        grid-template-columns: 1.6fr 1fr 1fr 1fr;
        font-size: 0.78rem;
      }

      .grid {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class ScreenPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly screenKey = computed(() => {
    const key = this.route.snapshot.data['screenKey'] as string | undefined;
    return key ?? 'merchant-signup';
  });

  readonly model = computed(() => {
    return SCREEN_MODELS[this.screenKey()] ?? SCREEN_MODELS['merchant-signup'];
  });

  readonly isMerchantFlow = computed(() =>
    [
      'merchant-signup',
      'merchant-login',
      'merchant-onboarding',
      'brand-setup',
      'menu-manager',
      'payments-setup',
      'publish-status',
      'owner-dashboard',
      'order-manager'
    ].includes(this.screenKey())
  );

  readonly isRecoveryFlow = computed(() =>
    [
      'recover-link-sent',
      'reset-email-received',
      'reset-email-template',
      'reset-password-form',
      'reset-password-weak',
      'reset-password-mismatch',
      'reset-password-success',
      'reset-password-expired'
    ].includes(this.screenKey())
  );

  readonly isStaffFlow = computed(() =>
    [
      'staff-login',
      'role-access-entry',
      'staff-onboarding-invite',
      'staff-management-auth',
      'staff-order-board',
      'staff-board-advanced'
    ].includes(this.screenKey())
  );

  readonly isCustomerFlow = computed(() =>
    [
      'storefront',
      'customer-menu',
      'menu-search-active',
      'cart-drawer',
      'checkout',
      'payment-failed',
      'payment-canceled',
      'order-confirmation'
    ].includes(this.screenKey())
  );
}
