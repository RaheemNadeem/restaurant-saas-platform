# UI Screens Master List

Last updated: 2026-02-28
Purpose: single source of truth for all UI screens across implemented and planned sprints.

## Status Legend
- **Implemented**: code/route exists now
- **Planned**: defined in PRD/sprint docs, not fully implemented yet
- **Future**: roadmap-level screens for scale/enterprise maturity

---

## 1) Core App Screens

### 1.1 Authentication
- **Auth / Login** — `/auth` — **Implemented**

### 1.2 Onboarding
- **Merchant Onboarding** — `/onboarding` — **Implemented**

### 1.3 Dashboard
- **Merchant Dashboard (base)** — `/dashboard` — **Implemented**
- **Merchant Dashboard (ops KPIs/widgets expanded)** — **Planned** (Sprint 5+)

### 1.4 Menu / Catalog
- **Menu Management (base)** — `/menu` — **Implemented**
- **Catalog Management Advanced** (categories, availability windows, sold-out toggle, modifiers) — **Planned** (Sprint 5)

---

## 2) Commerce Experience

### 2.1 Public Ordering
- **Public Storefront** — **Planned** (Sprint 3)
- **Cart** — **Planned** (Sprint 3)
- **Checkout** — **Planned** (Sprint 3)
- **Payment Status/Result states** — **Planned** (Sprint 3)

### 2.2 Promotions / Growth
- **Promo/Coupon Management** — **Planned** (Sprint 6)
- **Checkout Promo Validation UX** — **Planned** (Sprint 6)
- **Repeat Order UX** (quick reorder/recent/favorites) — **Planned** (Sprint 8)

---

## 3) Operations Screens

### 3.1 Staff Operations
- **Staff Order Board (baseline)** — **Planned** (Sprint 3)
- **Staff Board Advanced** (filters/search/queue prioritization) — **Planned** (Sprint 5)

### 3.2 Notifications / Engagement
- **Order Event Templates / Communication controls** — **Planned** (Sprint 6)
- **Notification Delivery Status / Logs (UI)** — **Planned** (Sprint 6)

---

## 4) Analytics & Insights

- **Funnel Analytics Dashboard** (view → cart → checkout → payment success) — **Planned** (Sprint 6)
- **Tenant Health Overview Dashboard** — **Planned** (Sprint 6/9)
- **Merchant Insights Dashboard** (top-selling, peak windows, cancellation causes) — **Planned** (Sprint 8)
- **Action Center / Recommendations** — **Planned** (Sprint 8)
- **Weekly Summary / Report View** — **Planned** (Sprint 8)

---

## 5) Admin, Governance, Enterprise Screens

- **Tenant Admin Console** (tenant lifecycle, plan states, limits) — **Planned** (Sprint 9)
- **Governance / Role Matrix Admin** — **Planned** (Sprint 9)
- **Audit Export / Compliance Reports UI** — **Planned** (Sprint 9)
- **Support Diagnostics Bundle UI** — **Planned** (Sprint 9)
- **Integrations Management** (adapter status/sync/reconciliation) — **Planned** (Sprint 9)

---

## 6) Suggested Navigation Map (Target)

1. Auth
2. Onboarding
3. Dashboard
4. Menu/Catalog
5. Storefront (public)
6. Checkout
7. Staff Board
8. Promotions
9. Analytics/Insights
10. Tenant Admin
11. Integrations
12. Support Diagnostics

---

## 7) Source References
- `docs/prds/PRD-001-merchant-onboarding-and-storefront-mvp.md`
- `docs/prds/SPRINT-1-PLAN.md`
- `docs/prds/SPRINT-2-PLAN.md`
- `docs/prds/SPRINT-3-PLAN.md`
- `docs/prds/SPRINT-5-PLAN.md`
- `docs/prds/SPRINT-6-PLAN.md`
- `docs/prds/SPRINT-7-PLAN.md`
- `docs/prds/SPRINT-8-PLAN.md`
- `docs/prds/SPRINT-9-PLAN.md`
- `frontend/src/app/app.routes.ts`

---

## 8) Quick Current Reality Snapshot
Currently code-implemented routes:
- `/auth`
- `/onboarding`
- `/dashboard`
- `/menu`

All other screens above are planned roadmap items and should be promoted to implementation via sprint-linked issues.
