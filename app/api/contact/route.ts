import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ContactSubmission from '@/models/ContactSubmission';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { name, email, phone, message } = body;
    
    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Create new contact submission
    const contactSubmission = new ContactSubmission({
      name,
      email,
      phone,
      message,
      status: 'New'
    });
    
    await contactSubmission.save();
    
    return NextResponse.json(
      { success: true, message: 'Your message has been sent successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
