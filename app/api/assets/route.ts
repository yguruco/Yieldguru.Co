import { NextResponse, type NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Asset from "@/models/Asset";

// GET handler to retrieve all assets or filter by status
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the status query parameter
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const operator = searchParams.get('operator');

    // Build the query
    let query: any = {};
    if (status) query.status = status;
    if (operator) query.operator = operator;

    // Fetch assets
    const assets = await Asset.find(query).sort({ createdAt: -1 });

    return NextResponse.json(assets, { status: 200 });
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}

// POST handler to create a new asset
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const data = await request.json();

    // Create a new asset
    const asset = await Asset.create(data);

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("Error creating asset:", error);
    return NextResponse.json(
      { error: "Failed to create asset" },
      { status: 500 }
    );
  }
}
