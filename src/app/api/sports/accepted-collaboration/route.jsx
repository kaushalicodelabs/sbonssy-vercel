// import { connectDB } from "@/lib/db";
// import createClient from "@/lib/supabase/server";

// import { CollaborationRequest } from "@/models/CollaborationRequest";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   try {
//     await connectDB();
//     const supabase = await createClient();

//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user?.id) {
//       return new Response(
//         JSON.stringify({ message: "Unauthorized: Authentication failed" }),
//         { status: 401 }
//       );
//     }
//     const ambassador = await User.findOne({ supabaseId: user.id });

//     // const { searchParams } = new URL(request.url);
//     // const page = parseInt(searchParams.get("page2") || "1", 10);
//     // // const limit = parseInt(searchParams.get("limit") || "10", 10);
//     // const limit = 1;
//     // const skip = (page - 1) * limit;

//     const acceptedRequests = await CollaborationRequest.find({
//       status: "accepted",
//       ambassadorId: ambassador._id,
//     });

//     const acceptedCollaborationIds = acceptedRequests.map((req) =>
//       req.ambassadorId.toString()
//     );

//     const total = await CollaborationRequest.countDocuments({
//       status: "accepted",
//       ambassadorId: ambassador._id,
//     });

//     const data = await User.find({
//       role: "sports-ambassador",
//       _id: { $in: acceptedCollaborationIds },
//       // isProfileCompleted: true,
//     });
//     // .skip(skip)
//     // .limit(limit);
//     console.log(data, "data");
//     return new Response(JSON.stringify({ data, total }), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching sports ambassadors:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to fetch sports ambassadors" }),
//       { status: 500 }
//     );
//   }
// }
import { connectDB } from "@/lib/db";
import createClient from "@/lib/supabase/server";

import { CollaborationRequest } from "@/models/CollaborationRequest";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return new Response(
        JSON.stringify({ message: "Unauthorized: Authentication failed" }),
        { status: 401 }
      );
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const ambassador = await User.findOne({ supabaseId: user.id });
    const acceptedRequests = await CollaborationRequest.find({
      status: "accepted",
      ambassadorId: ambassador._id,
    }).populate("brandId"); // Populate the brand details directly

    const acceptedBrandIds = acceptedRequests.map((req) =>
      req.brandId._id.toString()
    );

    const brands = await User.find({
      role: "brand",
      _id: { $in: acceptedBrandIds },
    })
      .limit(limit)
      .skip(skip);

    return new Response(
      JSON.stringify({
        data: brands,
        total: acceptedRequests.length,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching accepted brands:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch accepted brands" }),
      { status: 500 }
    );
  }
}
