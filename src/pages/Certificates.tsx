import { useEffect, useState, useContext } from "react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Check, Search, Calendar, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";

const getColorClasses = (status: string | undefined) => {
  const normalized = status?.toLowerCase() || "";
  switch (normalized) {
    case "completed":
      return {
        border: "border-green-500",
        bg: "bg-green-100",
        text: "text-green-800",
      };
    case "in progress":
      return {
        border: "border-blue-500",
        bg: "bg-blue-100",
        text: "text-blue-800",
      };
    case "pending":
      return {
        border: "border-orange-500",
        bg: "bg-orange-100",
        text: "text-orange-800",
      };
    default:
      return {
        border: "border-gray-300",
        bg: "bg-gray-100",
        text: "text-gray-800",
      };
  }
};


const mockCertificates = [
  {
    _id: "Bonafide",
    id: 1,
    name: "Bonafide Certificate",
    status: "Completed",
    dueDate: "Submitted",
    priority: "low",
    description:
      "A certificate that confirms your status as a bonafide student of the university.",
    submissions: [
      { date: "June", office: "Academic Section", status: "Approved" },
    ],
    url: "http://localhost:8000/uploads/sample-bonafide.pdf",
  },
  {
    _id:"Examination Fee",
    id: 2,
    name: "Examination Fee Receipt",
    status: "Completed",
    dueDate: "June 2025",
    priority: "high",
    description:
      "Proof of payment for examination fees for the current semester.",
    submissions: [],
  },
  {
    _id:"Course completion",
    id: 3,
    name: "Course Completion Certificate",
    status: "Completed",
    dueDate: "June 2025",
    priority: "medium",
    description:
      "Certifies that you have completed all required courses for your degree program.",
    submissions: [
      {
        date: "June",
        office: "Examination Department",
      },
    ],
  },
  {
    _id:"Academic",
    id: 4,
    name: "Academic Transcript",
    status: "Completed",
    dueDate: "June 2025",
    priority: "medium",
    description:
      "Official record of your academic performance including grades and credits earned.",
    submissions: [],
  },
  {
    _id:"no due",
    id: 5,
    name: "No Dues Certificate",
    status: "Completed",
    dueDate: "June 2025",
    priority: "low",
    description:
      "Certifies that you have no outstanding dues with the university.",
    submissions: [],
  },
];

const Certificates = () => {
  const [certificates, setCertificates] = useState(mockCertificates);
  const { user } = useContext(AuthContext);

  useEffect(() => {
  if (!user) return;

  const fetchCertificates = async () => {
    try {
      const res = await axios.get(
  `       ${import.meta.env.VITE_API_URL}/api/certificates/${encodeURIComponent(user.email)}`
      );

      const backendData = res.data || [];

      const backendCertificates = backendData.map((b: any) => ({
        _id: b._id,
        name: b.name || b.certificateName,
        status: b.status || b.certStatus || "Pending",
        dueDate: "Uploaded",
        description: "Uploaded by student.",
        submissions: [],
        url: b.url,
      }));

      // Filter out mocks that already exist in backend by name (case-insensitive)
      const filteredMockCertificates = mockCertificates.filter(
        (mock) =>
          !backendCertificates.some(
            (backend) =>
              backend.name.trim().toLowerCase() === mock.name.trim().toLowerCase()
          )
      );

      const merged = [...filteredMockCertificates, ...backendCertificates];
      setCertificates(merged);
    } catch (err) {
      console.error("Error fetching backend certificates:", err);
    }
  };

  fetchCertificates();
}, [user]);

const handleStatusChange = async (id: string, newStatus: string) => {
  try {
    const response = await axios.patch(
  `${import.meta.env.VITE_API_URL}/api/certificates/${id}/status`,
  { status: newStatus }
);


    if (response.status === 200) {
      setCertificates((prev) =>
        prev.map((cert) =>
          (cert._id ?? cert.id)?.toString() === id.toString()
            ? { ...cert, status: newStatus }
            : cert
        )
      );
    }
  } catch (error) {
    console.error("Failed to update status:", error);
    alert("❌ Couldn't update status. Try again.");
  }
};

const handleDelete = async (id: string) => {
  if (!window.confirm("Are you sure you want to delete this certificate?")) return;

  try {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/certificates/${id}`);
    if (res.status === 200) {
      setCertificates((prev) =>
        prev.filter((cert) => (cert._id ?? cert.id)?.toString() !== id.toString())
      );
    }
  } catch (err) {
    console.error("❌ Error deleting certificate:", err);
    alert("Failed to delete certificate.");
  }
};



  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              Certificate Management
            </h1>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search certificates..."
                  className="pl-8 w-[200px] md:w-[300px]"
                />
              </div>
              <Button asChild className="bg-maroon-700 hover:bg-maroon-800">
                <Link to="/certificates/upload">Upload New</Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">All Certificates</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Deadlines</TabsTrigger>
            </TabsList>

            {["all", "pending", "completed", "upcoming"].map((tab) => (
              <TabsContent value={tab} className="mt-6" key={tab}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates
                    .filter((cert) => {
                      const status = cert.status;
                      if (tab === "completed") return status === "Completed";
                      if (tab === "pending")
                        return status === "Pending" || status === "In Progress";
                      if (tab === "upcoming") return status !== "Completed";
                      return true;
                    })
                    .map((certificate, index) => {
                      const color = getColorClasses(certificate.status);
                      
                      return (
                        <Card
                          key={`${certificate.name}-${index}`}
                          className={`overflow-hidden border-t-4 ${color.border}`}
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">
                                {certificate.name}
                              </CardTitle>
                              {certificate._id ?? certificate.id ? (
                                <select
                                  value={certificate.status}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      certificate._id.toString(),
                                      e.target.value
                                    )
                                  }
                                  className={`text-xs px-2 py-1 rounded border ${color.border} ${color.bg} ${color.text}`}
                                >
                                  {["Completed", "In Progress", "Pending"].map(
                                    (option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    )
                                  )}
                                </select>
                              ) : (
                                <div
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${color.bg} ${color.text}`}
                                >
                                  {certificate.status}
                                </div>
                              )}
                            </div>
                            <CardDescription>
                              {certificate.description}
                            </CardDescription>
                          </CardHeader>

                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="text-muted-foreground">
                                  {certificate.dueDate}
                                </span>
                              </div>

                              {certificate.status === "Completed" ? (
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center text-sm text-green-600">
                                    <Check className="h-4 w-4 mr-1" />
                                    <span>Approved</span>
                                  </div>
                                  {certificate.url ? (
                                    <Button asChild variant="outline" size="sm">
                                      <a
                                        href={certificate.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center"
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                      </a>
                                    </Button>
                                  ) : (
                                    <Button disabled variant="outline" size="sm">
                                      <Download className="h-3 w-3 mr-1" />
                                      No File
                                    </Button>
                                  )}
                                </div>
                                
                              ) : (
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-muted-foreground">
                                    {certificate.submissions?.[0]?.date
                                      ? `Last update: ${certificate.submissions[0].date}`
                                      : "No submissions yet"}
                                  </span>
                                  <Button asChild variant="secondary" size="sm">
                                    <Link
                                      to={`/certificates/${
                                        certificate._id || certificate.id
                                      }`}
                                    >
                                      View Details
                                    </Link>
                                  </Button>
                                </div>
                              )}
                            </div>
                            {certificate._id && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(certificate._id.toString())}
                                className="mt-2"
                              >
                                Delete
                              </Button>
                            )}

                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Certificates;
