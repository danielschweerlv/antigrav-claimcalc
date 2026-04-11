# Attorney Routing Implementation Plan

**Goal:** Add attorney partner management and lead-to-attorney assignment so Daniel can manage attorney partners and route qualified leads to them from the admin dashboard.

**Architecture:** CRUD UI for attorney_partners table, modal-based assignment from LeadDetail. Supabase JS client direct, RLS handles auth. No auto-matching -- manual selection filtered by case type.

**Tech Stack:** React 19, Vite 8, Tailwind 3, Supabase JS client, lucide-react, date-fns

---

## Task 1: Add Attorneys nav item to AdminLayout
## Task 2: Create AttorneyList component
## Task 3: Create AttorneyForm modal component
## Task 4: Create AssignLeadModal component
## Task 5: Update LeadDetail with assignment flow
## Task 6: Wire /admin/attorneys route into main.jsx
## Task 7: Build verification & push PR
