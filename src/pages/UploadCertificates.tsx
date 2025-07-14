import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { uploadCertificate } from "@/api/certificateApi";
import { useNotifications } from "@/context/NotificationContext";

export default function UploadCertificate() {
  const [file, setFile] = useState<File | null>(null);
  const [certificateName, setCertificateName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

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

    if (!user?.email) {
      setMessage("❗ User not logged in.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("certificate", file); // ✅ key must match multer field name
      formData.append("studentEmail", user.email);
      formData.append("certificateName", certificateName); // ✅ FIXED key
      formData.append("certStatus", "Pending"); // ✅ FIXED key

      const response = await uploadCertificate(formData);

      toast({
        title: "✅ Upload Successful",
        description: `${certificateName} has been uploaded successfully.`,
        duration: 4000,
      });

      addNotification(`✅ "${certificateName}" uploaded successfully.`, "success");

      setMessage("✅ Certificate uploaded successfully!");
      console.log("Server response:", response.data);

      // ✅ Show uploaded file preview (from server)
      setFilePreview(response.data.certificate.url);

      navigate("/certificates");
      
    } catch (err: any) {
      console.error("Upload error:", err.response?.data || err.message || err);

      toast({
        title: "❌ Upload Failed",
        description: err.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });

      addNotification(`❌ Failed to upload "${certificateName}".`, "warning");
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
          value={certificateName}
          onChange={(e) => setCertificateName(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="border p-2 rounded"
          required
        />

        {/* ✅ Preview uploaded file (PDF or image) */}
        {filePreview && (
          <div className="text-sm text-gray-600">
            <p className="mb-1">Uploaded File Preview:</p>
            {filePreview.endsWith(".pdf") ? (
              <iframe
                src={filePreview}
                width="100%"
                height="400px"
                className="border rounded"
                title="PDF Preview"
              ></iframe>
            ) : (
              <img
                src={filePreview}
                alt="Preview"
                className="max-h-40 border rounded"
              />
            )}
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
