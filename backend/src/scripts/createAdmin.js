import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

async function createAdmin() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const exists = await User.findOne({ email });

  if (exists) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  await User.create({
    name: process.env.ADMIN_NAME || "Admin",
    email,
    password: process.env.ADMIN_PASSWORD || "admin123",
    role: "admin",
  });

  console.log(`Admin created: ${email}`);
  process.exit(0);
}

createAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
