import { NextResponse } from "next/server";
import createClient from "@/lib/supabase/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import TempAuthState from "@/models/TempAuthState";

/**
 * Handles the OAuth callback by verifying the state and code,
 * exchanging the code for a Supabase session, storing user info in MongoDB,
 * and redirecting the user based on their role.
 *
 * @param {Request} request - The incoming request object
 * @returns {NextResponse} - Redirect response to appropriate page
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const code = searchParams.get("code");

    // Validate query parameters
    if (!state || !code) {
      return NextResponse.redirect(
        "http://localhost:3000/login?error=Authentication failed"
      );
    }

    // Connect to MongoDB and retrieve temporary auth state
    await connectDB();
    const authState = await TempAuthState.findOne({ state });
    if (!authState) {
      return NextResponse.redirect(
        "http://localhost:3000/login?error=Invalid state"
      );
    }

    const role = authState.role;

    // Remove used temporary auth state
    await TempAuthState.deleteOne({ state });

    // Exchange authorization code for Supabase session
    const supabase = createClient();
    const { data: sessionData, error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code);

    // Handle failed session exchange
    if (sessionError || !sessionData.session) {
      return NextResponse.redirect(
        "http://localhost:3000/login?error=Authentication failed"
      );
    }

    const user = sessionData.session.user;

    // Check if user exists in MongoDB, otherwise create a new one
    let mongoUser;
    try {
      mongoUser = await User.findOne({ supabaseId: user.id });
      if (!mongoUser) {
        mongoUser = await User.create({
          email: user.email,
          supabaseId: user.id,
          authProvider: "google",
          role,
          name: user.user_metadata?.name || "",
        });
      }
    } catch (error) {
      // Handle duplicate key error
      if (error.code === 11000) {
        mongoUser = await User.findOne({ supabaseId: user.id });
      } else {
        return NextResponse.redirect(
          "http://localhost:3000/login?error=Failed to create user"
        );
      }
    }

    // Determine redirect path based on role
    const redirectUrl =
      mongoUser.role !== "fan" ? `/onboarding/${mongoUser.role}` : "/";

    // Redirect to appropriate page
    return NextResponse.redirect(`http://localhost:3000${redirectUrl}`);
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.redirect(
      "http://localhost:3000/login?error=An unexpected error occurred"
    );
  }
}
