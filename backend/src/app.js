import cors from "cors";
import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "bookstore-api" });
});

app.use("/api", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
