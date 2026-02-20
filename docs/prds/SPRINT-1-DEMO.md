# Sprint 1 Demo Script

## Goal
Show navigable MVP shell + tenant-isolation API baseline.

## Steps
1. Start frontend:
   - `cd frontend && npm install && npm run start`
2. Navigate through routes:
   - `/auth` -> `/onboarding` -> `/dashboard` -> `/menu`
3. Start backend (CI/runtime with .NET SDK):
   - `dotnet run --project backend/src/Api/Api.csproj`
4. Verify tenant-scoped API behavior:
   - POST `/api/menu/items` with `X-Tenant-Id: tenant-a`
   - POST `/api/menu/items` with `X-Tenant-Id: tenant-b`
   - GET `/api/menu/items` with each tenant header and confirm isolation

## Evidence
- Integration tests: `backend/tests/Api.IntegrationTests/TenantIsolationTests.cs`
- RLS baseline SQL: `infra/postgres/001_tenant_rls_baseline.sql`

## Weekly Status Reporting
Use: `docs/status/WEEKLY-STATUS-TEMPLATE.md`

Recommended cadence:
- Monday: sprint scope + goals check
- Wednesday: risk and blocker check
- Friday: demo readiness and KPI review
