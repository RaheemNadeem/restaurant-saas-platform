# Sprint 2 Plan (2 weeks)

## Goal
Ship a DB-backed, tenant-safe merchant core that is demo-ready for real onboarding + menu management flows.

## Why Sprint 2
Sprint 1 established shell architecture, API draft, and tenant-isolation baseline. Sprint 2 converts that foundation into a working backend + frontend integration slice.

## Sprint Outcomes
1. PostgreSQL-backed menu module (replace in-memory store)
2. Tenant isolation hardening with executable verification
3. Merchant onboarding flow connected to backend contracts
4. Stable menu CRUD UX in Angular with API integration
5. Updated API contract/docs + demo evidence for handoff

## Scope (Committed)
### Backend
- Implement EF Core + PostgreSQL for menu entities
- Apply and validate `infra/postgres/001_tenant_rls_baseline.sql`
- Enforce tenant context on all menu operations (`X-Tenant-Id`)
- Add integration tests for cross-tenant read/write denial

### Frontend
- Connect `/menu` page to real API endpoints (`GET/POST/PUT /api/menu/items`)
- Add basic form validation and error states
- Ensure responsive behavior follows `docs/RESPONSIVE_STANDARDS.md`
- Wire onboarding completion path into dashboard/menu workflow

### Docs / Contracts
- Align `docs/api/openapi-v1.yaml` with implemented behavior
- Add sample request/response payloads for frontend + QA
- Update demo script for DB-backed tenant-isolated run

## Out of Scope
- Full public checkout/payment execution
- Stripe Connect production onboarding flow
- Realtime staff board full implementation
- Loyalty/promotions

## Linked Issues (Execution Map)
- #9 PostgreSQL schema baseline + tenant_id conventions
- #10 Enforce PostgreSQL Row-Level Security (RLS)
- #2 Implement tenant isolation baseline (tenant_id + PostgreSQL RLS)
- #3 Angular shell architecture (apps/libs + routing) — integration continuation

## Definition of Done
- Menu API reads/writes run against PostgreSQL (not in-memory)
- Tenant leakage tests pass (cross-tenant access blocked)
- Angular menu screen fully functional against API
- API spec + docs updated and consistent with runtime behavior
- Demo script runs end-to-end on local dev stack

## Demo Script (End of Sprint)
1. Start backend with Postgres connection
2. Start frontend
3. Create menu item under `tenant-a`
4. Verify item is not visible under `tenant-b`
5. Update item under correct tenant and verify persistence
6. Show responsive QA snapshots (mobile + tablet + desktop widths)

## Risks
1. RLS policy misconfiguration causing false positives/negatives
2. Contract drift between Angular models and API payloads
3. Scope creep into checkout/payments before core hardening is complete

## Mitigations
- Gate merges on integration tests for tenant boundaries
- Treat OpenAPI as source-of-truth for FE/BE contracts
- Freeze Sprint 2 to onboarding + menu core only

## Suggested Day-by-Day Breakdown
### Days 1-2
- DB schema + EF Core model + migrations baseline

### Days 3-4
- Menu repository/service API migration from in-memory to Postgres

### Days 5-6
- Tenant isolation + RLS policy verification tests

### Days 7-8
- Angular menu API integration + validation/error UX

### Days 9-10
- Docs sync, demo run-through, bug fixes, release readiness

## Acceptance Metrics
- 0 tenant-leakage test failures
- <2s p95 response for menu list/create in local benchmark
- 100% of `/menu` basic CRUD path demonstrated in sprint demo
- No responsive regressions at required test widths
