import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    console.log("Received body:", body);

    const { title, mood, url } = body;

    if (!title || !mood || !url) {
      console.log("Missing required fields:", { title, mood, url });
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

    console.log("Supabase insert result:", { data, error });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Song stored successfully", data },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error in POST /storesongs:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
