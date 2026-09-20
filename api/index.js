import { connectDB } from "../server/config/db.js";
import app from "../server/app.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    console.error("MongoDB connection failed in Vercel function:", error);
  }
  return app(req, res);
}
