// src/pages/Dashboard.tsx
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

const STATUS = {
  COMPLETED: "completed",
  IN_PROGRESS: "in progress",
  PENDING: "pending",
};

const defaultCertificates = [
  { id: 1, name: "Epass Certificate", status: "Completed", dueDate: "Submitted" },
  { id: 2, name: "Bonafide Certificate", status: "Completed", dueDate: "Submitted" },
  { id: 3, name: "Examination Fee Receipt", status: "Completed", dueDate: "Apr 30, 2025" },
  { id: 4, name: "Course Completion Certificate", status: "Completed", dueDate: "May 15, 2025" },
  { id: 5, name: "Academic Transcript", status: "Completed", dueDate: "Jun 10, 2025" },
];

const submissionCenters = [
  { id: 1, name: "Academic Section", location: "Admin Block, 1st Floor" },
  { id: 2, name: "Examination Department", location: "Science Block, Ground Floor" },
  { id: 3, name: "Student Affairs Office", location: "Central Library, 2nd Floor" },
];

function StatusIcon({ status }: { status: string }) {
  const normalized = status?.toLowerCase() || "";
  if (normalized === STATUS.COMPLETED) return <CheckCircle className="h-5 w-5 text-green-700" />;
  if (normalized === STATUS.IN_PROGRESS) return <Clock className="h-5 w-5 text-blue-700" />;
  return <AlertTriangle className="h-5 w-5 text-red-700" />;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<any[]>([]);
  const { addNotification } = useNotifications();
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!user?.email || hasNotified.current) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/certificates/${user.email}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      })
      .then((data) => {
        setCertificates(data);
        setLoading(false);

        const completed = data.filter(c => c.status?.toLowerCase() === STATUS.COMPLETED).length;
        const pending = data.filter(c => c.status?.toLowerCase() === STATUS.PENDING).length;
        const inprogress = data.filter(c => c.status?.toLowerCase() === STATUS.IN_PROGRESS).length;

        if (!hasNotified.current) {
          if (completed) addNotification(`${completed} certificates marked as Completed.`, "success");
          if (inprogress) addNotification(`${inprogress} certificates are In Progress.`, "info");
          if (pending) addNotification(`${pending} certificates are Pending.`, "warning");
          hasNotified.current = true;
        }
      })
      .catch((err) => {
        console.error("Failed to fetch certificates:", err);
        setCertificates([]);
        setLoading(false);
      });
  }, [user, addNotification]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-gray-500">Loading Dashboard...</span>
      </div>
    );
  }

  const completedCount = certificates.filter(c => c.status?.toLowerCase() === STATUS.COMPLETED).length;
  const inProgressCount = certificates.filter(c => c.status?.toLowerCase() === STATUS.IN_PROGRESS).length;
  const pendingCount = certificates.filter(c => c.status?.toLowerCase() === STATUS.PENDING).length;
  const progressPercent = certificates.length ? (completedCount / certificates.length) * 100 : 0;

  const deadlines = certificates
    .filter(c => c.status?.toLowerCase() !== STATUS.COMPLETED && c.dueDate && c.dueDate !== "Submitted")
    .map(c => {
      const dueDate = new Date(c.dueDate);
      const daysLeft = Math.max(0, Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 3600 * 24)));
      return {
        id: c._id?.toString() || c.id?.toString() || c.name,
        name: c.name,
        date: dueDate.toDateString(),
        daysLeft
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="flex gap-2">
              <Button asChild variant="secondary">
                <Link to="/certificates/upload">Upload New Certificate</Link>
              </Button>
              <Button asChild className="bg-maroon-700 hover:bg-maroon-800">
                <Link to="/certificates">View All Certificates</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[{
              title: "Overall Progress",
              content: (
                <>
                  <div className="text-2xl font-bold">{completedCount}/{certificates.length}</div>
                  <Progress value={progressPercent} className="h-2 mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">Certificates completed</p>
                </>
              ),
            }, {
              title: "Completed",
              icon: <CheckCircle className="h-5 w-5 text-green-500 mr-2" />,
              count: completedCount,
              desc: "Certificates submitted",
            }, {
              title: "In Progress",
              icon: <Clock className="h-5 w-5 text-blue-500 mr-2" />,
              count: inProgressCount,
              desc: "Certificates in process",
            }, {
              title: "Pending",
              icon: <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />,
              count: pendingCount,
              desc: "Certificates to submit",
            }].map((card, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {card.content ?? (
                    <div className="flex items-center">
                      {card.icon}
                      <div className="text-2xl font-bold">{card.count}</div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">{card.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Default & User Certificates */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Certificates</CardTitle>
                  <CardDescription>Default certificates for all users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {defaultCertificates.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          c.status.toLowerCase() === STATUS.COMPLETED
                            ? "bg-green-100 text-green-700"
                            : c.status.toLowerCase() === STATUS.IN_PROGRESS
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          <StatusIcon status={c.status} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{c.name}</h4>
                          <p className="text-sm text-muted-foreground">Due: {c.dueDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Certificates</CardTitle>
                  <CardDescription>Track your own certificates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {certificates.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No certificates found.</p>
                  ) : (
                    certificates.map(c => (
                      <div
                        key={c._id?.toString() || c.id?.toString() || c.name}
                        className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            c.status?.toLowerCase() === STATUS.COMPLETED
                              ? "bg-green-100 text-green-700"
                              : c.status?.toLowerCase() === STATUS.IN_PROGRESS
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            <StatusIcon status={c.status} />
                          </div>
                          <div>
                            <h4 className="font-semibold">{c.name}</h4>
                            <p className="text-sm text-muted-foreground">Due: {c.dueDate}</p>
                            {c.feedback && (
                              <p className="text-xs text-gray-500 italic">Feedback: {c.feedback}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {c.url?.endsWith(".pdf") ? (
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 underline"
                            >
                              View PDF
                            </a>
                          ) : (
                            <img
                              src={c.url}
                              alt="Preview"
                              className="w-12 h-12 object-cover border rounded"
                            />
                          )}

                          <a
                            href={c.url}
                            download
                            className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Deadlines & Locations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {deadlines.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
                  ) : (
                    deadlines.map(d => (
                      <div key={d.id} className="flex items-start space-x-3">
                        <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center ${
                          d.daysLeft <= 10
                            ? "bg-red-100 text-red-700"
                            : d.daysLeft <= 30
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          <Calendar className="h-3 w-3" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{d.name}</h4>
                          <p className="text-xs text-muted-foreground">Due: {d.date}</p>
                          <p className={`text-xs font-medium ${
                            d.daysLeft <= 10
                              ? "text-red-600"
                              : d.daysLeft <= 30
                              ? "text-amber-600"
                              : "text-gray-600"
                          }`}>
                            {d.daysLeft} days remaining
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Nearest Submission Centers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {submissionCenters.map(center => (
                    <div key={center.id} className="flex items-start space-x-3">
                      <div className="mt-0.5 h-6 w-6 rounded-full bg-maroon-100 text-maroon-700 flex items-center justify-center">
                        <MapPin className="h-3 w-3" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{center.name}</h4>
                        <p className="text-xs text-muted-foreground">{center.location}</p>
                        <Link to="/locations" className="text-xs text-blue-600 hover:underline">
                          Get Directions
                        </Link>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
