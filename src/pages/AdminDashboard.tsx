// src/pages/AdminDashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
import AdminNavbar from "@/components/AdminNavbar";

const ADMIN_EMAILS = ["deekshitha123@gmail.com", "admin2@gmail.com"];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<any[]>([]);
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  // ✅ Admin access validation (case-insensitive match)
  useEffect(() => {
    const email = user?.email?.toLowerCase();
    const isAdmin = email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email);

    if (!email || !isAdmin) {
      navigate("/unauthorized", { replace: true });
    }
  }, [user, navigate]);

  // ✅ Fetch all certificates
  useEffect(() => {
    if (!user?.token) return;

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/certificates`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setCertificates(res.data))
      .catch((err) => {
        console.error("❌ Error fetching certificates:", err);
        toast({
          title: "Error loading certificates",
          description: "Could not fetch data. Please try again.",
          variant: "destructive",
        });

        if (err.response?.status === 401) logout();
      });
  }, [user, logout, toast]);

  // ✅ Handle status & feedback update
  const handleUpdate = async (
    id: string,
    status: string,
    feedback: string
  ) => {
    if (!user?.token) return;

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/certificates/${id}`,
        { status, feedback },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setCertificates((prev) =>
        prev.map((c) => (c._id === id ? { ...c, ...res.data } : c))
      );

      toast({
        title: "Certificate updated",
        description: `Marked as ${res.data.status}`,
      });

      addNotification(
        `Certificate "${res.data.name}" updated to "${res.data.status}"`,
        "info"
      );
    } catch (err) {
      console.error("❌ Update failed:", err);
      toast({
        title: "Update Failed",
        description: "Could not update certificate status.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-6 bg-white min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-6">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.length > 0 ? (
            certificates.map((cert) => (
              <Card key={cert._id}>
                <CardHeader>
                  <CardTitle>{cert.name}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Student: {cert.studentEmail}
                  </p>
                  <p className="text-sm">
                    Status: <strong>{cert.status}</strong>
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Label>Status</Label>
                  <Select
                    defaultValue={cert.status}
                    onValueChange={(value) =>
                      handleUpdate(cert._id, value, cert.feedback || "")
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

                  <Label>Feedback</Label>
                  <Textarea
                    defaultValue={cert.feedback || ""}
                    onBlur={(e) =>
                      handleUpdate(cert._id, cert.status, e.target.value)
                    }
                    placeholder="Write feedback here..."
                  />

                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline block"
                    >
                      View Uploaded File
                    </a>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No certificates to review.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
