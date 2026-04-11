# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Backend

The calculator form submits to a Supabase edge function. To run locally:

1. Copy `.env.example` to `.env.local` and fill in the Supabase URL and anon key from the [project API settings](https://app.supabase.com/project/uawtkzzyeydfgnpiaqfb/settings/api).
2. `npm run dev`

### Deploying backend changes

Migrations live in `supabase/migrations/` and edge functions in `supabase/functions/`. To deploy:

```bash
supabase db push                           # apply new migrations
supabase functions deploy submit-lead      # redeploy the edge function
```

### Vercel environment

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project's environment variables for both Preview and Production environments.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
