import { NextResponse } from "next/server";
import Campaign from "@/models/Campaign";
import { connectDB } from "@/lib/db";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Filter parameters
    const filters = {
      type: searchParams.get("type"),
      isOngoing: searchParams.get("isOngoing"),
      minFollowers: searchParams.get("minFollowers"),
      maxFollowers: searchParams.get("maxFollowers"),
      platforms: searchParams.get("platforms"),
      contentType: searchParams.get("contentType"),
      brandName: searchParams.get("brandName"),
      sort: searchParams.get("sort") || "startDate-desc",
    };

    // Build MongoDB query
    const query = {};

    if (filters.type && filters.type !== "all") {
      query["basics.campaignType"] = filters.type;
    }

    if (filters.isOngoing) {
      query["basics.isOngoing"] = filters.isOngoing === "true";
    }

    if (filters.contentType) {
      query["creatorProfile.contentStyle"] = {
        $regex: new RegExp(filters.contentType, "i"),
      };
    }

    if (filters.minFollowers || filters.maxFollowers) {
      const min = parseInt(filters.minFollowers || "0");
      const max = parseInt(
        filters.maxFollowers || `${Number.MAX_SAFE_INTEGER}`
      );
      query.$and = [
        { "creatorProfile.followerRange.min": { $lte: max } },
        { "creatorProfile.followerRange.max": { $gte: min } },
      ];
    }

    if (filters.platforms) {
      query["creatorProfile.platforms"] = {
        $in: filters.platforms.split(","),
      };
    }

    // Sorting
    let sortOption = {};
    switch (filters.sort) {
      case "startDate-asc":
        sortOption["basics.startDate"] = 1;
        break;
      case "startDate-desc":
        sortOption["basics.startDate"] = -1;
        break;
      case "endDate-asc":
        sortOption["basics.endDate"] = 1;
        break;
      case "endDate-desc":
        sortOption["basics.endDate"] = -1;
        break;
      default:
        sortOption["basics.startDate"] = -1;
    }

    // Fetch campaigns and populate brandId
    let campaigns = await Campaign.find(query)
      .populate("brandId")
      .sort(sortOption)
      .lean();

    // Post-filter by brandName (after populate)
    if (filters.brandName) {
      const brandRegex = new RegExp(filters.brandName, "i");
      campaigns = campaigns.filter(
        (c) =>
          c.brandId &&
          c.brandId.brand &&
          c.brandId.brand.companyName &&
          brandRegex.test(c.brandId.brand.companyName)
      );
    }

    // Paginate after filtering
    const total = campaigns.length;
    const paginated = campaigns.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      total,
      data: paginated,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error("Campaign fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
