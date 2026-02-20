# Backend (Sprint 1 Skeleton)

## Structure
- `src/Api` minimal API shell
- `src/Api/Modules/*` module boundaries
- `tests/Api.IntegrationTests` tenant isolation tests

## Current Scope
- Health endpoint (`/health`)
- Tenant context via `X-Tenant-Id`
- Menu endpoint with tenant-filtered in-memory store

## Next
- Replace in-memory repository with PostgreSQL + EF Core
- Apply `infra/postgres/001_tenant_rls_baseline.sql`
- Add tenant-aware DbContext and migrations
