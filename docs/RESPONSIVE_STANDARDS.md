# Responsive Standards (Frontend)

Applies to all storefront/admin/staff screens.

## Breakpoints
- Mobile: `<= 640px`
- Tablet: `641px - 1024px`
- Desktop: `>= 1025px`

## Rules
1. Mobile-first layout and CSS.
2. Minimum touch target: `44x44px`.
3. Fluid typography using `clamp()`.
4. No horizontal overflow at 320px width.
5. Inputs/buttons full width on mobile.
6. Avoid fixed heights for content cards.
7. Grid collapses to one column on mobile.

## QA Acceptance
- Test at widths: 320, 375, 390, 768, 1024, 1440.
- Verify no clipped content, overflow, or inaccessible controls.
