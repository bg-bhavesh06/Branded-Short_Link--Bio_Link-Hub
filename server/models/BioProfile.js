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
    templateId: {
      type: String,
      enum: {
        values: ["creator", "professional", "portfolio", "minimal"],
        message: "{VALUE} is not a valid template",
      },
      default: "creator",
    },
    jobTitle: {
      type: String,
      default: "",
      trim: true,
    },
    company: {
      type: String,
      default: "",
      trim: true,
    },
    pronouns: {
      type: String,
      default: "",
      trim: true,
    },
    coverImage: {
      type: String,
      default: "",
      trim: true,
    },
    resumeUrl: {
      type: String,
      default: "",
      trim: true,
    },
    statusBadge: {
      type: String,
      default: "Open to work",
      trim: true,
    },
    highlights: [
      {
        title: { type: String, trim: true },
        subtitle: { type: String, trim: true },
      },
    ],
    contactMethods: [
      {
        type: {
          type: String,
          trim: true,
        },
        label: {
          type: String,
          trim: true,
        },
        value: {
          type: String,
          trim: true,
        },
      },
    ],
    customization: {
      buttonStyle: {
        type: String,
        enum: ["rounded", "soft-card", "outline"],
        default: "rounded",
      },
      layoutVariant: {
        type: String,
        default: "standard",
      },
      backgroundStyle: {
        type: String,
        default: "solid",
      },
      headerColor: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

const BioProfile = mongoose.model("BioProfile", bioProfileSchema);

export default BioProfile;
