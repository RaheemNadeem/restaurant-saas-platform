# Sprint 5 Plan (2 weeks)

## Goal
Scale merchant operations capabilities: catalog quality, fulfillment operations, and reliability guardrails for growing order volume.

## Objectives
1. Complete robust menu/catalog management (categories, availability windows, modifiers baseline)
2. Strengthen order operations tooling for merchants/staff
3. Add reliability controls (timeouts, retries, dead-letter/error handling)
4. Introduce operational dashboards for merchant health

## Scope (Committed)
### Product / UX
- Menu enhancements: categories, item availability, sold-out toggle, basic modifiers
- Staff board improvements: filtering, search, queue prioritization, status timestamps
- Merchant dashboard widgets: order volume, completion rate, cancellation trend

### Backend / Platform
- Expand order APIs for operational filters and pagination
- Add background job retry policy + failure logging conventions
- Add audit trail entries for order/status/payment events
- Harden webhook handling and error recovery paths

### Quality / Documentation
- Integration tests for menu availability and modifier logic
- Ops runbook update for common incident patterns
- API docs alignment for new catalog/ops endpoints

## Out of Scope
- Advanced loyalty/referral programs
- Multi-brand white-label customization
- Predictive demand forecasting

## Definition of Done
- Merchant can manage richer catalog states without breaking checkout
- Staff can operate high-volume queues with filter/search support
- Operational metrics visible from dashboard baseline
- Retry/failure patterns are observable and documented

## Suggested Issues
- Catalog enhancements (availability + modifiers)
- Staff board operational UX improvements
- Order ops API filters + pagination
- Audit trail + reliability policy hardening

## Acceptance Metrics
- <1% order processing failures caused by transient errors in test runs
- 100% status changes write audit events
- Operational dashboard data consistent with API counts
