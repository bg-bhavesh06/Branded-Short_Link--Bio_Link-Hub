import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const require = createRequire(import.meta.url);

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch {
  // Ignore DNS override errors
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Start HTTP server
    app.listen(PORT, () => {
      console.log(`LinkHub server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
