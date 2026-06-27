import mongoose from "mongoose";

export const LINK_TTL_MS = 3 * 24 * 60 * 60 * 1000;

const linkSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true
    },
    shortCode: {
      type: String,
      required: true,
      trim: true
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + LINK_TTL_MS)
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
      index: true
    },
    ipHash: {
      type: String,
      trim: true
    },
    userAgent: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: {
      createdAt: false,
      updatedAt: true
    }
  }
);

linkSchema.index({ shortCode: 1 }, { unique: true });
linkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Link = mongoose.model("Link", linkSchema);
export default Link;
