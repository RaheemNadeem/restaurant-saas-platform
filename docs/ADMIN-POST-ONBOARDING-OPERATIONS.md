# Admin Post-Onboarding Operations

Last updated: 2026-02-28

Purpose: define what the restaurant admin can do immediately after onboarding, especially menu and storefront management.

---

## 1) Where Admin Lands After Onboarding

Typical navigation:
1. Login as Admin (`/auth`)
2. Dashboard (`/dashboard`)
3. Menu/Catalog (`/menu`)

The dashboard is the operational home. Menu and storefront controls are managed from admin areas.

---

## 2) How Admin Edits the Menu

From **Dashboard -> Menu (`/menu`)**:

### Core actions (current baseline)
- Add a new menu item
- Edit menu item name
- Edit price
- Save item updates

### Planned advanced actions (roadmap)
- Manage categories
- Set availability windows
- Toggle sold-out/unavailable states
- Configure modifiers/add-ons

### Data behavior
- All menu actions are tenant-scoped
- Changes affect only the current restaurant tenant
- Saved menu data feeds customer storefront catalog

---

## 3) How Admin Edits the Storefront

Storefront is primarily controlled by:
1. **Menu/Catalog data** (what items appear, prices, availability)
2. **Business/Brand settings** (name/logo/theme/config)

So, storefront updates happen through admin management screens:
- Menu updates in `/menu`
- Branding/profile/settings in admin configuration areas

When saved/published, storefront content reflects latest data for customers.

---

## 4) Recommended Post-Onboarding Admin Checklist

1. Confirm business profile and branding
2. Add starter menu (with prices)
3. Validate storefront item visibility
4. Invite staff users and assign roles
5. Run test order end-to-end (internal dry run)
6. Verify order appears on staff board and can be completed

---

## 5) Authorization Notes

- Admin has full restaurant configuration permissions
- Staff has restricted operational permissions
- Route/API guards must enforce Admin-only actions for:
  - menu governance-level changes
  - staff role management
  - billing/sensitive settings

---

## 6) Related Docs

- `docs/ORDER-LIFECYCLE-FLOW.md`
- `docs/UI-SCREENS-MASTER.md`
- `docs/prds/SPRINT-3-PLAN.md`
- `docs/prds/SPRINT-5-PLAN.md`
