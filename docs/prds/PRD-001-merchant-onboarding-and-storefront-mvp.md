# PRD-001: Merchant Onboarding + Branded Storefront MVP

## Problem
Restaurants need to launch a branded ordering page quickly without custom engineering.

## Goals
- Merchant can onboard and publish storefront in < 30 minutes
- Accept first paid order end-to-end
- Staff can view and update order status in realtime

## In Scope
- Tenant onboarding
- Brand setup (name/logo/theme)
- Menu CRUD
- Public storefront + checkout
- Stripe Connect onboarding + payment processing
- Staff order board + SignalR updates

## Out of Scope
- Loyalty
- Advanced promotions
- Multi-location inventory sync

## Success Metrics
- Activation: % merchants with first paid order in 7 days
- Checkout conversion
- Payment success rate
- P95 API latency for checkout path

## Risks
- Stripe onboarding drop-off
- Tenant-isolation mistakes
- Inconsistent order/payment states

## Dependencies
- Auth + RBAC baseline
- Tenant isolation with PostgreSQL RLS
- Outbox + idempotency
