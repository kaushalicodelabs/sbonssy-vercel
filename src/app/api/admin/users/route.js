import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import createClient from "@/lib/supabase/server";

export async function GET(request) {
  try {
    // Initialize Supabase client and get session
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin using is_super_admin from user_metadata
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user?.user_metadata?.is_super_admin) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    await connectDB();

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const role = searchParams.get("role") || null;
    const skip = (page - 1) * limit;

    // Build MongoDB query
    const query = { role: { $ne: "Admin" } }; // Exclude Admin role
    if (role && ["fan", "sports-ambassador", "brand"].includes(role)) {
      query.role = role;
    }

    // Fetch users
    const users = await User.find(query)
      .select(
        "email name supabaseId authProvider role subRole createdAt updatedAt"
      )
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await User.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: {
          users,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
