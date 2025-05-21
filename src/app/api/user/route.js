import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import createClient from "@/lib/supabase/server";
import { computeIsProfileCompleted } from "@/lib/helper";

export async function POST(request) {
  try {
    const { email, supabaseId, authProvider, role } = await request.json();

    // Validate role
    const validRoles = ["admin", "fan", "sports-ambassador", "brand"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid or missing role" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const newUserData = {
        email,
        supabaseId,
        authProvider,
        role,
        isProfileCompleted: false, // New users start with incomplete profile
      };
      const newUser = await User.create(newUserData);
      return NextResponse.json({ success: true, data: newUser });
    }

    // Ensure isProfileCompleted is computed for existing user
    const isProfileCompleted = computeIsProfileCompleted(existingUser);
    if (existingUser.isProfileCompleted !== isProfileCompleted) {
      await User.findOneAndUpdate(
        { email },
        { $set: { isProfileCompleted } },
        { new: true }
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...existingUser.toObject(), isProfileCompleted },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const supabaseId = searchParams.get("supabaseId");

    if (!supabaseId) {
      return NextResponse.json(
        { error: "supabaseId is required" },
        { status: 400 }
      );
    }

    await connectDB();
    let user = await User.findOne({ supabaseId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Compute isProfileCompleted
    const isProfileCompleted = computeIsProfileCompleted(user);

    // Update isProfileCompleted in the database if it differs
    if (user.isProfileCompleted !== isProfileCompleted) {
      user = await User.findOneAndUpdate(
        { supabaseId },
        { $set: { isProfileCompleted } },
        { new: true }
      );
    }

    return NextResponse.json(
      { data: { ...user.toObject(), isProfileCompleted } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      role,
      subRole,
      athlete,
      team,
      influencer,
      brand,
      fan,
      admin,
      paraAthlete,
      exAthlete,
      coach,
    } = await request.json();

    // Validate role
    const validRoles = ["admin", "fan", "sports-ambassador", "brand"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid or missing role" },
        { status: 400 }
      );
    }

    // Validate subRole for Sports Ambassador
    if (role === "sports-ambassador") {
      const validSubRoles = [
        "athlete",
        "team",
        "influencer",
        "coach",
        "ex-athlete",
        "para-athlete",
      ];
      if (!subRole || !validSubRoles.includes(subRole)) {
        return NextResponse.json(
          { error: "Invalid or missing subRole" },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Find user by supabaseId
    const user = await User.findOne({ supabaseId: session.user.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Normalize data for athlete
    if (subRole === "athlete" && athlete) {
      if (!athlete.gender) {
        return NextResponse.json(
          { error: "Gender is required for athlete" },
          { status: 400 }
        );
      }
      athlete.gender = athlete.gender.toLowerCase();
      if (athlete.images) {
        athlete.images = athlete.images.map((img, index) => ({
          url: img.url,
          isProfile: img.isProfile || index === 0,
          publicId: img.publicId || "",
        }));
      }
    } else if (subRole === "team" && team) {
      // No gender field for team
      if (team.images) {
        team.images = team.images.map((img, index) => ({
          url: img.url,
          isProfile: img.isProfile || index === 0,
          publicId: img.publicId || "",
        }));
      }
    } else if (subRole === "influencer" && influencer) {
      if (!influencer.gender) {
        return NextResponse.json(
          { error: "Gender is required for influencer" },
          { status: 400 }
        );
      }
      influencer.gender = influencer.gender.toLowerCase();
      if (influencer.images) {
        influencer.images = influencer.images.map((img, index) => ({
          url: img.url,
          isProfile: img.isProfile || index === 0,
          publicId: img.publicId || "",
        }));
      }
    } else if (subRole === "coach" && coach) {
      if (!coach.gender) {
        return NextResponse.json(
          { error: "Gender is required for coach" },
          { status: 400 }
        );
      }
      coach.gender = coach.gender.toLowerCase();
      if (coach.images) {
        coach.images = coach.images.map((img, index) => ({
          url: img.url,
          isProfile: img.isProfile || index === 0,
          publicId: img.publicId || "",
        }));
      }
    } else if (subRole === "ex-athlete" && exAthlete) {
      if (!exAthlete.gender) {
        return NextResponse.json(
          { error: "Gender is required for ex-athlete" },
          { status: 400 }
        );
      }
      exAthlete.gender = exAthlete.gender.toLowerCase();
      if (exAthlete.images) {
        exAthlete.images = exAthlete.images.map((img, index) => ({
          url: img.url,
          isProfile: img.isProfile || index === 0,
          publicId: img.publicId || "",
        }));
      }
    } else if (subRole === "para-athlete" && paraAthlete) {
      if (!paraAthlete.gender) {
        return NextResponse.json(
          { error: "Gender is required for para-athlete" },
          { status: 400 }
        );
      }
      paraAthlete.gender = paraAthlete.gender.toLowerCase();
      if (paraAthlete.images) {
        paraAthlete.images = paraAthlete.images.map((img, index) => ({
          url: img.url,
          isProfile: img.isProfile || index === 0,
          publicId: img.publicId || "",
        }));
      }
    }

    // Update fields conditionally
    const updateData = { role, subRole };
    if (role === "sports-ambassador") {
      if (subRole === "athlete") updateData.athlete = athlete;
      else if (subRole === "team") updateData.team = team;
      else if (subRole === "influencer") updateData.influencer = influencer;
      else if (subRole === "coach") updateData.coach = coach;
      else if (subRole === "para-athlete") updateData.paraAthlete = paraAthlete;
      else if (subRole === "ex-athlete") updateData.exAthlete = exAthlete;
    } else if (role === "brand") {
      updateData.brand = brand;
    } else if (role === "fan") {
      updateData.fan = fan;
    } else if (role === "admin") {
      updateData.admin = admin;
    }

    // Compute isProfileCompleted
    const updatedUserData = { ...user.toObject(), ...updateData };
    updateData.isProfileCompleted = computeIsProfileCompleted(updatedUserData);

    const updatedUser = await User.findOneAndUpdate(
      { supabaseId: session.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
