import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Submission from "@/models/Submission";

// GET handler to retrieve a specific submission by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the submission ID from the URL
    const { id } = params;

    // Find the submission
    const submission = await Submission.findById(id);

    // Check if the submission exists
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(submission, { status: 200 });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      { error: "Failed to fetch submission" },
      { status: 500 }
    );
  }
}

// PATCH handler to update a submission (e.g., approve or reject)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the submission ID from the URL
    const { id } = params;

    // Parse the request body
    const data = await request.json();

    // Find and update the submission
    const submission = await Submission.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    // Check if the submission exists
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(submission, { status: 200 });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the submission ID from the URL
    const { id } = params;

    // Find and delete the submission
    const submission = await Submission.findByIdAndDelete(id);

    // Check if the submission exists
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Submission deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
