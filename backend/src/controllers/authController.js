import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "replace-this-secret",
    { expiresIn: "7d" },
  );
}

function authResponse(user) {
  return {
    token: createToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password, role: "customer" });
    res.status(201).json(authResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, identity, password, role } = req.body;
    const loginEmail = email || identity;

    if (!loginEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: loginEmail.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: `This account is not a ${role} account` });
    }

    res.json(authResponse(user));
  } catch (error) {
    next(error);
  }
}
