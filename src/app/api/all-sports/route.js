import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// List of all possible subRoles
const ALL_SUB_ROLES = [
  "influencer",
  "coach",
  "athlete",
  "paraAthlete",
  "exAthlete",
  "team",
];

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Extract filters
    let subRole = searchParams.get("subRole");
    const sport = searchParams.get("sport");
    const level = searchParams.get("level");
    const gender = searchParams.get("gender");
    const location = searchParams.get("location");
    const interests = searchParams.get("interests");
    const socialMedia = searchParams.get("socialMedia");
    const sort = searchParams.get("sort") || "name-asc";

    // Validate sort parameter
    if (!["name-asc", "name-desc"].includes(sort)) {
      return NextResponse.json(
        { success: false, error: "Invalid sort parameter" },
        { status: 400 }
      );
    }

    // Transform subRole for specific cases
    const isOnlySubRoleFilter =
      subRole &&
      !sport &&
      !level &&
      !gender &&
      !location &&
      !interests &&
      !socialMedia;

    if (isOnlySubRoleFilter) {
      if (subRole === "paraAthlete") {
        subRole = "para-athlete";
      } else if (subRole === "exAthlete") {
        subRole = "ex-athlete";
      }
    }

    // Build base query
    const query = {
      role: "sports-ambassador",
      isProfileCompleted: true,
    };

    // Add subRole filter if provided
    if (subRole) {
      query.subRole = subRole;
    }

    // Helper function to build OR queries across all subRoles
    const buildSubRoleOrQuery = (
      field,
      value,
      isRegex = false,
      isArray = false
    ) => {
      const conditions = ALL_SUB_ROLES.map((role) => {
        const fieldPath = `${role}.${field}`;
        if (isArray) {
          return { [fieldPath]: { $in: value.split(",") } };
        }
        if (isRegex) {
          return { [fieldPath]: { $regex: value, $options: "i" } };
        }
        return { [fieldPath]: value };
      });
      return { $or: conditions };
    };

    // Handle sport filter
    if (sport) {
      if (subRole) {
        query[`${subRole}.sport`] = { $regex: sport, $options: "i" };
      } else {
        Object.assign(query, buildSubRoleOrQuery("sport", sport, true));
      }
    }

    // Handle level filter
    if (level) {
      if (subRole) {
        query[`${subRole}.level`] = level;
      } else {
        Object.assign(query, buildSubRoleOrQuery("level", level));
      }
    }

    // Handle gender filter
    if (gender) {
      if (subRole) {
        query[`${subRole}.gender`] = gender;
      } else {
        Object.assign(query, buildSubRoleOrQuery("gender", gender));
      }
    }

    // Handle location filter
    if (location) {
      if (subRole) {
        query[`${subRole}.location.locationName`] = {
          $regex: location,
          $options: "i",
        };
      } else {
        const conditions = ALL_SUB_ROLES.map((role) => ({
          [`${role}.location.locationName`]: {
            $regex: location,
            $options: "i",
          },
        }));
        query.$or = conditions;
      }
    }

    // Handle interests filter
    if (interests) {
      if (subRole) {
        query[`${subRole}.interests`] = { $in: interests.split(",") };
      } else {
        Object.assign(
          query,
          buildSubRoleOrQuery("interests", interests, false, true)
        );
      }
    }

    // Handle social media filter
    if (socialMedia) {
      const platforms = socialMedia.split(",");
      if (subRole) {
        query.$or = platforms.map((platform) => ({
          [`${subRole}.socialMedia.${platform}`]: { $exists: true, $ne: "" },
        }));
      } else {
        query.$or = platforms.flatMap((platform) =>
          ALL_SUB_ROLES.map((role) => ({
            [`${role}.socialMedia.${platform}`]: { $exists: true, $ne: "" },
          }))
        );
      }
    }

    // Build aggregation pipeline
    const pipeline = [
      { $match: query },
      // Add computed name field
      {
        $addFields: {
          computedName: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$subRole", "athlete"] },
                  then: "$athlete.name",
                },
                {
                  case: { $eq: ["$subRole", "ex-athlete"] },
                  then: "$exAthlete.name",
                },
                {
                  case: { $eq: ["$subRole", "para-athlete"] },
                  then: "$paraAthlete.name",
                },
                { case: { $eq: ["$subRole", "coach"] }, then: "$coach.name" },
                { case: { $eq: ["$subRole", "team"] }, then: "$team.name" },
                {
                  case: { $eq: ["$subRole", "influencer"] },
                  then: "$influencer.name",
                },
              ],
              default: null,
            },
          },
        },
      },
      // Exclude documents with no computedName
      { $match: { computedName: { $ne: null } } },
      // Sort by computedName
      {
        $sort: {
          computedName: sort === "name-asc" ? 1 : -1,
        },
      },
      // Pagination
      { $skip: skip },
      { $limit: limit },
    ];

    const data = await User.aggregate(pipeline).collation({
      locale: "en",
      strength: 2,
    });
    const total = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      total,
      data,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error("Sports ambassadors fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
