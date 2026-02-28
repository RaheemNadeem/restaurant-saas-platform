# Pencil Screens Index

Last updated: 2026-02-28
Pencil file: `pencil-welcome-desktop.pen`

Purpose: quick index for AI agents to locate existing screen frames by exact name + node ID.

## Owner/Internal Flow
- `Screen/Owner Login` (`KxCFY`)
- `Screen/Owner Signup` (`LtDhB`)
- `Screen/Owner Onboarding Wizard` (`2HYxu`)
- `Screen/Brand Setup` (`Y9hVj`)
- `Screen/Menu Manager` (`tnASS`)
- `Screen/Payments Setup` (`AIvQR`)
- `Screen/Storefront Publish Status` (`WxNMm`)
- `Screen/Owner Dashboard` (`Y30VF`)
- `Screen/Order Manager` (`qMZKW`)

## Customer/Public Flow
- `Screen/Customer Storefront Landing` (`rhwRY`)
- `Screen/Customer Menu Page` (`hQZPg`)
- `Screen/Customer Menu Page - Search Active` (`L2ppX`)
- `Screen/Customer Cart Drawer` (`yZpJ5`)
- `Screen/Customer Checkout Details` (`uBpgb`)
- `Screen/Customer Order Confirmation` (`BAkeN`)

## Auth Recovery + Reset Flow
- `Screen/Owner Recover Account - Link Sent` (`pYXwr`)
- `Screen/Owner Reset Email Received` (`rf7ob`)
- `Screen/Email Template - Reset Password` (`7SZBw`)
- `Screen/Owner Reset Password - Form` (`Er7c7`)
- `Screen/Owner Reset Password - Weak Password` (`x07IX`)
- `Screen/Owner Reset Password - Password Mismatch` (`w46xc`)
- `Screen/Owner Reset Password - Success` (`nLkpR`)
- `Screen/Owner Reset Password - Link Expired` (`oBW0W`)

## Notes for Incoming AI Agents
1. Use exact IDs above with Pencil tools (`batch_get`, `get_screenshot`) to inspect/continue.
2. Customer flow order in design currently: Landing -> Menu -> Cart -> Checkout -> Order Confirmation.
3. Keep top nav style consistent as `QuickServe Kitchen` on customer screens.
4. For implementation sequencing, defer to `docs/UI-SCREENS-MASTER.md` + sprint plans under `docs/prds/`.
