import mongoose from "mongoose";

export default async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookstore_management";
  await mongoose.connect(uri).then(()=>console.log("Database connected")).catch((e)=>console.error("Error to connecting database",e));
}
