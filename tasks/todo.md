# ClaimCalculator.ai — Task Tracker

## Done This Session (2026-04-21, wrap 2)

- [x] Site-down triage — live at `https://www.claimcalculator.ai/`
- [x] Root cause: `32bd3ca` removed `import WhatIsSection` but left `<WhatIsSection />` at `App.jsx:137` → `ReferenceError` at runtime (Vite build passed because JSX compiles before import resolution surfaces)
- [x] Hotfix `cf66fd6` — restored import
- [x] Full color/hero revert `6a3de89` — restored `src/App.jsx`, `src/index.css`, `tailwind.config.js` to `2c46303` (cyan `#a4e6ff` + 2-col hero with avatars + "Insurance companies already know your number" copy)
- [x] Verified live bundle hash flipped after each deploy (`0w3tEYUg` → `DBhNmAbU` → `CJ-qdZPl`)
- [x] Non-UI fixes from `32bd3ca` preserved: yesNo normalization, `verify_jwt=false`, awaited Resend fetch, Gmail notify

## Pending — Next Session

- [ ] **Homepage redesign merge decision** — `feature/homepage-redesign` worktree still has gold editorial redesign (11 commits ahead of pre-revert baseline). User rejected gold scheme. Options: (a) delete worktree + branch, (b) retune redesign to cyan and revisit, (c) leave dormant.
- [ ] **Hero 3D animation crashed** — blank left panel on hero. Investigate Three.js/R3F error.
- [ ] **Mobile backend issue** — TBD (may be resolved now that verify_jwt + schema fixes are in)
- [ ] **Aesthetics polish** — specifics TBD
- [ ] **Stale remote branches** — delete: `claude/fix-legal-pages-accordion-bhNyP`, `claude/implement-todo-item-B7nmh`, `feat/site-wide-updates-7-changes`, `text/replace-claim-with-case`, `feat/admin-dashboard`, `feat/analytics`, `feat/email-notifications`, `feat/payout-tracking`
- [ ] **`notify-new-lead` orphaned function** — `verify_jwt: true`, getting 401. Delete from Supabase dashboard.
- [ ] **Remove Zod debug logging** — `console.error("schema validation failed", ...)` in `submit-lead/index.ts` should be removed or downgraded before prod stabilizes
