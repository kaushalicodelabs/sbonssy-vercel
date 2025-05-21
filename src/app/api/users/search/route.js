import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const role = searchParams.get("role");

  if (!query) {
    return new Response(JSON.stringify({ error: "Query is required" }), {
      status: 400,
    });
  }

  try {
    const searchConditions = [
      {
        $or: [
          { email: { $regex: query, $options: "i" } },
          { "brand.name": { $regex: query, $options: "i" } },
          { "athlete.name": { $regex: query, $options: "i" } },
          { "team.name": { $regex: query, $options: "i" } },
          { "influencer.name": { $regex: query, $options: "i" } },
          { "exAthlete.name": { $regex: query, $options: "i" } },
          { "paraAthlete.name": { $regex: query, $options: "i" } },
          { "coach.name": { $regex: query, $options: "i" } },
          { "brand.companyName": { $regex: query, $options: "i" } },
          { "team.teamClubName": { $regex: query, $options: "i" } },
          { "athlete.teamClubName": { $regex: query, $options: "i" } },
          { "baseProfile.interests": { $regex: query, $options: "i" } },
          { "brand.valuesAndInterests": { $regex: query, $options: "i" } },
          { "fan.interests": { $regex: query, $options: "i" } },
        ],
      },
    ];

    if (role) {
      searchConditions.push({ role });
    }

    const users = await User.find({
      $and: searchConditions,
    }).select(
      "_id email role athlete team influencer brand exAthlete paraAthlete coach fan images"
    );

    const formattedUsers = users.map((user) => {
      let name = "";
      let profileData = {};

      switch (user.role) {
        case "brand":
          name = user.brand?.name || user.brand?.companyName || user.email;
          profileData = user.brand || {};
          break;
        case "athlete":
        case "sports-ambassador":
          name = user.athlete?.name || user.email;
          profileData = user.athlete || {};
          break;
        case "team":
          name = user.team?.name || user.team?.teamClubName || user.email;
          profileData = user.team || {};
          break;
        case "influencer":
          name = user.influencer?.name || user.email;
          profileData = user.influencer || {};
          break;
        case "exAthlete":
          name = user.exAthlete?.name || user.email;
          profileData = user.exAthlete || {};
          break;
        case "paraAthlete":
          name = user.paraAthlete?.name || user.email;
          profileData = user.paraAthlete || {};
          break;
        case "coach":
          name = user.coach?.name || user.email;
          profileData = user.coach || {};
          break;
        default:
          name = user.email;
      }

      return {
        _id: user._id,
        id: user._id,
        email: user.email,
        role: user.role,
        name,
        images: user.images || [],
        ...profileData,
      };
    });

    return new Response(JSON.stringify(formattedUsers), { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return new Response(JSON.stringify({ error: "Failed to search users" }), {
      status: 500,
    });
  }
}
