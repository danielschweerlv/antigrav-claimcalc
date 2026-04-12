# Payout Tracking Implementation Plan

**Goal:** Track attorney payouts per lead assignment, update dashboard revenue from real data, and generate downloadable invoice PDFs.

**Architecture:** UI updates to LeadDetail, Dashboard, and AttorneyList. Client-side PDF generation via jspdf. No schema changes — `lead_assignments` already has payout_status, payout_amount, payout_date, outcome columns.

**Tech Stack:** React 19, Vite 8, Tailwind 3, Supabase JS, jspdf, lucide-react, date-fns

---

## Task 1: Merge PR #5 and create branch
## Task 2: Update LeadDetail — assignment outcome + payout controls
## Task 3: Build invoice PDF generation (client-side jspdf)
## Task 4: Update Dashboard — real revenue from paid payouts
## Task 5: Update AttorneyList — revenue column per attorney
## Task 6: Build verification & push PR
