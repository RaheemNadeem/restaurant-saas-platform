# Sprint 6 Plan (2 weeks)

## Goal
Expand growth and merchant-business tooling: promotions baseline, customer engagement hooks, and analytics maturity.

## Objectives
1. Launch promotions/coupons baseline for checkout
2. Add customer communication events (order confirmations/status updates)
3. Build conversion funnel and retention analytics views
4. Improve admin visibility across tenant performance

## Scope (Committed)
### Growth Features
- Coupon model: fixed/percent discount with constraints (expiry, usage limits)
- Checkout integration for promo code validation and discount application
- Promotion performance metrics (usage, conversion impact)

### Customer Engagement
- Event templates for order created/paid/ready/completed
- Notification pipeline abstraction (email/SMS adapter-ready)
- Delivery status logging for communication events

### Analytics / Admin
- Funnel metrics: storefront views -> cart -> checkout start -> payment success
- Tenant health overview: revenue, failed payments, cancellation rates
- Export-ready reporting endpoints for weekly business review

## Out of Scope
- Full CRM lifecycle automation
- AI recommendation engine
- Multi-channel marketing orchestration

## Definition of Done
- Promo codes apply correctly with edge-case validation
- Customer notification events fire for core order lifecycle stages
- Funnel and tenant KPI dashboards available for review
- Data definitions are documented and reproducible

## Suggested Issues
- Promotions and coupon engine baseline
- Notification event pipeline + templates
- Funnel analytics dashboards + reporting endpoints
- Tenant health admin panel metrics

## Acceptance Metrics
- Promo calculation parity in API + UI (no mismatch defects)
- Notification delivery events logged for 95%+ test flows
- Funnel dashboard reflects end-to-end test traffic accurately
