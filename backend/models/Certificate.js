const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  date: String,
  office: String,
  status: String,
});

const CertificateSchema = new mongoose.Schema({
  studentEmail: String,
  name: String,
  status: String,
  dueDate: String,
  priority: String,
  description: String,
  url: String,
  submissions: [SubmissionSchema],
});


// ✅ Prevent OverwriteModelError here
const Certificate =
  mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);

module.exports = Certificate;
