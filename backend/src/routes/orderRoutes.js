import { Router } from "express";
import {
  createOrder,
  getOrder,
  listOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, listOrders);
router.get("/:id", protect, getOrder);
router.post("/", protect, createOrder);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;
