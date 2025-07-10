const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  date: String,
  office: String,
  status: String,
});

const CertificateSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "In Progress", "Rejected"],
    default: "Pending",
  },
  feedback: {
    type: String,
    default: "",
  },
  dueDate: String,
  priority: String,
  description: String,
  url: String,
  submissions: [SubmissionSchema],
});

// ✅ Prevent OverwriteModelError
const Certificate =
  mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);

module.exports = Certificate;
