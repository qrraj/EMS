import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const login = async (req, res) => {
  try {
    const { email, password, role_type } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    if (role_type === "admin" && user.role !== "ADMIN") {
      return res.status(401).json({ error: "Not Authorized as admin" });
    }
    if (role_type === "employee" && user.role !== "EMPLOYEE") {
      return res.status(401).json({ error: "Not Authorized as employee" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ success: true, user: payload, token });
  } catch (err) {
    return res.status(500).json({ error: "Login Failed" });
  }
};

export const session = (req, res) => {
  const session = req.session;
  return res.json({ user: session });
};

export const changePassword = async (req, res) => {
  try {
    const session = req.session;
    const { currentPassword, newPassword } = req.body();
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both Password are required" });
    }
    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(session.userId, {
      password: hashed,
    });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to change password" });
  }
};
