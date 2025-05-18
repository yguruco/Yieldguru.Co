import { NextResponse, type NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// Secret key for JWT - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'yieldguru-secret-key';

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find the admin user
    const admin = await User.findOne({ email, role: 'Admin' });

    // Check if admin exists
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Update last login time
    admin.lastLogin = new Date();
    await admin.save();

    // Create JWT token
    console.log('Admin Login: Creating JWT token with JWT_SECRET prefix:', JWT_SECRET.substring(0, 5) + '...');

    // Log the actual JWT_SECRET for debugging (only in development)
    if (process.env.NODE_ENV !== 'production') {
      console.log('Admin Login: Full JWT_SECRET for debugging:', JWT_SECRET);
    }

    const token = jwt.sign(
      {
        userId: admin._id,
        email: admin.email,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    console.log('Setting auth_token cookie with admin token:', token);
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      // In production, secure should be true
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      sameSite: 'lax' // 'lax' for better compatibility
    });

    // Return admin data
    return NextResponse.json({
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
        lastLogin: admin.lastLogin
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
