import { NextResponse, type NextRequest } from "next/server";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// Secret key for JWT - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'yieldguru-secret-key';

export async function GET(request: NextRequest) {
  try {
    // Get the token from cookies - await the cookies() function
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    // Connect to the database
    await dbConnect();

    // Get the user from the database (works for both admin and regular users)
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      // Clear the invalid cookie
      cookies().delete('auth_token');

      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Auth verification error:", error);

    // Clear the invalid cookie
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
