import { NextResponse } from "next/server";
import createClient from "@/lib/supabase/server";
import { connectDB } from "@/lib/db";
import TempAuthState from "@/models/TempAuthState";
import crypto from "crypto";

/**
 * Handles a POST request to initiate Google OAuth flow with a given user role.
 * Generates a secure state token, stores the role temporarily in MongoDB, and
 * returns the Google OAuth URL for redirection.
 *
 * @param {Request} request - The incoming request object
 * @returns {NextResponse} - A JSON response with the OAuth URL or error message
 */
export async function POST(request) {
  try {
    const { role } = await request.json();

    // Validate required role
    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    // Ensure the role is one of the allowed values
    const validRoles = ["admin", "fan", "sports-ambassador", "brand"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Generate a secure random state token for OAuth
    const state = crypto.randomBytes(16).toString("hex");

    // Store the role and state temporarily in MongoDB
    await connectDB();
    await TempAuthState.create({
      state,
      role,
      createdAt: new Date(),
    });

    const supabase = await createClient();

    // Generate Google OAuth URL with the state
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/api/auth/callback`,
        queryParams: { state },
      },
    });

    // Handle any errors returned by Supabase
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return the URL for the client to redirect to
    return NextResponse.json({ url: data.url });
  } catch (error) {
    // Return a server error message
    return NextResponse.json(
      { error: "Server error: " + error.message },
      { status: 500 }
    );
  }
}
