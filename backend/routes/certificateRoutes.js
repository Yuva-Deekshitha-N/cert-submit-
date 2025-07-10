const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Upload certificate (Student role → status always Pending)
router.post(
  "/api/certificates/upload",
  verifyToken,
  upload.single("certificate"),
  async (req, res) => {
    try {
      const { studentEmail, name } = req.body;
      let status = req.body.status || "Pending";
      let feedback = req.body.feedback || "";

      // Force student uploads to always be 'Pending' with no feedback
      if (req.user.role === "student") {
        status = "Pending";
        feedback = "";
      }

      const newCert = new Certificate({
        studentEmail,
        name,
        status,
        feedback,
        url: req.file ? `/uploads/${req.file.filename}` : "",
      });

      const saved = await newCert.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error("Upload failed:", err);
      res.status(500).json({ message: "Upload failed." });
    }
  }
);

// ✅ Admin updates certificate status and feedback
router.put("/api/certificates/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { status, feedback } = req.body;

  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    cert.status = status || cert.status;
    cert.feedback = feedback || cert.feedback;

    await cert.save();
    res.json({ success: true, message: "Certificate updated", cert });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});
// ✅ Admin-only: Get all certificates
router.get("/api/certificates", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const certs = await Certificate.find().sort({ createdAt: -1 });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch certificates", error: err.message });
  }
});



// ✅ Delete certificate by ID
// ✅ Delete certificate (admin only)
router.delete("/api/certificates/:id", verifyToken, verifyAdmin, async (req, res) => {
  const id = req.params.id;

  try {
    const cert = await Certificate.findByIdAndDelete(id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    // Delete uploaded file from /uploads
    if (cert.url) {
      const filePath = path.join(__dirname, "../uploads", path.basename(cert.url));
      fs.unlink(filePath, (err) => {
        if (err) console.error("File delete error:", err.message);
      });
    }

    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
console.log("User:", req.user.email, "| Role:", req.user.role);
