// pages/api/campaign/invite.js
import { connectDB } from "@/lib/db";
import createClient from "@/lib/supabase/server";
import CampaignInteraction from "@/models/CampaignInteraction";
import User from "@/models/User";
import Campaign from "@/models/Campaign";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

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
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const interactions = await CampaignInteraction.find({
      userId: mongoUser._id,
      interactionType: "private",
      status: "pending",
    })
      .populate("campaignId", "basics.title")
      .populate("brandId", "brand.companyName")
      .select("campaignId brandId status createdAt");

    const formattedInteractions = interactions.map((i) => ({
      _id: i._id.toString(),
      campaignId: i.campaignId?._id.toString(),
      campaignTitle: i.campaignId?.basics?.title || "Untitled Campaign",
      brandName: i.brandId?.brand?.companyName || "Unknown Brand",
      status: i.status,
      createdAt: i.createdAt,
    }));

    return NextResponse.json(
      { data: { data: formattedInteractions } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

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
    if (!mongoUser || mongoUser.role !== "brand") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { campaignId, ambassadorIds } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return NextResponse.json(
        { message: "Invalid campaignId" },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(ambassadorIds) ||
      ambassadorIds.length === 0 ||
      ambassadorIds.some((id) => !mongoose.Types.ObjectId.isValid(id))
    ) {
      return NextResponse.json(
        { message: "Invalid or empty ambassadorIds" },
        { status: 400 }
      );
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.basics.campaignType !== "private") {
      return NextResponse.json(
        { message: "Invalid or non-private campaign" },
        { status: 400 }
      );
    }

    const ambassadors = await User.find({
      _id: { $in: ambassadorIds },
      role: "sports-ambassador",
      $or: [
        { athlete: { $exists: true, $ne: null } },
        { exAthlete: { $exists: true, $ne: null } },
        { paraAthlete: { $exists: true, $ne: null } },
        { coach: { $exists: true, $ne: null } },
        { team: { $exists: true, $ne: null } },
        { influencer: { $exists: true, $ne: null } },
      ],
    }).select("_id");

    if (ambassadors.length === 0) {
      return NextResponse.json(
        { message: "No valid ambassadors found" },
        { status: 404 }
      );
    }

    if (ambassadors.length !== ambassadorIds.length) {
      return NextResponse.json(
        { message: "Some ambassador IDs are invalid" },
        { status: 400 }
      );
    }

    const existingInteractions = await CampaignInteraction.find({
      campaignId,
      userId: { $in: ambassadorIds },
      interactionType: "private",
      status: { $in: ["pending", "accepted"] },
    });

    const existingAmbassadorIds = existingInteractions.map((i) =>
      i.userId.toString()
    );

    const declinedInteractions = await CampaignInteraction.find({
      campaignId,
      userId: { $in: ambassadorIds },
      interactionType: "private",
      status: "declined",
    });

    const updatedDeclined = [];
    if (declinedInteractions.length > 0) {
      const declinedIds = declinedInteractions.map((i) => i._id);
      await CampaignInteraction.updateMany(
        { _id: { $in: declinedIds } },
        { $set: { status: "pending", updatedAt: new Date() } }
      );
      updatedDeclined.push(
        ...declinedInteractions.map((i) => i.userId.toString())
      );
    }

    const newInteractions = ambassadors
      .filter(
        (amb) =>
          !existingAmbassadorIds.includes(amb._id.toString()) &&
          !updatedDeclined.includes(amb._id.toString())
      )
      .map((ambassador) => ({
        campaignId,
        userId: ambassador._id,
        brandId: mongoUser._id,
        interactionType: "private",
        status: "pending",
      }));

    let totalInvitations = updatedDeclined.length;
    if (newInteractions.length > 0) {
      await CampaignInteraction.insertMany(newInteractions);
      totalInvitations += newInteractions.length;
    }

    if (totalInvitations === 0) {
      return NextResponse.json(
        { message: "All ambassadors have pending or accepted invitations" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: `Invitations sent or re-sent to ${totalInvitations} ambassadors`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending invitations:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

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
    if (!mongoUser || mongoUser.role !== "sports-ambassador") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { invitationId, action } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(invitationId)) {
      return NextResponse.json(
        { message: "Invalid invitation ID" },
        { status: 400 }
      );
    }

    if (!["accept", "decline"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    const interaction = await CampaignInteraction.findOne({
      _id: invitationId,
      userId: mongoUser._id,
      interactionType: "private",
      status: "pending",
    });

    if (!interaction) {
      return NextResponse.json(
        { message: "Invitation not found or already processed" },
        { status: 404 }
      );
    }

    interaction.status = action === "accept" ? "accepted" : "declined";
    await interaction.save();

    return NextResponse.json(
      { data: { message: `Invitation ${action}ed successfully` } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing invitation:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
