// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Check if environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables:");
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL:",
    supabaseUrl ? "✅ Set" : "❌ Missing"
  );
  console.error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
    supabaseAnonKey ? "✅ Set" : "❌ Missing"
  );
  console.error(
    "SUPABASE_SERVICE_ROLE_KEY:",
    supabaseServiceKey ? "✅ Set" : "❌ Missing"
  );
}

// Client for client-side operations (with RLS)
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(
  supabaseUrl || "",
  supabaseServiceKey || ""
);
