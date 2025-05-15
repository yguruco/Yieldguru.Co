import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// Secret key for JWT - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'yieldguru-secret-key';

export async function GET() {
  try {
    console.log('API: /api/auth/me called');

    // Get the token from cookies - await the cookies() function
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      console.log('API: No auth token found in cookies');
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    console.log('API: Auth token found, verifying...');

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    console.log('API: Token verified, userId:', decoded.userId);

    // Connect to the database
    try {
      await dbConnect();
      console.log('API: Connected to MongoDB');
    } catch (dbError) {
      console.error('API: MongoDB connection error:', dbError);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Get the user from the database (works for both admin and regular users)
    try {
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        console.log('API: User not found with ID:', decoded.userId);
        // Clear the invalid cookie
        const cookieStore = await cookies();
        cookieStore.delete('auth_token');

        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      console.log('API: User found:', user.name, user.email);

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
    } catch (userError) {
      console.error('API: Error finding user:', userError);
      return NextResponse.json(
        { error: "Error retrieving user data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Auth verification error:", error);

    try {
      // Clear the invalid cookie
      const cookieStore = await cookies();
      cookieStore.delete('auth_token');
    } catch (cookieError) {
      console.error("Error clearing cookie:", cookieError);
    }

    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}
