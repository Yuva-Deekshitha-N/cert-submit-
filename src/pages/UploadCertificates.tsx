import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { uploadCertificate } from "@/api/certificateApi"; // ✅ Now uses API function
import axios from "axios";

export default function UploadCertificate() {
  const [file, setFile] = useState<File | null>(null);
  const [certificateName, setCertificateName] = useState("");
  const [certStatus, setCertStatus] = useState("Completed");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview(null);
    }
  };
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      setMessage("❗ Please choose a file first.");
      return;
    }

    if (!user?.email) {
      setMessage("❗ User not logged in.");
      return;
    }


    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("certificate", file);
      formData.append("studentEmail", user.email);
      formData.append("certStatus", certStatus);
      formData.append("name", name);

      
      const response = await uploadCertificate(formData); // ✅ Uses API call

      setMessage("✅ Certificate uploaded successfully!");
      console.log("Server response:", response.data);

      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
      notifications.unshift(`${certificateName} uploaded successfully`);
      localStorage.setItem("notifications", JSON.stringify(notifications));

      toast({
        title: "✅ Upload Successful",
        description: `${certificateName} has been uploaded successfully.`,
        duration: 4000,
      });

      navigate("/certificates");
    } catch (err: any) {
      console.error("Upload error:", err.response?.data || err.message || err);
      setMessage("❌ Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Upload New Certificate</h1>

      {user?.email && (
        <p className="text-sm text-gray-700">
          Logged in as: <strong>{user.email}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Certificate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
