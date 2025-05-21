import axios from "axios";
export const uploadToCloudinary = async ({
  file,
  folder = "default-folder",
  resourceType = "image",
  width = 1080, // Set desired width
  height = 1080, // Set desired height
  crop = "fill", // Ensures the image is resized properly
}) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append("folder", folder);
  // formData.append(
  //   "transformation",
  //   JSON.stringify([{ width, height, crop }])
  // );
  // formData.append("width", width);
  // formData.append("height", height);

  // formData.append("crop", crop);
  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    formData
  );

  const transformedUrl = response.data.secure_url.replace(
    "/upload/",
    "/upload/w_1080,h_1080,c_fill/"
  );

  // return response.data.secure_url;
  return {
    url: transformedUrl,
    publicId: response.data.public_id,
    isProfile: false,
  };
  // return transformedUrl;
};
export const sports = [
  "Martial arts",
  "Alpine skiing",
  "American Football",
  "Archery",
  "Artistic Swimming",
  "Athletics",
  "Badminton",
  "Bandy",
  "Baseball",
  "Basketball",
  "Beach volleyball",
  "Biathlon",
  "Bowling",
  "Canoeing and Kayaking",
  "Cheerleading",
  "Climbing",
  "Cricket",
  "Cross-country running",
  "Cross-Country Skiing",
  "CrossFit",
  "Curling",
  "Cycling",
  "Dance",
  "Darts",
  "Disc golf",
  "Diving",
  "E-Sports",
  "Equestrian",
  "Fencing",
  "Figure skating",
  "Finnish baseball",
  "Fitness",
  "Floorball",
  "Football",
  "Freestyle skiing",
  "Futsal",
  "Golf",
  "Gymnastics",
  "Handball",
  "Ice hockey",
  "Lacrosse",
  "Motorsports",
  "Nordic combined",
  "Orienteering",
  "Other",
  "Padel",
  "Polo",
  "Pool",
  "Ringette",
  "Rowing",
  "Rugby",
  "Sailing",
  "Shooting sport",
  "Skateboarding",
  "Ski jumping",
  "Snowboarding",
  "Squash",
  "Surfing",
  "Swimming",
  "Synchronized skating",
  "Table tennis",
  "Tennis",
  "Triathlon",
  "Volleyball",
  "Water polo",
  "Weight lifting",
  "Yoga",
];
export const interestOptions = [
  {
    label: "Sports & Fitness",
    options: [
      { value: "Fitness", label: "Fitness" },
      { value: "Yoga", label: "Yoga" },
      { value: "Martial Arts", label: "Martial Arts" },
      { value: "Team Sports", label: "Team Sports" },
      { value: "Extreme Sports", label: "Extreme Sports" },
    ],
  },
  {
    label: "Creativity & Culture",
    options: [
      { value: "Art", label: "Art" },
      { value: "Photography", label: "Photography" },
      { value: "Music", label: "Music" },
      { value: "Reading", label: "Reading" },
      { value: "Fashion", label: "Fashion" },
      { value: "Writing", label: "Writing" },
    ],
  },
  {
    label: "Adventure & Lifestyle",
    options: [
      { value: "Travel", label: "Travel" },
      { value: "Cooking", label: "Cooking" },
      { value: "Gaming", label: "Gaming" },
      { value: "Technology", label: "Technology" },
    ],
  },
];

export const companyInterest = [
  "Sports & Fitness",
  "Wellbeing & Recovery",
  "Creativity & Culture",
  "Sustainable Living & Values",
  "Science, Tech & Learning",
  "Hobbies & Everyday Life",
  "Adventure & Experiences",
  "Entertainment & Digital Life",
];

export const checkOptions = [
  "Just me",
  "2-10",
  "11-50",
  "51-100",
  "101-500",
  "501+",
];

/**
 * Computes whether a user's profile is completed based on their role and subRole.
 * The function checks various fields in the user object to determine if their profile is considered completed.
 *
 * @param {Object} user - The user object to check the profile completion for.
 * @param {string} user.role - The user's main role (e.g., "sports-ambassador", "brand", "fan", "admin").
 * @param {string} [user.subRole] - The user's subRole, applicable for certain roles like "athlete", "team", "influencer".
 * @param {Object} [user.athlete] - The athlete profile details (if the user is an athlete).
 * @param {Object} [user.team] - The team profile details (if the user is part of a team).
 * @param {Object} [user.influencer] - The influencer profile details (if the user is an influencer).
 * @param {Object} [user.brand] - The brand profile details (if the user is a brand).
 * @param {Object} [user.fan] - The fan profile details (if the user is a fan).
 * @param {Object} [user.admin] - The admin profile details (if the user is an admin).
 * @returns {boolean} - Returns true if the profile is considered completed, false otherwise.
 */
export const computeIsProfileCompleted = (user) => {
  const {
    role,
    subRole,
    athlete,
    team,
    influencer,
    brand,
    fan,
    admin,
    exAthlete,
    paraAthlete,
    coach,
  } = user;

  // Helper function to check if socialMedia has at least one valid link
  const hasValidSocialMedia = (socialMedia) => {
    if (!socialMedia) return false;
    return Object.values(socialMedia).some(
      (link) => typeof link === "string" && link.trim() !== ""
    );
  };

  let isProfileCompleted = false;
  if (role === "sports-ambassador") {
    if (subRole === "athlete" && athlete) {
      isProfileCompleted =
        // !!athlete.name &&
        !!athlete.gender &&
        !!athlete.sport &&
        !!athlete.level &&
        !!athlete.teamClubName &&
        !!athlete.location &&
        !!athlete.biography &&
        athlete.images?.length > 0 &&
        athlete.images.some((img) => !!img.url) &&
        // hasValidSocialMedia(athlete.socialMedia) &&
        athlete.interests?.length > 0;
    } else if (subRole === "ex-athlete" && exAthlete) {
      isProfileCompleted =
        // !!athlete.name &&
        !!exAthlete.gender &&
        !!exAthlete.sport &&
        !!exAthlete.level &&
        !!exAthlete.teamClubName &&
        !!exAthlete.location &&
        !!exAthlete.biography &&
        exAthlete.images?.length > 0 &&
        exAthlete.images.some((img) => !!img.url) &&
        // hasValidSocialMedia(exAthlete.socialMedia) &&
        exAthlete.interests?.length > 0;
    } else if (subRole === "para-athlete" && paraAthlete) {
      isProfileCompleted =
        // !!athlete.name &&
        !!paraAthlete.gender &&
        !!paraAthlete.sport &&
        !!paraAthlete.level &&
        !!paraAthlete.teamClubName &&
        !!paraAthlete.location &&
        !!paraAthlete.biography &&
        paraAthlete.images?.length > 0 &&
        paraAthlete.images.some((img) => !!img.url) &&
        // hasValidSocialMedia(paraAthlete.socialMedia) &&
        paraAthlete.interests?.length > 0;
    } else if (subRole === "coach" && coach) {
      isProfileCompleted =
        // !!athlete.name &&
        !!coach.gender &&
        !!coach.sport &&
        !!coach.level &&
        !!coach.teamClubName &&
        !!coach.location &&
        !!coach.biography &&
        coach.images?.length > 0 &&
        coach.images.some((img) => !!img.url) &&
        // hasValidSocialMedia(coach.socialMedia) &&
        coach.interests?.length > 0;
    } else if (subRole === "team" && team) {
      isProfileCompleted =
        // !!team.name &&
        !!team.teamClubName &&
        team.sports?.length > 0 &&
        !!team.level &&
        !!team.location &&
        !!team.biography &&
        team.images?.length > 0 &&
        team.images.some((img) => !!img.url) &&
        hasValidSocialMedia(team.socialMedia) &&
        team.interests?.length > 0;
    } else if (subRole === "influencer" && influencer) {
      isProfileCompleted =
        // !!influencer.name &&
        !!influencer.gender &&
        !!influencer.location &&
        !!influencer.biography &&
        influencer.images?.length > 0 &&
        influencer.images.some((img) => !!img.url) &&
        // hasValidSocialMedia(influencer.socialMedia) &&
        influencer.interests?.length > 0;
    }
  } else if (role === "brand" && brand) {
    isProfileCompleted =
      !!brand.currentJobTitle &&
      !!brand.companyName &&
      !!brand.intro &&
      brand.valuesAndInterests?.length > 0 &&
      !!brand.companyLogo &&
      !!brand.websiteUrl;
  } else if (role === "fan" && fan) {
    isProfileCompleted = fan.interests?.length > 0;
  } else if (role === "admin" && admin) {
    isProfileCompleted = admin.permissions?.length > 0;
  }

  return isProfileCompleted;
};

/**
 * Capitalizes the first letter of a given string.
 *
 * @param {string} str - The input string to capitalize.
 * @returns {string} The string with the first letter capitalized.
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function toCamelCase(str) {
  if (!str) return "";
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
}
