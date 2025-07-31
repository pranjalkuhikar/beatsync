import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: { name, email } });
  } catch (err) {
    return NextResponse.json(
      { error: err || "Something went wrong" },
      { status: 500 }
    );
  }
}
