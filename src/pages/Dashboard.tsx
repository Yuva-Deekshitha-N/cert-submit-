import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertTriangle, MapPin, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const STATUS = {
  COMPLETED: "completed",
  IN_PROGRESS: "in progress",
  PENDING: "pending",
};

function StatusIcon({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === STATUS.COMPLETED) {
    return <CheckCircle className="h-5 w-5 text-green-700" aria-label="Completed" />;
  }
  if (normalizedStatus === STATUS.IN_PROGRESS) {
    return <Clock className="h-5 w-5 text-blue-700" aria-label="In progress" />;
  }
  return <AlertTriangle className="h-5 w-5 text-red-700" aria-label="Pending" />;
}

const defaultCertificates = [
  { id: 1, name: "Epass Certificate", status: "Completed", dueDate: "Submitted", priority: "low" },
  { id: 2, name: "Bonafide Certificate", status: "Completed", dueDate: "Submitted", priority: "low" },
  { id: 3, name: "Examination Fee Receipt", status: "Completed", dueDate: "Apr 30, 2025", priority: "high" },
  { id: 4, name: "Course Completion Certificate", status: "Completed", dueDate: "May 15, 2025", priority: "medium" },
  { id: 5, name: "Academic Transcript", status: "Completed", dueDate: "Jun 10, 2025", priority: "medium" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      navigate("/login");
    } else {
      fetch("http://localhost:8000/api/certificates")
        .then((res) => res.json())
        .then((data) => {
          setCertificates(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch certificates:", err);
          setLoading(false);
        });
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-gray-500">Loading Dashboard...</span>
      </div>
    );
  }

  // Use the fetched user certificates to calculate stats
  const completedCount = certificates.filter(cert => cert.status.toLowerCase() === STATUS.COMPLETED).length;
  const inProgressCount = certificates.filter(cert => cert.status.toLowerCase() === STATUS.IN_PROGRESS).length;
  const pendingCount = certificates.filter(cert => cert.status.toLowerCase() === STATUS.PENDING).length;

  const progressPercentage = certificates.length > 0 ? (completedCount / certificates.length) * 100 : 0;

  const deadlines = certificates
    .filter(cert => cert.status.toLowerCase() !== STATUS.COMPLETED)
    .map(cert => {
      const dueDate = new Date(cert.dueDate);
      const today = new Date();
      const daysLeft = Math.max(0, Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24)));
      return {
        id: cert.id,
        name: cert.name,
        date: dueDate.toDateString(),
        daysLeft,
      };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <div className="mt-4 md:mt-0">
              <Button asChild className="bg-maroon-700 hover:bg-maroon-800">
                <Link to="/certificates">View All Certificates</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCount}/{certificates.length}</div>
                <Progress value={progressPercentage} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">Certificates completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <div className="text-2xl font-bold">{completedCount}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Certificates submitted</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-500 mr-2" />
                  <div className="text-2xl font-bold">{inProgressCount}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Certificates in process</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <div className="text-2xl font-bold">{pendingCount}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Certificates to submit</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Certificates Heading with default fixed certificates */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Certificates</CardTitle>
                  <CardDescription>Default certificates for all users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {defaultCertificates.map((certificate) => (
                      <div key={certificate.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            certificate.status.toLowerCase() === STATUS.COMPLETED
                              ? "bg-green-100 text-green-700"
                              : certificate.status.toLowerCase() === STATUS.IN_PROGRESS
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            <StatusIcon status={certificate.status} />
                          </div>
                          <div>
                            <h4 className="font-semibold">{certificate.name}</h4>
                            <p className="text-sm text-muted-foreground">Due: {certificate.dueDate}</p>
                          </div>
                        </div>
                        {/* If you want to add a link for default certs, add here or omit */}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Your Certificates Heading with user fetched certificates */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Your Certificates</CardTitle>
                  <CardDescription>Track the status of your required certificates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {certificates.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No certificates found.</p>
                    ) : (
                      certificates.map((certificate) => (
                        <div key={certificate.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center space-x-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              certificate.status.toLowerCase() === STATUS.COMPLETED
                                ? "bg-green-100 text-green-700"
                                : certificate.status.toLowerCase() === STATUS.IN_PROGRESS
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              <StatusIcon status={certificate.status} />
                            </div>
                            <div>
                              <h4 className="font-semibold">{certificate.name}</h4>
                              <p className="text-sm text-muted-foreground">Due: {certificate.dueDate}</p>
                            </div>
                          </div>
                          <Link
                            to={`/certificates/${certificate.id}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Details
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deadlines.map((deadline) => (
                      <div key={deadline.id} className="flex items-start space-x-3">
                        <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center ${
                          deadline.daysLeft <= 10
                            ? "bg-red-100 text-red-700"
                            : deadline.daysLeft <= 30
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          <Calendar className="h-3 w-3" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{deadline.name}</h4>
                          <p className="text-xs text-muted-foreground">Due: {deadline.date}</p>
                          <p className={`text-xs font-medium ${
                            deadline.daysLeft <= 10
                              ? "text-red-600"
                              : deadline.daysLeft <= 30
                              ? "text-amber-600"
                              : "text-gray-600"
                          }`}>
                            {deadline.daysLeft} days remaining
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nearest Submission Centers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, name: "Academic Section", location: "Admin Block, 1st Floor" },
                      { id: 2, name: "Examination Department", location: "Science Block, Ground Floor" },
                      { id: 3, name: "Student Affairs Office", location: "Central Library, 2nd Floor" },
                    ].map((center) => (
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
                  </div>
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
