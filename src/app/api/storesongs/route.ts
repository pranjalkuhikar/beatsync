import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, mood, url } = body;

    if (!title || !mood || !url) {
      return NextResponse.json(
        { error: "Missing required fields: title, mood, url" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("songs")
      .insert([
        {
          title,
          mood,
          url,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Song stored successfully", data },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in POST /storesongs:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
