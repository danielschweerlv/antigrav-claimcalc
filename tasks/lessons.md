# Lessons Learned

## 2026-04-21

- **Porkbun IMAP hostname is `imap.porkbun.com`** (not `mail.porkbun.com`). Their KB doesn't document this clearly. Port 993, SSL on.
- **Resend SPF/MX records go on `send` subdomain** — not root domain — so they coexist with Porkbun's existing email MX records without conflict.
- **Don't use orphaned edge functions as webhooks** — `notify-new-lead` was deployed on Supabase with `verify_jwt: true` and no local source file. All email logic now lives inside `submit-lead` directly (fire-and-forget fetch after insert).
- **`notify-new-lead` still live on Supabase** — needs manual deletion from dashboard next session.
- **Vite build passing ≠ site works.** JSX `<Foo />` compiles to `React.createElement(Foo, ...)` which Vite/Rolldown accept even when `Foo` import is missing — the error only surfaces at runtime in the browser. When deleting imports, grep the same file for remaining JSX usages before committing. Browser QA is the only reliable check; "Vercel Ready" just means the bundle built.
- **Atomic file checkout beats commit revert for mixed commits.** `32bd3ca` bundled UI redesign + edge-fn fixes. `git revert 32bd3ca` would have undone email/verify_jwt work. Better: `git checkout <baseline-sha> -- <specific-files>` scoped to the UI files only, which let us keep the edge-fn fixes untouched.
- **Gold color scheme rejected.** Hardcoded gold hex (`#c9a84c`, `rgba(201,168,76,...)`) had leaked into `App.jsx` inline styles and `index.css` `.cta-gradient` alongside the tailwind token swap — a single token revert wouldn't have been enough. Remember: when swapping brand colors, audit both the token AND any inline hex that bypasses the token.
