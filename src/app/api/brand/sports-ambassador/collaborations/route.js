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
    const brand = await User.findOne({ supabaseId: user.id });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    const acceptedRequests = await CollaborationRequest.find({
      status: "accepted",
      brandId: brand._id,
    });

    const acceptedCollaborationIds = acceptedRequests.map((req) =>
      req.ambassadorId.toString()
    );

    const total = await CollaborationRequest.countDocuments({
      status: "accepted",
      brandId: brand._id,
    });

    const data = await User.find({
      role: "sports-ambassador",
      _id: { $in: acceptedCollaborationIds },
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
