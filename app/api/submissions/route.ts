import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Submission from "@/models/Submission";

// GET handler to retrieve all submissions or filter by status
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the status query parameter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build the query
    const query = status ? { status } : {};

    // Fetch submissions
    const submissions = await Submission.find(query).sort({ submissionDate: -1 });

    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// POST handler to create a new submission
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const data = await request.json();

    // Create a new submission
    const submission = await Submission.create(data);

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
