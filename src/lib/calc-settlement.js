// Re-export of the shared edge-function calc module so the browser and
// the server use a single source of truth. Vite's esbuild transpiles
// the .ts file transparently.
export {
  calcSettlement,
} from '../../supabase/functions/_shared/calc-settlement.ts'
