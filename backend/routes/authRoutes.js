// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const ADMIN_EMAILS = ["deekshitha123@gmail.com", "admin2@gmail.com"];

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ✅ Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "student";

    const newUser = new User({
      name,
      email,
      password: hashed,
      role,
      authType: "local",
    });

    await newUser.save();

    const token = jwt.sign(
      { email: newUser.email, name: newUser.name, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Google Login Route
router.post("/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "No token provided in request body" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.name) {
      return res.status(401).json({ message: "Google token is invalid or missing fields" });
    }

    const { email, name } = payload;
    const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "student";

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        role,
        authType: "google",
      });
    }

    const jwtToken = jwt.sign(
      { email, name, role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token: jwtToken,
      user: {
        name,
        email,
        role,
      },
    });

  } catch (error) {
    console.error("❌ Google token verification failed:", error);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

module.exports = router;
