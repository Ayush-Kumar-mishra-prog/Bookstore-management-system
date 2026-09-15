import Book from "../models/Book.js";

function buildBookQuery({ search, genre, author, title }) {
  const query = {};

  if (search) {
    query.$text = { $search: search };
  }
  if (genre) {
    query.genre = new RegExp(genre, "i");
  }
  if (author) {
    query.author = new RegExp(author, "i");
  }
  if (title) {
    query.title = new RegExp(title, "i");
  }

  return query;
}

export async function listBooks(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;
    const query = buildBookQuery(req.query);

    const [books, total] = await Promise.all([
      Book.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Book.countDocuments(query),
    ]);

    res.json({
      books,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBook(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ book });
  } catch (error) {
    next(error);
  }
}

export async function createBook(req, res, next) {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ book });
  } catch (error) {
    next(error);
  }
}

export async function updateBook(req, res, next) {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ book });
  } catch (error) {
    next(error);
  }
}

export async function deleteBook(req, res, next) {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (error) {
    next(error);
  }
}
