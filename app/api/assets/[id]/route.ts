import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Asset from "@/models/Asset";

// GET handler to retrieve a specific asset by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the asset ID from the URL
    const { id } = params;

    // Find the asset
    const asset = await Asset.findOne({ id });

    // Check if the asset exists
    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(asset, { status: 200 });
  } catch (error) {
    console.error("Error fetching asset:", error);
    return NextResponse.json(
      { error: "Failed to fetch asset" },
      { status: 500 }
    );
  }
}

// PATCH handler to update an asset
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the asset ID from the URL
    const { id } = params;

    // Parse the request body
    const data = await request.json();

    // Find and update the asset
    const asset = await Asset.findOneAndUpdate(
      { id },
      { $set: data },
      { new: true, runValidators: true }
    );

    // Check if the asset exists
    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(asset, { status: 200 });
  } catch (error) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      { error: "Failed to update asset" },
      { status: 500 }
    );
  }
}

// DELETE handler to delete an asset
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the asset ID from the URL
    const { id } = params;

    // Find and delete the asset
    const asset = await Asset.findOneAndDelete({ id });

    // Check if the asset exists
    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Asset deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting asset:", error);
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
