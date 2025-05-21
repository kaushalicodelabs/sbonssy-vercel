import { connectDB } from "@/lib/db";
import createClient from "@/lib/supabase/server";
import { CollaborationRequest } from "@/models/CollaborationRequest";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return NextResponse.json(
        { message: "Unauthorized: Authentication failed" },
        { status: 401 }
      );
    }

    const ambassador = await User.findOne({ supabaseId: user.id });
    if (!ambassador) {
      return NextResponse.json(
        { message: "Ambassador not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const acceptedRequests = await CollaborationRequest.find({
      status: "accepted",
      brandId: ambassador._id,
    }).populate("ambassadorId");

    const total = await CollaborationRequest.countDocuments({
      status: "accepted",
      brandId: ambassador._id,
    });

    // Since we're populating, we can directly get the ambassador data
    const data = acceptedRequests.map((req) => req.ambassadorId);

    return NextResponse.json({
      data: data.slice(skip, skip + limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching sports ambassadors:", error);
    return NextResponse.json(
      { error: "Failed to fetch sports ambassadors" },
      { status: 500 }
    );
  }
}
