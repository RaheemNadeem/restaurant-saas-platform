# Restaurant SaaS — End-to-End Order Lifecycle Flow

Last updated: 2026-02-28

Purpose: explain how a restaurant admin onboards, onboards staff, and how a customer places and picks up an order.

---

## Swimlane View (Admin / Staff / Customer / System)

```text
Admin (Restaurant)         Staff                   Customer                  System
-------------------        -------------------     -------------------       ------------------------------
Sign up / Login                                                              Create tenant + admin account
Complete onboarding                                                         Save business profile/branding
Set menu + pricing                                                          Persist menu and publish storefront
Configure payments                                                          Link payment setup (sandbox/live)
Invite staff members                                                        Create invite token / invitation
                           Accept invite                                   Verify invite + create staff account
                           Staff login                                     Authenticate staff + issue session
                           (RBAC enforced)                                Restrict staff to permitted scopes

                                                     Browse storefront      Serve tenant-scoped menu
                                                     Add items to cart      Validate availability/pricing
                                                     Checkout + pay         Create PaymentIntent
                                                                            Confirm payment
                                                                            Create order (Paid)
                           See order on staff board                         Push realtime order event
                           Mark Preparing                                  Validate transition + audit log
                           Mark Ready for Pickup                           Push status update
                                                     Arrive for pickup      Show order-ready status
                           Verify order + handoff                          Mark Completed + audit log
```

---

## 1) Restaurant Onboarding (Admin)

### Inputs
- Restaurant owner details
- Business profile (name, logo, branding)
- Menu items, categories, prices
- Payment setup details

### Core Steps
1. Admin account creation and login
2. Merchant onboarding wizard completion
3. Menu/catalog setup
4. Storefront publish
5. Payment capability setup

### Outputs
- Active tenant (restaurant workspace)
- Admin user with full privileges
- Published storefront with menu
- Payment flow enabled for order capture

---

## 2) Staff Onboarding + Authorization

### Inputs
- Staff invite initiated by Admin
- Staff profile and credentials
- Role assignment (e.g., staff/manager)

### Core Steps
1. Admin invites staff from staff management area
2. Staff accepts invite and creates account
3. Staff logs in via staff login
4. System applies role-based access control (RBAC)

### Authorization Boundaries
- **Admin**: billing/settings/staff management/full catalog control
- **Staff**: operational order board and permitted workflow actions only
- **System**: enforces role checks at route + API levels

### Outputs
- Staff accounts activated
- Least-privilege access model in place

---

## 3) Customer Order Creation

### Inputs
- Menu selections
- Checkout details (contact/pickup info)
- Payment method

### Core Steps
1. Customer browses storefront
2. Adds items to cart
3. Starts checkout
4. Payment authorized/captured
5. Order record created

### System Behavior
- Tenant-scoped menu resolution
- Price/availability validation
- Payment intent creation and confirmation
- Idempotency protection to prevent duplicate order creation

### Outputs
- Confirmed order in `Paid`/created state
- Order visible to staff operations board

---

## 4) Fulfillment + Pickup

### Typical Order State Path
`Created/Paid -> Preparing -> Ready for Pickup -> Completed`

### Core Steps
1. Staff receives order in realtime board
2. Staff updates status as work progresses
3. Customer sees readiness state / receives notifications (when enabled)
4. Customer arrives for pickup
5. Staff verifies and hands off order
6. Staff marks order completed

### Outputs
- Successful handoff
- Completed lifecycle with audit trail
- Data available for ops/analytics reporting

---

## 5) Guardrails and Reliability Controls

- Route/API role authorization checks (Admin vs Staff)
- Order transition guards (reject invalid state jumps)
- Payment callback retry safety (idempotency)
- Audit logging for critical actions (payment/order/status)
- Realtime updates for operations visibility

---

## 6) Happy-Path Demo Script

1. Admin logs in and completes merchant onboarding
2. Admin creates menu item(s)
3. Admin invites staff; staff accepts and logs in
4. Verify staff cannot access admin-only sections
5. Customer places paid order from storefront
6. Staff marks `Preparing` then `Ready for Pickup`
7. Customer picks up order
8. Staff marks `Completed`
9. Verify audit trail and final status

---

## 7) References

- `docs/prds/PRD-001-merchant-onboarding-and-storefront-mvp.md`
- `docs/prds/SPRINT-3-PLAN.md`
- `docs/UI-SCREENS-MASTER.md`
