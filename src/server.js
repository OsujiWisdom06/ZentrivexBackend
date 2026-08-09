import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "./app.js";

dotenv.config();

const PORT =
  process.env.PORT || 5000;


const startServer = async () => {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "✅ MongoDB Connected"
    );

    app.listen(
      PORT,
      () => {
        console.log(
          `🚀 Server running on port ${PORT}`
        );
      }
    );

  } catch (error) {

    console.error(
      "❌ MongoDB Connection Error:",
      error.message
    );

    process.exit(1);
  }
};


startServer();