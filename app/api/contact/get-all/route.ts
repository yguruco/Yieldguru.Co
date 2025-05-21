import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ContactSubmission from '@/models/ContactSubmission';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get all contact submissions, sorted by newest first
    const contactSubmissions = await ContactSubmission.find({})
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json(contactSubmissions);
  } catch (error: any) {
    console.error('Error fetching contact submissions:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
