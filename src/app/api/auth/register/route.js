import { connectDB } from "@/lib/db";
import createClient from "@/lib/supabase/server";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["admin", "fan", "sports-ambassador", "brand"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const supabase = await createClient();
    // Sign up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Registration failed" },
        { status: 400 }
      );
    }

    // Create user in MongoDB
    await connectDB();
    const mongoUser = await User.create({
      email,
      supabaseId: authData.user.id,
      authProvider: "email",
      role,
      name: authData.user.user_metadata?.name || "",
      isProfileCompleted: false, // Explicitly set to false for new users
    });

    // Auto-login to create a session
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      return NextResponse.json({ error: loginError.message }, { status: 400 });
    }

    // Return user data including isProfileCompleted
    const user = {
      id: authData.user.id,
      email,
      role,
      name: authData.user.user_metadata?.name || "",
      isProfileCompleted: mongoUser.isProfileCompleted,
    };

    return NextResponse.json({ data: { user } }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Server error: " + error.message },
      { status: 500 }
    );
  }
}
