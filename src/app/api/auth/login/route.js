import { NextResponse } from "next/server";
import createClient from "@/lib/supabase/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

/**
 * Handles POST requests for user login using Supabase authentication.
 * Verifies credentials and returns user data from MongoDB if authenticated.
 *
 * @param {Request} request - The incoming request object containing email and password
 * @returns {NextResponse} - JSON response with user data or an error message
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Authenticate user with Supabase
    const supabase = await createClient();
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Connect to MongoDB and retrieve the user by supabaseId
    await connectDB();
    const mongoUser = await User.findOne({
      supabaseId: authData.user.id,
    }).lean();

    if (!mongoUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Construct user response object
    const userData = {
      id: authData.user.id,
      email: authData.user.email,
      role: mongoUser.role,
      name: mongoUser.name || authData.user.user_metadata?.name || "",
      isProfileCompleted: mongoUser.isProfileCompleted,
    };

    return NextResponse.json({ data: { user: userData } });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error: " + error.message },
      { status: 500 }
    );
  }
}
