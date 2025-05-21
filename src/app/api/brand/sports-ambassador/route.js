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
      return new Response(
        JSON.stringify({ message: "Unauthorized: Authentication failed" }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const acceptedRequests = await CollaborationRequest.find({
      status: "accepted",
    });

    const acceptedCollaborationIds = acceptedRequests.map((req) =>
      req.ambassadorId.toString()
    );

    const total = await User.countDocuments({
      role: "sports-ambassador",
      id: { $nin: acceptedCollaborationIds },
      // isProfileCompleted: true,
    });
    const data = await User.find({
      role: "sports-ambassador",
      _id: { $nin: acceptedCollaborationIds },
      // isProfileCompleted: true,
    })
      .skip(skip)
      .limit(limit);

    return new Response(JSON.stringify({ data, total }), { status: 200 });
  } catch (error) {
    console.error("Error fetching sports ambassadors:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch sports ambassadors" }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return new Response(
        JSON.stringify({ message: "Unauthorized: Authentication failed" }),
        { status: 401 }
      );
    }

    const brand = await User.findOne({ supabaseId: user.id, role: "brand" });
    if (!brand) {
      return new Response(JSON.stringify({ message: "Brand not found" }), {
        status: 404,
      });
    }

    const { ambassadorId } = await request.json();

    if (!ambassadorId) {
      return new Response(
        JSON.stringify({ message: "Ambassador ID is required" }),
        { status: 400 }
      );
    }

    const ambassador = await User.findById(ambassadorId);
    if (!ambassador || ambassador.role !== "sports-ambassador") {
      return new Response(
        JSON.stringify({ message: "Invalid sports ambassador" }),
        { status: 404 }
      );
    }

    // Check if an active (pending or accepted) collaboration request exists
    const existingActiveRequest = await CollaborationRequest.findOne({
      brandId: brand._id,
      ambassadorId: ambassador._id,
      status: { $in: ["pending", "accepted"] },
    });

    if (existingActiveRequest) {
      return new Response(
        JSON.stringify({
          message:
            existingActiveRequest.status === "pending"
              ? "Collaboration request already sent"
              : "Collaboration already exists",
        }),
        { status: 409 }
      );
    }

    // Create a new collaboration request
    const collaborationRequest = new CollaborationRequest({
      brandId: brand._id,
      ambassadorId: ambassador._id,
      status: "pending",
    });

    await collaborationRequest.save();

    return new Response(
      JSON.stringify({
        message: "Collaboration request sent successfully",
        data: collaborationRequest,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending collaboration request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send collaboration request" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const supabase = await createClient();

    // Authentication
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

    // Verify brand user
    const brand = await User.findOne({ supabaseId: user.id, role: "brand" });
    if (!brand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // Get requestId from request body
    const { requestId } = await request.json();

    if (!requestId) {
      return NextResponse.json(
        { message: "Request ID is required" },
        { status: 400 }
      );
    }

    // Delete the request
    const deletedRequest = await CollaborationRequest.findOneAndDelete({
      _id: requestId,
      brandId: brand._id,
      status: "pending", // Only allow deleting pending requests
    });

    if (!deletedRequest) {
      return NextResponse.json(
        { message: "Request not found or cannot be deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Request deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting request:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const supabase = await createClient();

    // Authentication
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

    // Verify user is an ambassador
    const ambassador = await User.findOne({
      supabaseId: user.id,
      role: "sports-ambassador",
    });
    if (!ambassador) {
      return NextResponse.json(
        { message: "Ambassador not found" },
        { status: 404 }
      );
    }

    const { requestId, action } = await request.json();

    if (!requestId || !action) {
      return NextResponse.json(
        { message: "Request ID and action are required" },
        { status: 400 }
      );
    }

    // Validate action
    if (!["accept", "decline"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    // Find and update the request
    const updatedRequest = await CollaborationRequest.findOneAndUpdate(
      {
        _id: requestId,
        ambassadorId: ambassador._id,
        status: "pending", // Only allow updates to pending requests
      },
      {
        status: action === "accept" ? "accepted" : "rejected",
        respondedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedRequest) {
      return NextResponse.json(
        { message: "Request not found or cannot be updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `Request ${action}ed successfully`,
        data: updatedRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating request:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}
