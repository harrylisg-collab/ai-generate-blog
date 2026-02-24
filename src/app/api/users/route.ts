import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, createUser, updateUser, deleteUser, getUserById } from "@/lib/auth";

export async function GET() {
  try {
    const users = await getAllUsers();
    // Don't return passwords
    const safeUsers = users.map(({ password, ...user }) => user);
    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await createUser(email, password, name || '', role || 'author');
    const { password: _, ...safeUser } = user;
    
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/users error:", error);
    if (error.code === '23505') {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
