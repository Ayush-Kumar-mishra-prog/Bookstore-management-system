import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import mongoose from 'mongoose'

dotenv.config();

async function createAdmin() {
  console.log("Seeding admin user...");
  const conn =  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookstore_management";
    await mongoose.connect(conn).then(()=>console.log("Database connected")).catch((e)=>console.error("Error to connecting database",e));

  if(conn){
    console.log("Database connected successfully.");
  }else{
    console.log("Database connection error")
  }

  console.log("Checking the user email in the database...");
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const exists = await User.findOne({ email });

  if (exists) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }
 console.log("Creating default user")

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
  console.error("Error while seeding admin user: " + error.message);
  process.exit(1);
});
