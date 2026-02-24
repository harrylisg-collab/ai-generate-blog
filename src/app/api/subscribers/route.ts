import { NextResponse } from "next/server";
import { getAllSubscribers } from "@/lib/subscribers";

export async function GET() {
  try {
    const subscribers = await getAllSubscribers();
    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
