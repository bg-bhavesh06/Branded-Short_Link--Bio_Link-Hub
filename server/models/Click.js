import mongoose from "mongoose";

const clickSchema = new mongoose.Schema(
  {
    shortLink: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShortLink",
      required: [true, "ShortLink reference is required"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    referrer: {
      type: String,
      default: "",
      trim: true,
    },
    deviceType: {
      type: String,
      enum: {
        values: ["Mobile", "Desktop", "Tablet"],
        message: "{VALUE} is not a supported device type",
      },
      required: [true, "Device type is required"],
    },
    ipHash: {
      type: String,
      required: [true, "IP hash is required"],
      trim: true,
    },
  },
  {
    timestamps: false,
  }
);

// Index for telemetry and analytics aggregations over time
clickSchema.index({ shortLink: 1, timestamp: -1 });

const Click = mongoose.model("Click", clickSchema);

export default Click;
