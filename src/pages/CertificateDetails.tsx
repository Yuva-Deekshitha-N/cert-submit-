import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const CertificateDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<any>(null);

  useEffect(() => {
    if (!user || !id) return;

    fetch(`${API_URL}/api/certificates/id/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch certificate");
        const data = await res.json();
        setCertificate(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast({
          title: "Error",
          description: "Unable to load certificate.",
          variant: "destructive",
        });
        navigate("/certificates", { replace: true });
      });
  }, [id, user, toast, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-gray-500">Loading certificate details...</span>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-red-500">Certificate not found.</span>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{certificate.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Submitted by: <strong>{certificate.studentEmail || "You"}</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <span>Status:</span>
            <Badge
                variant="secondary"
                className={
                    certificate.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : certificate.status === "In Progress"
                    ? "bg-blue-100 text-blue-800"
                    : certificate.status === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : ""
                }
                >
                {certificate.status}
            </Badge>

          </div>

          {certificate.feedback && (
            <div>
              <h4 className="font-medium text-sm mb-1">Feedback:</h4>
              <p className="text-sm bg-gray-100 p-2 rounded">{certificate.feedback}</p>
            </div>
          )}

          {certificate.description && (
            <div>
              <h4 className="font-medium text-sm mb-1">Description:</h4>
              <p className="text-sm text-gray-700">{certificate.description}</p>
            </div>
          )}

          {certificate.dueDate && (
            <div>
              <h4 className="font-medium text-sm mb-1">Due Date:</h4>
              <p className="text-sm text-gray-700">{certificate.dueDate}</p>
            </div>
          )}

          {certificate.url && (
            <div>
              <h4 className="font-medium text-sm mb-1">Uploaded File:</h4>

              {certificate.url.endsWith(".pdf") ? (
                <iframe
                  src={certificate.url}
                  title="PDF Preview"
                  className="w-full h-96 border rounded"
                />
              ) : (
                <img
                  src={certificate.url}
                  alt="Certificate Preview"
                  className="max-w-full h-auto rounded border"
                />
              )}

              <div className="mt-2">
                <a
                  href={certificate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                >
                  Download File
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificateDetails;
