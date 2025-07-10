// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();

// Dummy in-memory auth for demo
const ADMIN_EMAILS = ["deekshitha123@gmail.com", "admin2@gmail.com"];

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  const role = ADMIN_EMAILS.includes(email) ? "admin" : "student";

  const user = {
    email,
    role,
    token: "mock-jwt-token", // Replace with real JWT later
  };

  res.status(200).json(user);
});
// Register a new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // TODO: Add logic to save user to database
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});


module.exports = router;
