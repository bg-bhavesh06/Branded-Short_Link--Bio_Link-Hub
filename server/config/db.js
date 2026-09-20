import dns from "dns";
import mongoose from "mongoose";

// Configure public DNS servers for MongoDB Atlas SRV resolution
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore in restricted environments
}

// Convert SRV clusters to direct replicaSet URI if DNS querySrv EBADRESP occurs on Windows/local ISP
const getDirectAtlasFallbackUri = (srvUri) => {
  if (!srvUri || !srvUri.includes("linkhub.dhsyhca.mongodb.net")) return null;
  try {
    const match = srvUri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@linkhub\.dhsyhca\.mongodb\.net\/?([^?]*)(.*)/);
    if (match) {
      const [, user, pass, dbName] = match;
      const db = dbName || "linkhub";
      return `mongodb://${user}:${pass}@ac-awz4pzg-shard-00-00.dhsyhca.mongodb.net:27017,ac-awz4pzg-shard-00-01.dhsyhca.mongodb.net:27017,ac-awz4pzg-shard-00-02.dhsyhca.mongodb.net:27017/${db}?ssl=true&replicaSet=atlas-yllaql-shard-0&authSource=admin&retryWrites=true&w=majority`;
    }
  } catch {
    return null;
  }
  return null;
};

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
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
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // If SRV DNS resolution fails (common Windows/ISP EBADRESP issue), auto-connect via direct shard nodes
    const fallbackUri = getDirectAtlasFallbackUri(uri);
    if (fallbackUri && (error.message.includes("querySrv") || error.message.includes("EBADRESP"))) {
      try {
        console.warn("Retrying MongoDB connection via direct replicaSet shard nodes...");
        const conn = await mongoose.connect(fallbackUri);
        console.log(`MongoDB connected successfully: ${conn.connection.host}`);
        return conn;
      } catch (fallbackError) {
        console.error(`MongoDB connection fallback error: ${fallbackError.message}`);
      }
    }

    console.error(`MongoDB connection error: ${error.message}`);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};
