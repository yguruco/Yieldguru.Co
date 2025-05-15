import { NextResponse, type NextRequest } from "next/server";
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Clear the auth cookie
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');

    return NextResponse.json({
      message: "Logged out successfully"
    }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
