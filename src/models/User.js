import mongoose from "mongoose";

const socialMediaSchema = new mongoose.Schema(
  {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    youtube: { type: String, trim: true },
    website: { type: String, trim: true },
  },
  { _id: false }
);
const locationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    locationName: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String },
    isProfile: { type: Boolean, default: false },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const baseProfileSchema = new mongoose.Schema(
  {
    biography: { type: String, trim: true },
    achievements: { type: String, trim: true },
    records: { type: String, trim: true },
    goals: { type: String, trim: true },
    interests: [String],
    images: [imageSchema],
    socialMedia: socialMediaSchema,
  },
  { _id: false }
);

const athleteSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    gender: { type: String },
    sport: { type: String },
    level: { type: String },
    teamClubName: { type: String, trim: true },
    location: locationSchema,
  },
  { _id: false }
).add(baseProfileSchema);
const exAthleteSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    gender: { type: String },
    sport: { type: String },
    level: { type: String },
    teamClubName: { type: String, trim: true },
    location: locationSchema,
  },
  { _id: false }
).add(baseProfileSchema);
const paraAthleteSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    gender: { type: String },
    sport: { type: String },
    level: { type: String },
    teamClubName: { type: String, trim: true },
    location: locationSchema,
  },
  { _id: false }
).add(baseProfileSchema);
const coachSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    gender: { type: String },
    sport: { type: String },
    level: { type: String },
    teamClubName: { type: String, trim: true },
    location: locationSchema,
  },
  { _id: false }
).add(baseProfileSchema);

const teamSchema = new mongoose.Schema(
  {
    subRole: { type: String },
    name: { type: String, trim: true },
    teamClubName: { type: String, trim: true },
    sports: [String],
    level: { type: String },
    location: locationSchema,
  },
  { _id: false }
).add(baseProfileSchema);

const influencerSchema = new mongoose.Schema(
  {
    subRole: { type: String },
    name: { type: String, trim: true },
    gender: { type: String },
    location: locationSchema,
  },
  { _id: false }
).add(baseProfileSchema);

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    currentJobTitle: { type: String, trim: true },
    companyName: { type: String, trim: true },
    vatNumber: { type: String, trim: true },
    websiteUrl: { type: String, trim: true },
    intro: { type: String, trim: true },
    valuesAndInterests: [String],
    companyLogo: { type: String },
    workingPeople: { type: String },
    howDidYouHear: { type: String },
  },
  { _id: false }
);

const fanSchema = new mongoose.Schema(
  {
    favoriteTeams: [{ type: String, trim: true }],
    interests: [String],
  },
  { _id: false }
);

const adminSchema = new mongoose.Schema(
  {
    permissions: [String],
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String },
    supabaseId: { type: String },
    authProvider: { type: String },
    role: { type: String },
    isProfileCompleted: { type: Boolean, default: false },
    subRole: { type: String },
    athlete: { type: athleteSchema },
    team: { type: teamSchema },
    influencer: { type: influencerSchema },
    brand: { type: brandSchema },
    exAthlete: { type: exAthleteSchema },
    paraAthlete: { type: paraAthleteSchema },
    coach: { type: coachSchema },
    fan: { type: fanSchema },
    admin: { type: adminSchema },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
