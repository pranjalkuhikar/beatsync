import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // Check if Supabase is properly configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        {
          error:
            "Supabase configuration missing. Please check your environment variables.",
          details: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
            serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
              ? "Set"
              : "Missing",
          },
        },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin.from("songs").select("*");

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ songs: data || [] }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error in GET /getsongs:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
