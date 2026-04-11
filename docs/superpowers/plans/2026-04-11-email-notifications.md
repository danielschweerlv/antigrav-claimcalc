# Email Notifications Implementation Plan

**Goal:** Send an admin notification email via Resend when a new lead is submitted through the calculator.

**Architecture:** New `notify-new-lead` edge function called from within `submit-lead` (fire-and-forget). Resend API for delivery. Non-blocking — email failure never breaks lead submission.

**Tech Stack:** Deno (Supabase Edge Functions), Resend REST API, HTML email template

---

## Task 1: Create notify-new-lead edge function

**File:** `supabase/functions/notify-new-lead/index.ts`

- Accept POST with lead data (name, email, phone, case_type, estimate range, lead_id)
- Call Resend API with RESEND_API_KEY from env
- Send to danielschweer@gmail.com
- From: onboarding@resend.dev (Resend test sender — swap to custom domain later)
- Subject: "New Lead: {name} — {case_type}"
- HTML body: clean, inline-styled email with lead details + admin link
- Return 200 on success, log errors but don't throw

## Task 2: Update submit-lead to call notify-new-lead

**File:** `supabase/functions/submit-lead/index.ts`

- After successful lead insert + activity log, fire a fetch() to notify-new-lead
- Pass lead data needed for the email
- Wrap in try/catch — never let email failure affect lead submission response
- Do NOT await the response (fire-and-forget)

## Task 3: Set RESEND_API_KEY secret in Supabase

- Use Supabase MCP to set the secret
- Verify it's accessible

## Task 4: Deploy both edge functions

- Deploy notify-new-lead
- Re-deploy submit-lead (updated version)
- Verify both are active

## Task 5: Test end-to-end & push PR

- Verify build
- Commit all changes
- Push branch, create PR
