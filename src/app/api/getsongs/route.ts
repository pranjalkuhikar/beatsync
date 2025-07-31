import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from("songs").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ songs: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err || "Failed to fetch songs" },
      { status: 500 }
    );
  }
}
