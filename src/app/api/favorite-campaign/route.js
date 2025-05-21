import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import FavoriteCampaign from "@/models/FavoriteCampaign";
import User from "@/models/User";
import createClient from "@/lib/supabase/server";

export async function POST(request) {
  try {
    await connectDB();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { campaignId, action } = await request.json();

    if (!campaignId) {
      return NextResponse.json(
        { message: "Campaign ID is required" },
        { status: 400 }
      );
    }

    const mongoUser = await User.findOne({ supabaseId: user.id });
    if (!mongoUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (action === "add") {
      // Check if already favorited
      const existingFavorite = await FavoriteCampaign.findOne({
        userId: mongoUser._id,
        campaignId,
      });

      if (existingFavorite) {
        return NextResponse.json(
          { message: "Campaign already favorited" },
          { status: 400 }
        );
      }

      const favorite = await FavoriteCampaign.create({
        userId: mongoUser._id,
        campaignId,
      });

      return NextResponse.json(
        {
          data: {
            message: "Campaign added to favorites",
            data: favorite,
            success: true,
            action: "added",
          },
        },
        { status: 200 }
      );
    } else if (action === "remove") {
      const result = await FavoriteCampaign.deleteOne({
        userId: mongoUser._id,
        campaignId,
      });

      if (result.deletedCount === 0) {
        return NextResponse.json(
          { message: "Campaign not found in favorites" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          data: {
            message: "Campaign removed from favorites",
            success: true,
            action: "removed",
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mongoUser = await User.findOne({ supabaseId: user.id });
    if (!mongoUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const favorites = await FavoriteCampaign.find({ userId: mongoUser._id })
      .populate({
        path: "campaignId",
        select: "basics assets brandId",
        populate: {
          path: "brandId",
          select: "brand.companyName",
        },
      })
      .lean();

    const formattedFavorites = favorites.map((fav) => ({
      _id: fav.campaignId._id.toString(),
      basics: fav.campaignId.basics,
      assets: fav.campaignId.assets,
      brandId: fav.campaignId.brandId?._id.toString(),
      brandName: fav.campaignId.brandId?.brand?.companyName,
    }));

    return NextResponse.json(
      { data: { data: formattedFavorites, success: true } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
