// models/CampaignInteraction.js
import mongoose from "mongoose";

const campaignInteractionSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interactionType: {
      type: String,
      enum: ["apply", "public", "private"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "not_applied",
        "pending",
        "accepted",
        "rejected", // apply
        "active",
        "inactive", // public
        "declined", // private (pending and accepted already included)
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CampaignInteraction ||
  mongoose.model("CampaignInteraction", campaignInteractionSchema);
