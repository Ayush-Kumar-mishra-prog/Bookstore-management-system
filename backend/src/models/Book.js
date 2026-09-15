import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    author: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    genre: { type: String, required: true, trim: true, index: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isbn: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true },
);

bookSchema.index({ title: "text", author: "text", genre: "text", isbn: "text" });

export default mongoose.model("Book", bookSchema);
