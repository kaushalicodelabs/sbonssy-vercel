import { NextResponse } from "next/server";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import axios from "axios";
import Campaign from "@/models/Campaign";
import Visits from "@/models/Visits";

// Connect to MongoDB

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Rate limiter middleware (adapted for Next.js)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: () => {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  },
});

// Middleware wrapper for rate limiting
async function applyRateLimit(req) {
  return new Promise((resolve, reject) => {
    limiter(req, {}, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function GET(req) {
  try {
    // Apply rate limiting
    await applyRateLimit(req);

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");
    const promoCode = searchParams.get("promoCode");

    // Validate campaignId
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return NextResponse.json(
        { error: "Invalid campaignId" },
        { status: 400 }
      );
    }

    // Check if campaign exists and is active
    const campaign = await Campaign.findOne({
      _id: campaignId,
      status: { $in: ["active", "draft"] },
    });
    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found or inactive" },
        { status: 404 }
      );
    }

    // Gather visit details
    const visitData = {
      campaignId,
      promoCode: promoCode || campaign.tracking.promoCodePrefix || "none",
      ip:
        req.headers.get("x-forwarded-for") ||
        req.headers.get("remote-addr") ||
        "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
    };

    // Log visit to MongoDB
    await Visits.create(visitData);

    // Send postback if postbackUrl exists
    if (campaign.tracking.postbackUrl) {
      try {
        await axios.post(campaign.tracking.postbackUrl, {
          campaignId,
          promoCode: visitData.promoCode,
          timestamp: new Date(),
          ip: visitData.ip,
        });
      } catch (postbackError) {}
    }

    // Send email notification
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Visit for Campaign: ${campaign.basics.title}`,
      text: `A new visit was recorded for campaign ${campaignId}:\n\nTimestamp: ${new Date().toISOString()}\nIP: ${
        visitData.ip
      }\nUser Agent: ${visitData.userAgent}\nPromo Code: ${
        visitData.promoCode
      }`,
      html: `<p>A new visit was recorded for campaign <strong>${
        campaign.basics.title
      } (${campaignId})</strong>:</p><ul><li><strong>Timestamp:</strong> ${new Date().toISOString()}</li><li><strong>IP:</strong> ${
        visitData.ip
      }</li><li><strong>User Agent:</strong> ${
        visitData.userAgent
      }</li><li><strong>Promo Code:</strong> ${visitData.promoCode}</li></ul>`,
    });

    // Log tracking pixel (client-side execution requires embedding)
    if (campaign.tracking.trackingPixel) {
      if (searchParams.get("pixel") === "true") {
        return new NextResponse(campaign.tracking.trackingPixel, {
          status: 200,
          headers: { "Content-Type": "text/javascript" },
        });
      }
    }

    // Redirect to actual landing page
    const actualLandingPage = campaign.tracking.landingPageUrl.includes(
      "/api/track"
    )
      ? campaign.tracking.landingPageUrl.replace("/api/track", "/product") // Replace with actual product page
      : campaign.tracking.landingPageUrl;
    return NextResponse.redirect(actualLandingPage, 302);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to track visit" },
      { status: 500 }
    );
  }
}
