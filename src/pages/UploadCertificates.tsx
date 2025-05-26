import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UploadCertificate() {
  const [file, setFile] = useState<File | null>(null);
  const [studentId, setStudentId] = useState("");
  const [certificateName, setCertificateName] = useState("");
  const [certStatus, setCertStatus] = useState("Completed");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview(null);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      setMessage("❗ Please choose a file first.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("certificate", file);
      formData.append("studentId", studentId);
      formData.append("certStatus", certStatus);
      formData.append("certificateName", certificateName);

      const response = await axios.post(
        "http://localhost:8000/api/certificates/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setMessage("✅ Certificate uploaded successfully!");
        console.log("Server response:", response.data);

        navigate("/certificates");
      } else {
        console.error("Unexpected server response:", response);
        setMessage("❌ Upload failed. Unexpected server response.");
      }
    } catch (err: any) {
      console.error("Upload error:", err.response ? err.response.data : err.message || err);
      setMessage("❌ Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Upload New Certificate</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Certificate Name"
          value={certificateName}
          onChange={(e) => setCertificateName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <select
          value={certStatus}
          onChange={(e) => setCertStatus(e.target.value)}
          className="border p-2 rounded bg-white"
        >
          <option value="Completed">Completed</option>
          <option value="In progress">In progress</option>
          <option value="Pending">Pending</option>
        </select>

        {/* Status Preview Badge */}
        <div className="text-sm">
          <span
            className={`inline-block px-3 py-1 rounded-full font-medium
              ${
                certStatus === "Completed"
                  ? "bg-green-100 text-green-700"
                  : certStatus === "In progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {certStatus}
          </span>
        </div>

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="border p-2 rounded"
          required
        />

        {filePreview && (
          <div className="text-sm text-gray-600">
            <p className="mb-1">Preview:</p>
            <img
              src={filePreview}
              alt="Preview"
              className="max-h-40 border rounded"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`py-2 px-4 rounded text-white ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Certificate"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-2 text-center font-medium ${
            message.startsWith("✅")
              ? "text-green-600"
              : message.startsWith("❌")
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
