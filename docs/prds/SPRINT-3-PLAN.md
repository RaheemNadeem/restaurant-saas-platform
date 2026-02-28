# Sprint 3 Plan (2 weeks)

## Goal
Deliver end-to-end order checkout and payment flow with reliable order-state handling for merchant operations.

## Why Sprint 3
After Sprint 2 hardens tenant-safe onboarding + menu core, Sprint 3 unlocks business value by enabling paid orders and operational tracking.

## Sprint Outcomes
1. Public storefront -> checkout journey is functional
2. Stripe Connect + PaymentIntent flow integrated (sandbox)
3. Order lifecycle state machine implemented with transition guards
4. Staff board receives near-realtime order updates via SignalR baseline
5. Payment/order consistency safeguards added (idempotency + retry handling)

## Scope (Committed)
### Checkout + Storefront
- Build storefront product listing from tenant menu API
- Implement cart + checkout form baseline
- Validate totals, currency formatting, and checkout input constraints

### Payments (Stripe)
- Integrate Stripe Connect onboarding checkpoints (sandbox)
- Create PaymentIntent server-side with tenant/store context
- Handle payment success/failure/cancel callbacks
- Add idempotency key strategy for payment/order endpoints

### Order Domain + Realtime
- Implement order state machine (e.g., Created -> Paid -> Preparing -> Ready -> Completed; Cancelled paths)
- Enforce allowed transitions server-side
- Publish order status updates to staff clients via SignalR

### Quality + Docs
- Add integration tests for payment/order consistency paths
- Add failure-mode tests (duplicate callback, timeout/retry, partial failure)
- Update API contracts and demo documentation

## Out of Scope
- Advanced promotions/coupons
- Loyalty points and referrals
- Multi-location inventory synchronization
- Production-grade observability expansion (basic logs only this sprint)

## Linked Issues (Execution Map)
- #4 Stripe Connect onboarding + payment intent flow
- #5 Order lifecycle state machine + SignalR updates
- Follow-up issue creation recommended: "Storefront + checkout UI integration"

## Definition of Done
- Sandbox paid order can be completed end-to-end
- Duplicate payment callback does not create duplicate orders
- Order transitions are validated and reject invalid state jumps
- Staff board reflects status changes in near-realtime
- API docs match implemented checkout/payment/order behavior

## Demo Script (End of Sprint)
1. Merchant has published menu from prior sprint
2. Customer adds items on storefront and proceeds to checkout
3. PaymentIntent created and completed in sandbox
4. Order appears on staff board and transitions through statuses
5. Show failure/retry case and confirm no duplicate order creation

## Risks
1. Payment/order race conditions causing inconsistent states
2. Stripe webhook/callback handling complexity
3. Realtime update drift between API and staff board state

## Mitigations
- Enforce idempotency keys and unique constraints where relevant
- Treat server as source-of-truth for order status
- Add deterministic transition validator + integration tests

## Suggested Day-by-Day Breakdown
### Days 1-2
- Checkout domain/API contract finalization + data model updates

### Days 3-4
- Stripe PaymentIntent integration + callback handler skeleton

### Days 5-6
- Order state machine + transition guard implementation

### Days 7-8
- Staff board SignalR updates + UI state sync

### Days 9-10
- Hardening tests, failure-path validation, docs + demo readiness

## Acceptance Metrics
- 100% successful sandbox flow for happy-path paid order demo
- 0 duplicate orders under webhook retry simulation
- Invalid transition attempts correctly rejected (100% in tests)
- Staff board update visible within acceptable demo latency
