const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load .env file
const Certificate = require("./models/Certificate");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;


// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

// CORS config
app.use(
  cors({
    origin: [
      "https://cert-submit.vercel.app",
      "http://localhost:5173",
      "http://localhost:8080",
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use("/uploads", express.static(uploadsDir)); // Serve uploaded files
app.use("/api/auth", require("./routes/authRoutes")); // ✅ Correct path to authRoutes.js

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Upload certificate
app.post("/api/certificates/upload", upload.single("certificate"), async (req, res) => {
  console.log("🔔 Upload endpoint hit");

  const { studentEmail, certStatus, certificateName } = req.body;
  const file = req.file;

  if (!file) {
    console.error("❌ No file uploaded");
    return res.status(400).json({ message: "No file uploaded." });
  }

  const BASE_URL = process.env.BASE_URL || `https://cert-submit.onrender.com`;
  const fileUrl = `${BASE_URL}/uploads/${file.filename}`;

  const certificate = new Certificate({
    studentEmail,
    name: certificateName || file.originalname,
    status: certStatus,
    dueDate: `Submitted on ${new Date().toDateString()}`,
    priority: "low",
    description: "Uploaded certificate file",
    url: fileUrl,
    submissions: [
      {
        date: new Date().toDateString(),
        office: "Academic Section",
        status: "Approved",
      },
    ],
  });

  try {
    const saved = await certificate.save();
    console.log("✅ Certificate saved:", saved);
    res.status(200).json({ success: true, message: "✅ Uploaded", certificate: saved });
  } catch (err) {
    console.error("❌ Error saving certificate:", err);
    res.status(500).json({ success: false, message: "Failed to upload certificate." });
  }
});

// Get all certificates
app.get("/api/certificates", async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
});

// Get certificates by student email
app.get("/api/certificates/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const certificates = await Certificate.find({ studentEmail: email });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
});

// Update status
app.patch("/api/certificates/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Certificate.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({ success: true, message: "Status updated", certificate: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

// Delete certificate
app.delete("/api/certificates/:id", async (req, res) => {
  try {
    const deleted = await Certificate.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Certificate not found." });
    }
    res.status(200).json({ message: "✅ Certificate deleted." });
  } catch (err) {
    console.error("❌ Error deleting certificate:", err);
    res.status(500).json({ message: "Failed to delete certificate." });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
