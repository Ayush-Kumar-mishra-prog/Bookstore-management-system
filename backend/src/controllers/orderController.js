import Book from "../models/Book.js";
import Order from "../models/Order.js";

export async function listOrders(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
    const status = req.query.status;
    const query = {};

    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }
    if (status) {
      query.status = status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Order.countDocuments(query),
    ]);

    res.json({ orders, page, pages: Math.ceil(total / limit) || 1, total });
  } catch (error) {
    next(error);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "You cannot view this order" });
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
}

export async function createOrder(req, res, next) {
  try {
    const requestedItems = req.body.items || [];
    if (!requestedItems.length) {
      return res.status(400).json({ message: "Order must contain at least one book" });
    }

    const ids = requestedItems.map((item) => item.bookId);
    const books = await Book.find({ _id: { $in: ids } });
    const items = [];
    let totalPrice = 0;

    for (const requested of requestedItems) {
      const book = books.find((item) => String(item._id) === requested.bookId);
      const quantity = Number(requested.quantity) || 1;

      if (!book) return res.status(404).json({ message: "One or more books were not found" });
      if (book.stock < quantity) {
        return res.status(400).json({ message: `${book.title} has only ${book.stock} in stock` });
      }

      book.stock -= quantity;
      await book.save();

      items.push({
        book: book._id,
        title: book.title,
        quantity,
        price: book.price,
      });
      totalPrice += book.price * quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      userInfo: { name: req.user.name, email: req.user.email },
      items,
      totalPrice,
      paymentStatus: req.body.paymentStatus || "pending",
    });

    res.status(201).json({ order });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.json({ order });
  } catch (error) {
    next(error);
  }
}
