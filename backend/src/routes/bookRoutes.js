import { Router } from "express";
import {
  createBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from "../controllers/bookController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", listBooks);
router.get("/:id", getBook);
router.post("/", protect, adminOnly, createBook);
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

export default router;
