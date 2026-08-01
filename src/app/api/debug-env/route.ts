import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

// Rota temporária de diagnóstico — remover depois de descobrir o problema.
export async function GET() {
  const report: Record<string, unknown> = {
    hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length ?? 0,
  };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("products").select("id").limit(1);
    report.clientCreated = true;
    report.queryError = error ? { message: error.message, code: error.code } : null;
  } catch (err) {
    report.clientCreated = false;
    report.exception =
      err instanceof Error ? { message: err.message, stack: err.stack } : String(err);
  }

  return NextResponse.json(report);
}
