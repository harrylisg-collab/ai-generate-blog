import { NextRequest, NextResponse } from "next/server";
import { createSubscriber, getSubscriberByEmail } from "@/lib/subscribers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Save to database
    await createSubscriber(email);

    // Send confirmation email
    try {
      await resend.emails.send({
        from: "AI Generate Blog <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to AI Generate Blog!",
        html: `
          <h1>Thanks for subscribing!</h1>
          <p>You'll receive updates when new posts are published.</p>
          <p>- AI Generate Blog Team</p>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({ message: "Successfully subscribed! Check your email for confirmation." }, { status: 201 });
  } catch (error: any) {
    if (error.code === '23505') {
      return NextResponse.json({ message: "Already subscribed!" }, { status: 200 });
    }
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
