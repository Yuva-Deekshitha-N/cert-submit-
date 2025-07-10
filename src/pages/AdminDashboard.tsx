import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNotifications } from "@/context/NotificationContext";
import { useToast } from "@/components/ui/use-toast";

const ADMIN_EMAILS = ["deekshitha123@gmail.com", "admin2@gmail.com"];

const AdminDashboard = () => {
  const { user } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<any[]>([]);
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  // ✅ Only allow admins
  useEffect(() => {
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      navigate("/unauthorized");
      return;
    }
  }, [user, navigate]);

  // ✅ Fetch all certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/certificates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCertificates(res.data);
      } catch (err) {
        console.error("Error fetching certs:", err);
        toast({
          title: "❌ Error",
          description: "Failed to fetch certificates.",
          variant: "destructive",
        });
      }
    };

    if (user && ADMIN_EMAILS.includes(user.email)) {
      fetchCertificates();
    }
  }, [user, token, toast]);

  // ✅ Status & feedback updater
  const handleUpdate = async (id: string, status: string, feedback: string) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/certificates/${id}`,
        { status, feedback },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCertificates((prev) =>
        prev.map((cert) =>
          cert._id === id ? { ...cert, status, feedback } : cert
        )
      );

      toast({
        title: "✅ Status Updated",
        description: `Status set to ${status}`,
      });

      addNotification(
        `📢 Certificate "${res.data.certificateName}" updated to ${res.data.status}`,
        "info"
      );
    } catch (err) {
      console.error("Update failed:", err);
      toast({
        title: "❌ Update Failed",
        description: "Could not update certificate status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <Card key={cert._id}>
            <CardHeader>
              <CardTitle>{cert.name}</CardTitle>
              <p className="text-sm text-gray-600">
                Uploaded by: {cert.studentEmail}
              </p>
              <p className="text-sm">
                Status: <strong>{cert.status}</strong>
              </p>
            </CardHeader>
            <CardContent>
              <Label>Status</Label>
              <Select
                defaultValue={cert.status}
                onValueChange={(value) =>
                  handleUpdate(cert._id, value, cert.feedback)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Label className="mt-3">Feedback</Label>
              <Textarea
                defaultValue={cert.feedback}
                onBlur={(e) =>
                  handleUpdate(cert._id, cert.status, e.target.value)
                }
                className="w-full mt-1"
              />

              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-blue-600 hover:underline"
                >
                  View Certificate
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
