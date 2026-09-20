import { createRequire } from "module";
const require = createRequire(import.meta.url);

// this help to change the dns service for MongoDB Atls...
const dns = require("dns");
const mongoose = require("mongoose");

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch {
  // Ignore DNS override errors in serverless environments
}

let cachedConnection = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Error: MONGODB_URI is not defined in environment variables.");
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    return;
  }

  try {
    cachedConnection = await mongoose.connect(uri, {
      bufferCommands: false,
    });
    console.log(`MongoDB connected successfully: ${cachedConnection.connection.host}`);
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    console.error(`MongoDB connection error: ${error.message}`);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
    throw error;
  }
};
