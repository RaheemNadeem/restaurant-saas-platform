# Sprint 1 Plan (2 weeks)

## Goal
Establish production-grade foundations for multi-tenant restaurant SaaS.

## Sprint Outcomes
1. Backend modular skeleton in .NET 8 with clean module boundaries
2. Tenant isolation baseline (tenant_id + PostgreSQL RLS + tests)
3. Angular workspace shell with domain libs + lazy routes
4. CI quality gates active for PR workflow
5. Demo: merchant onboarding skeleton + menu module stubs

## Scope (Committed)
- Architecture skeleton (backend/frontend)
- Security baseline (tenant isolation)
- Dev workflow enforcement
- Initial API contracts and migration baseline

## Out of Scope
- Full checkout/payment flow (Sprint 2)
- Realtime order board (Sprint 2)

## Definition of Done
- Code merged via PRs (no direct push)
- CI passes
- Tenant isolation tests pass
- Demo script recorded/run

## Risks
- RLS misconfiguration
- Over-scoping frontend polish too early

## Mitigations
- Add integration tests for cross-tenant access
- Keep frontend to shell + module stubs only
