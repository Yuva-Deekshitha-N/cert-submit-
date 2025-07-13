const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Certificate = require("./models/Certificate");
const session = require("express-session");
const googleAuthRoutes = require("./routes/googleAuth");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

// ✅ Middleware
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));
app.use(cors({
  origin: [
    "https://cert-submit.vercel.app",
    "http://localhost:5173",
    "http://localhost:8080"
  ],
  credentials: true
}));

app.use("/api/auth", googleAuthRoutes);
// ✅ CORS Security Headers (for COOP/COEP)
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// ✅ Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ---------------------------
// ✅ ROUTES
// ---------------------------

// Upload certificate
app.post("/api/certificates/upload", upload.single("certificate"), async (req, res) => {
  try {
    const { studentEmail, certStatus, certificateName } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded." });

    const BASE_URL = process.env.BASE_URL || "https://cert-submit.onrender.com";
    const fileUrl = `${BASE_URL}/uploads/${file.filename}`;

    const certificate = new Certificate({
      studentEmail,
      name: certificateName || file.originalname,
      status: certStatus || "Pending",
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

    const saved = await certificate.save();
    res.status(201).json({ success: true, message: "✅ Uploaded", certificate: saved });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ message: "Upload failed." });
  }
});

// ✅ Get all certificates (admin)
app.get("/api/certificates", async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch certificates." });
  }
});

// ✅ Get certificates by email (student view)
app.get("/api/certificates/:email", async (req, res) => {
  try {
    const certificates = await Certificate.find({ studentEmail: req.params.email });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch certificates." });
  }
});

// ✅ Get single certificate by ID (for CertificateDetails page)
app.get("/api/certificates/id/:id", async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ message: "Certificate not found" });
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch certificate." });
  }
});

// ✅ PUT: Admin updates status + feedback
app.put("/api/certificates/:id", async (req, res) => {
  const { status, feedback } = req.body;
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    cert.status = status || cert.status;
    cert.feedback = feedback || cert.feedback;

    const updated = await cert.save();
    res.json(updated); // Frontend expects full object
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// ✅ Delete certificate
app.delete("/api/certificates/:id", async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    // Remove file from disk
    if (cert.url) {
      const filePath = path.join(uploadsDir, path.basename(cert.url));
      fs.unlink(filePath, (err) => {
        if (err) console.warn("File delete warning:", err.message);
      });
    }

    res.json({ success: true, message: "Certificate deleted." });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

// ---------------------------
// ✅ Start Server
// ---------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
