import { supabaseAdmin } from "./supabase-admin";

export async function isRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
      client_id: key,
      max_reqs: maxRequests,
      window_ms: windowMs,
    });
    
    if (error) {
      console.error("Rate limit error:", error);
      return false; // Fail open to not block legitimate users if DB is slow
    }
    
    return data === true;
  } catch (err) {
    console.error("Rate limit exception:", err);
    return false;
  }
}
