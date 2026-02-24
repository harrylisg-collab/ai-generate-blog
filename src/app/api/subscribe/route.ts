import { NextRequest, NextResponse } from "next/server";
import { createSubscriber, getSubscriberByEmail } from "@/lib/subscribers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await getSubscriberByEmail(email);
    if (existing) {
      return NextResponse.json({ message: "Already subscribed!" }, { status: 200 });
    }

    await createSubscriber(email);
    return NextResponse.json({ message: "Successfully subscribed!" }, { status: 201 });
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ message: "Already subscribed!" }, { status: 200 });
    }
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
