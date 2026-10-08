const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Start HTTP server
    app.listen(PORT, () => {
      console.log(`Branded linkHub server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

