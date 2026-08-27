import { createClient as createSupabaseClient } from "@supabase/supabase-js";

if (typeof window !== "undefined") {
  throw new Error("admin.ts só pode ser importado em código de servidor.");
}

// Cliente com a service role: ignora RLS. Só para rotinas de servidor
// (webhook do Asaas, baixa de estoque). Nunca importar em Client Components.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
