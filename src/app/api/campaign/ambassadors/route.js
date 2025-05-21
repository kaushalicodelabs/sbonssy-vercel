// pages/api/campaign/ambassadors.js
import { connectDB } from "@/lib/db";
import createClient from "@/lib/supabase/server";
import User from "@/models/User";
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
    if (!mongoUser || mongoUser.role !== "brand") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;

    const skip = (page - 1) * limit;

    const ambassadors = await User.find({
      role: "sports-ambassador",
      $or: [
        { athlete: { $exists: true, $ne: null } },
        { exAthlete: { $exists: true, $ne: null } },
        { paraAthlete: { $exists: true, $ne: null } },
        { coach: { $exists: true, $ne: null } },
        { team: { $exists: true, $ne: null } },
        { influencer: { $exists: true, $ne: null } },
      ],
    })
      .select("_id name email subRole")
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({
      role: "sports-ambassador",
      $or: [
        { athlete: { $exists: true, $ne: null } },
        { exAthlete: { $exists: true, $ne: null } },
        { paraAthlete: { $exists: true, $ne: null } },
        { coach: { $exists: true, $ne: null } },
        { team: { $exists: true, $ne: null } },
        { influencer: { $exists: true, $ne: null } },
      ],
    });

    const formattedAmbassadors = ambassadors.map((amb) => ({
      _id: amb._id.toString(),
      name: amb.name,
      email: amb.email,
      subRole: amb.subRole,
    }));

    return NextResponse.json(
      {
        data: {
          data: formattedAmbassadors,
          pagination: {
            total,
            page,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching ambassadors:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
