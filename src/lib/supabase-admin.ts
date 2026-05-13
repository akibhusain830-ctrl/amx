import { createClient } from "@supabase/supabase-js";

// Note: SUPABASE_SERVICE_ROLE_KEY bypasses Row Level Security (RLS).
// NEVER expose this key to the client (browser). Only use it in Next.js Server Components or API Routes.
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is missing. Database operations will fail for unauthenticated users.");
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "missing-key"
);
