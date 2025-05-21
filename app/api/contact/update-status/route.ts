import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ContactSubmission from '@/models/ContactSubmission';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { id, status } = body;
    
    // Validate required fields
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      );
    }
    
    // Validate status value
    if (!['New', 'Read', 'Responded'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update contact submission status
    const updatedSubmission = await ContactSubmission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updatedSubmission) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedSubmission);
  } catch (error: any) {
    console.error('Error updating contact submission status:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
