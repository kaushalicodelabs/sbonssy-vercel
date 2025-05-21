// src/app/api/campaign-request/route.js
import { connectDB } from "@/lib/db";
import createClient from "@/lib/supabase/server";
import CampaignInteraction from "@/models/CampaignInteraction";
import User from "@/models/User";
import Campaign from "@/models/Campaign";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// GET: Fetch ambassador's campaign interactions
export async function GET(req) {
  try {
    await connectDB();
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mongoUser = await User.findOne({ supabaseId: user.id });
    if (!mongoUser || mongoUser.role !== "sports-ambassador") {
      return NextResponse.json(
        { message: "Unauthorized: Must be an ambassador" },
        { status: 403 }
      );
    }

    const interactions = await CampaignInteraction.find({
      userId: mongoUser._id,
      interactionType: "apply",
    })
      .populate("campaignId", "basics.title")
      .select("campaignId brandId status");

    const formattedInteractions = interactions.map((i) => ({
      _id: i._id.toString(),
      campaignId: i.campaignId?._id.toString(),
      campaignTitle: i.campaignId?.basics?.title || "Unknown Campaign",
      brandId: i.brandId.toString(),
      status: i.status,
    }));

    return NextResponse.json(
      { requests: formattedInteractions },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching campaign interactions:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST: Create a new campaign interaction (moved to /brand/requests)
export async function POST(req) {
  try {
    await connectDB();
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mongoUser = await User.findOne({ supabaseId: user.id });
    if (!mongoUser || mongoUser.role !== "sports-ambassador") {
      return NextResponse.json(
        { message: "Unauthorized: Must be an ambassador" },
        { status: 403 }
      );
    }

    const { campaignId, brandId: providedBrandId, userId } = await req.json();

    if (
      !mongoose.Types.ObjectId.isValid(campaignId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        { message: "Invalid campaignId or userId" },
        { status: 400 }
      );
    }

    const campaign = await Campaign.findById(campaignId).select(
      "brandId basics.campaignType"
    );
    if (!campaign) {
      return NextResponse.json(
        { message: "Campaign not found" },
        { status: 404 }
      );
    }
    if (campaign.basics.campaignType !== "apply") {
      return NextResponse.json(
        { message: "Campaign is not of type 'apply'" },
        { status: 400 }
      );
    }

    const brandId =
      providedBrandId && mongoose.Types.ObjectId.isValid(providedBrandId)
        ? providedBrandId
        : campaign.brandId;

    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return NextResponse.json(
        { message: "Invalid or missing brandId" },
        { status: 400 }
      );
    }

    const existingInteraction = await CampaignInteraction.findOne({
      campaignId,
      userId,
      interactionType: "apply",
    });
    if (existingInteraction) {
      return NextResponse.json(
        { message: "Request already exists" },
        { status: 400 }
      );
    }

    const interaction = new CampaignInteraction({
      campaignId,
      userId,
      brandId,
      interactionType: "apply",
      status: "pending",
    });
    await interaction.save();

    return NextResponse.json(
      { status: "pending", requestId: interaction._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating campaign interaction:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT: Accept or decline a campaign interaction
export async function PUT(req) {
  try {
    await connectDB();
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mongoUser = await User.findOne({ supabaseId: user.id });
    if (!mongoUser || mongoUser.role !== "brand") {
      return NextResponse.json(
        { message: "Unauthorized: Must be a brand" },
        { status: 403 }
      );
    }

    // Parse JSON body
    const { requestId, action } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return NextResponse.json(
        { message: "Invalid requestId" },
        { status: 400 }
      );
    }

    if (!["accept", "decline"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const interaction = await CampaignInteraction.findOne({
      _id: requestId,
      brandId: mongoUser._id,
      interactionType: "apply",
      status: "pending",
    });

    if (!interaction) {
      return NextResponse.json(
        { message: "Request not found or already processed" },
        { status: 404 }
      );
    }

    interaction.status = action === "accept" ? "accepted" : "rejected";
    await interaction.save();

    return NextResponse.json(
      { success: true, status: interaction.status },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating campaign interaction:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
