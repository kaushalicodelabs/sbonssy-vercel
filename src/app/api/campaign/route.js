import { connectDB } from "@/lib/db";
import createClient from "@/lib/supabase/server";
import Campaign from "@/models/Campaign";
import User from "@/models/User";
import CampaignInteraction from "@/models/CampaignInteraction";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const supabase = await createClient();

    // Authenticate user with Supabase
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

    // Verify user is a brand
    const brandUser = await User.findOne({ supabaseId: user.id });

    if (!brandUser || brandUser.role !== "brand") {
      return NextResponse.json(
        { message: "Forbidden: Only brand accounts can create campaigns" },
        { status: 403 }
      );
    }

    // Parse request body
    const rawData = await req.json();

    if (!rawData || typeof rawData !== "object") {
      return NextResponse.json(
        { message: "Invalid campaign data format" },
        { status: 400 }
      );
    }

    // Normalize campaign data
    const campaignData = {
      ...rawData,
      brandId: brandUser._id,
      status: "draft",
      basics: {
        campaignType: rawData.basics?.campaignType || "public",
        title: String(rawData.basics?.title || ""),
        description: String(rawData.basics?.description || ""),
        startDate: rawData.basics?.isOngoing
          ? null
          : rawData.basics?.startDate
          ? new Date(rawData.basics.startDate)
          : null,
        endDate: rawData.basics?.isOngoing
          ? null
          : rawData.basics?.endDate
          ? new Date(rawData.basics.endDate)
          : null,
        isOngoing: Boolean(rawData.basics?.isOngoing),
        targetRegions: Array.isArray(rawData.basics?.targetRegions)
          ? rawData.basics.targetRegions.filter((region) =>
              [
                "north_america",
                "europe",
                "asia",
                "africa",
                "south_america",
                "australia",
              ].includes(region)
            )
          : [],
      },
      creatorProfile: {
        followerRange: {
          min: Number(rawData.creatorProfile?.followerRange?.min) || 0,
          max: Number(rawData.creatorProfile?.followerRange?.max) || 0,
        },
        platforms: Array.isArray(rawData.creatorProfile?.platforms)
          ? rawData.creatorProfile.platforms.filter((p) =>
              [
                "instagram",
                "youtube",
                "tiktok",
                "twitter",
                "facebook",
              ].includes(p)
            )
          : [],
        ambassadorTypes: Array.isArray(rawData.creatorProfile?.ambassadorTypes)
          ? rawData.creatorProfile.ambassadorTypes.filter((t) =>
              [
                "athlete",
                "team",
                "influencer",
                "para-athlete",
                "coach",
                "ex-athlete",
              ].includes(t)
            )
          : [],
        contentRequirements: String(
          rawData.creatorProfile?.contentRequirements || ""
        ),
        requiresApproval: Boolean(rawData.creatorProfile?.requiresApproval),
      },
      compensation: {
        type: rawData.compensation?.type || "",
        commission:
          rawData.compensation?.type === "pay-per-sale"
            ? Math.max(0, Number(rawData.compensation?.commission) || 0)
            : 0,
        amount: ["pay-per-lead", "pay-per-click", "flat-fee"].includes(
          rawData.compensation?.type
        )
          ? Math.max(0, Number(rawData.compensation?.amount) || 0)
          : 0,
        gifting: Boolean(rawData.compensation?.gifting),
      },
      assets: {
        logos: Array.isArray(rawData.assets?.logos)
          ? rawData.assets.logos.map((item) => ({
              url: String(item.url || ""),
              publicId: String(item.publicId || ""),
            }))
          : [],
        photos: Array.isArray(rawData.assets?.photos)
          ? rawData.assets.photos.map((item) => ({
              url: String(item.url || ""),
              publicId: String(item.publicId || ""),
            }))
          : [],
        videos: Array.isArray(rawData.assets?.videos)
          ? rawData.assets.videos.map((item) => ({
              url: String(item.url || ""),
              publicId: String(item.publicId || ""),
            }))
          : [],
        examplePosts: Array.isArray(rawData.assets?.examplePosts)
          ? rawData.assets.examplePosts.map((item) => ({
              url: String(item.url || ""),
              publicId: String(item.publicId || ""),
              mediaType: String(
                item.mediaType ||
                  (item.url?.includes("video") ? "video" : "image")
              ),
            }))
          : [],
        styleGuide: {
          fonts: String(rawData.assets?.styleGuide?.fonts || ""),
          colors: String(rawData.assets?.styleGuide?.colors || ""),
          guidelines: String(rawData.assets?.styleGuide?.guidelines || ""),
        },
      },
      goals: {
        clicks: Math.max(0, Number(rawData.goals?.clicks) || 0),
        sales: Math.max(0, Number(rawData.goals?.sales) || 0),
        signups: Math.max(0, Number(rawData.goals?.signups) || 0),
        budgetCap: Math.max(0, Number(rawData.goals?.budgetCap) || 0),
        products: rawData.compensation?.gifting
          ? Array.isArray(rawData.goals?.products)
            ? rawData.goals.products.map((p) => ({
                name: String(p.name || ""),
                description: String(p.description || ""),
              }))
            : []
          : [],
        shippingRegions: rawData.compensation?.gifting
          ? Array.isArray(rawData.goals?.shippingRegions)
            ? rawData.goals.shippingRegions.filter((region) =>
                [
                  "north_america",
                  "europe",
                  "asia",
                  "africa",
                  "south_america",
                  "australia",
                ].includes(region)
              )
            : []
          : [],
        shippingRequirements: rawData.compensation?.gifting
          ? String(rawData.goals?.shippingRequirements || "")
          : "",
      },
      legal: {
        termsAgreed: Boolean(rawData.legal?.termsAgreed),
        ftcDisclosure: rawData.legal?.ftcDisclosure !== false,
        customTerms: String(rawData.legal?.customTerms || ""),
      },
    };

    // Validate required fields
    if (!campaignData.basics.title) {
      throw new Error("Campaign title is required");
    }
    if (!campaignData.basics.description) {
      throw new Error("Campaign description is required");
    }
    if (!campaignData.compensation.type) {
      throw new Error("Compensation type is required");
    }
    if (
      campaignData.compensation.type === "pay-per-sale" &&
      !campaignData.compensation.commission
    ) {
      throw new Error("Commission rate is required for Pay Per Sale");
    }
    if (
      ["pay-per-lead", "pay-per-click", "flat-fee"].includes(
        campaignData.compensation.type
      ) &&
      !campaignData.compensation.amount
    ) {
      throw new Error(
        `Payout amount is required for ${campaignData.compensation.type}`
      );
    }
    if (!campaignData.legal.termsAgreed) {
      throw new Error("You must agree to the terms and conditions");
    }
    if (!campaignData.legal.customTerms) {
      throw new Error("Campaign terms are required");
    }
    if (
      campaignData.assets.logos.length === 0 ||
      campaignData.assets.logos.some((item) => !item.url || !item.publicId)
    ) {
      throw new Error("At least one valid logo is required");
    }
    // if (
    //   campaignData.compensation.gifting &&
    //   campaignData.goals.products.length === 0
    // ) {
    //   throw new Error(
    //     "At least one product is required when gifting is enabled"
    //   );
    // }
    if (
      campaignData.compensation.gifting &&
      campaignData.goals.products.some((p) => !p.name)
    ) {
      throw new Error("Product name is required for all selected products");
    }
    // if (
    //   campaignData.compensation.gifting &&
    //   campaignData.goals.shippingRegions.length === 0
    // ) {
    //   throw new Error(
    //     "At least one shipping region is required when gifting is enabled"
    //   );
    // }
    if (
      campaignData.assets.examplePosts.some(
        (item) => !item.url || !item.publicId || !item.mediaType
      )
    ) {
      throw new Error(
        "Valid URL, publicId, and media type are required for all example posts"
      );
    }

    // Create campaign
    const campaign = await Campaign.create(campaignData);

    return NextResponse.json(
      {
        message: "Campaign created successfully",
        campaign: campaign,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: error.message || "Error creating campaign",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      {
        status: error.message.includes("required") ? 400 : 500,
      }
    );
  }
}

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
    if (!mongoUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get("brandId");

    let campaigns;
    if (
      brandId &&
      mongoUser.role === "brand" &&
      mongoUser._id.toString() === brandId
    ) {
      // Brand-specific campaigns (no filtering for joined status)
      campaigns = await Campaign.find({ brandId })
        .populate("brandId", "brand.companyName")
        .select("basics assets status");
    } else {
      // Public/apply campaigns, excluding joined campaigns for ambassadors
      const joinedInteractions = await CampaignInteraction.find({
        userId: mongoUser._id,
        $or: [
          { interactionType: "apply", status: "accepted" },
          { interactionType: "public", status: "active" },
          { interactionType: "private", status: "accepted" },
        ],
      }).select("campaignId");

      const joinedCampaignIds = joinedInteractions.map((interaction) =>
        interaction.campaignId.toString()
      );

      campaigns = await Campaign.find({
        "basics.campaignType": { $in: ["apply", "public"] },
        _id: { $nin: joinedCampaignIds },
      })
        .populate("brandId", "brand.companyName")
        .select("basics assets");
    }

    const formattedCampaigns = campaigns.map((campaign) => ({
      _id: campaign._id.toString(),
      basics: campaign.basics,
      assets: campaign.assets,
      brandId: campaign.brandId?._id.toString(),
      brandName: campaign.brandId?.brand?.companyName,
      status: campaign.status,
    }));

    return NextResponse.json({ data: formattedCampaigns }, { status: 200 });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
