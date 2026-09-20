import mongoose from "mongoose";

const shortLinkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
      trim: true,
    },
    shortCode: {
      type: String,
      required: [true, "Short code is required"],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for rapid user links retrieval sorted by creation time
shortLinkSchema.index({ user: 1, createdAt: -1 });

const ShortLink = mongoose.models.ShortLink || mongoose.model("ShortLink", shortLinkSchema);

export default ShortLink;
