import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    basics: {
      campaignType: {
        type: String,
        enum: ["public", "apply", "private"],
        default: "public",
        required: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
      description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000,
      },
      startDate: {
        type: Date,
        required: function () {
          return !this.basics.isOngoing;
        },
      },
      endDate: {
        type: Date,
        required: function () {
          return !this.basics.isOngoing;
        },
        validate: {
          validator: function (value) {
            return !this.basics.startDate || value > this.basics.startDate;
          },
          message: "End date must be after start date",
        },
      },
      isOngoing: {
        type: Boolean,
        default: false,
      },
      targetRegions: [
        {
          type: String,
          enum: [
            "north_america",
            "europe",
            "asia",
            "africa",
            "south_america",
            "australia",
          ],
        },
      ],
    },
    creatorProfile: {
      followerRange: {
        min: {
          type: Number,
          required: true,
          min: 0,
        },
        max: {
          type: Number,
          required: true,
          min: 0,
          validate: {
            validator: function (value) {
              return value >= this.creatorProfile.followerRange.min;
            },
            message: "Max followers must be greater than min",
          },
        },
      },
      platforms: [
        {
          type: String,
          enum: ["instagram", "youtube", "tiktok", "twitter", "facebook"],
          required: true,
        },
      ],
      ambassadorTypes: [
        {
          type: String,
          enum: [
            "athlete",
            "team",
            "influencer",
            "para-athlete",
            "coach",
            "ex-athlete",
          ],
          required: true,
        },
      ],
      contentRequirements: {
        type: String,
        trim: true,
        maxlength: 2000,
      },
      requiresApproval: {
        type: Boolean,
        default: false,
      },
    },
    compensation: {
      type: {
        type: String,
        enum: ["pay-per-sale", "pay-per-click", "pay-per-lead", "flat-fee"],
        required: true,
      },
      commission: { type: Number, default: 0 },
      amount: { type: Number, default: 0 },
      gifting: { type: Boolean, default: false },
    },
    assets: {
      logos: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      photos: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      videos: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      styleGuide: {
        fonts: { type: String, trim: true, maxlength: 500 },
        colors: { type: String, trim: true, maxlength: 500 },
        guidelines: { type: String, trim: true, maxlength: 2000 },
      },
      examplePosts: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
          mediaType: { type: String, enum: ["image", "video"], required: true },
        },
      ],
    },
    goals: {
      clicks: { type: Number, min: 0 },
      sales: { type: Number, min: 0 },
      signups: { type: Number, min: 0 },
      budgetCap: { type: Number, min: 0 },
      products: [
        {
          name: { type: String, required: true, trim: true },
          description: { type: String, trim: true },
        },
      ],
      shippingRegions: [
        {
          type: String,
          enum: [
            "north_america",
            "europe",
            "asia",
            "africa",
            "south_america",
            "australia",
          ],
        },
      ],
      shippingRequirements: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
    },
    legal: {
      termsAgreed: {
        type: Boolean,
        required: true,
        validate: {
          validator: function (value) {
            return value === true;
          },
          message: "You must agree to the terms",
        },
      },
      ftcDisclosure: { type: Boolean, default: true },
      customTerms: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000,
      },
    },
    // status: {
    //   type: String,
    //   enum: ["draft", "active", "paused", "completed", "archived"],
    //   default: "draft",
    // },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
campaignSchema.index({ brandId: 1, status: 1 });
campaignSchema.index({ "basics.campaignType": 1, status: 1 });
campaignSchema.index({ "basics.startDate": 1, "basics.endDate": 1 });
campaignSchema.index({ "creatorProfile.platforms": 1 });
campaignSchema.index({ "compensation.type": 1 });

// Virtual for campaign duration (only for non-ongoing campaigns)
campaignSchema.virtual("durationDays").get(function () {
  if (this.basics.isOngoing || !this.basics.startDate || !this.basics.endDate) {
    return null;
  }
  const diffTime = Math.abs(this.basics.endDate - this.basics.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

export default mongoose.models.Campaign ||
  mongoose.model("Campaign", campaignSchema);
