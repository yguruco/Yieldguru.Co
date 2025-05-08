import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// Secret key for JWT - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'yieldguru-secret-key';

// GET handler to retrieve all users (admin only)
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the token from cookies
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

    // Check if the user is an admin
    if (decoded.role !== 'Admin') {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    // Get the role query parameter
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    // Build the query
    let query: any = {};
    if (role) query.role = role;
    if (status) query.status = status;

    // Fetch users (excluding password)
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
