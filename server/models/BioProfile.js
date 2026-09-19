import mongoose from "mongoose";

const bioProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
    },
    displayName: {
      type: String,
      default: "",
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    socialLinks: [
      {
        platform: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    bioLinks: [
      {
        title: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          trim: true,
        },
      },
    ],
    theme: {
      type: String,
      enum: {
        values: ["Minimal Light", "Dark Slate", "Gradient"],
        message: "{VALUE} is not a valid theme",
      },
      default: "Minimal Light",
    },
  },
  {
    timestamps: true,
  }
);

const BioProfile = mongoose.model("BioProfile", bioProfileSchema);

export default BioProfile;
