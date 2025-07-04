const express = require("express");
const router = express.Router();
const Certificate = require("../models/Certificate");

const fs = require("fs");
const path = require("path");

// DELETE certificate by ID
router.delete("/api/certificates/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const cert = await Certificate.findByIdAndDelete(id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    // Optional: also delete the uploaded file
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

module.exports = router;
