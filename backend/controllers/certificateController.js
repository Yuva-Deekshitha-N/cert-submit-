// controllers/certificateController.js
const Certificate = require("../models/Certificate");

const uploadCertificate = async (req, res) => {
  try {
    if (req.user.role === "student") {
      req.body.status = "Pending";     // Default
      req.body.feedback = "";          // No feedback from student
    }

    const newCertificate = new Certificate({
      studentEmail: req.body.studentEmail,
      name: req.body.name,
      status: req.body.status,
      feedback: req.body.feedback,
      url: req.file?.path || "",       // assuming multer file upload
    });

    const saved = await newCertificate.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed." });
  }
};
// PATCH /api/certificates/:id
exports.updateCertificate = async (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  try {
    const cert = await Certificate.findById(id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    cert.status = status;
    cert.feedback = feedback || "";
    await cert.save();

    res.status(200).json({
      message: "Certificate updated successfully",
      studentEmail: cert.studentEmail,
      certificateName: cert.name,
      status: cert.status,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update certificate" });
  }
};


module.exports = {
  uploadCertificate,
};
