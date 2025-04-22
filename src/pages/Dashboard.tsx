
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertTriangle, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data for certificates
  const certificates = [
    { id: 1, name: "Epass Certificate", status: "Completed", dueDate: "Submitted", priority: "low"},
    { id: 2, name: "Bonafide Certificate", status: "Completed", dueDate: "Submitted", priority: "low" },
    { id: 3, name: "Examination Fee Receipt", status: "completed", dueDate: "Apr 30, 2025", priority: "high" },
    { id: 4, name: "Course Completion Certificate", status: "In Progress", dueDate: "May 15, 2025", priority: "medium" },
    { id: 5, name: "Academic Transcript", status: "Not Started", dueDate: "Jun 10, 2025", priority: "medium" },
  ];

  // Mock data for upcoming deadlines
  const deadlines = [
    { id: 1, name: "Examination Fee Receipt", date: "Apr 30, 2025", daysLeft: 10 },
    { id: 2, name: "Course Completion Certificate", date: "May 15, 2025", daysLeft: 25 },
    { id: 3, name: "Academic Transcript", date: "Jun 10, 2025", daysLeft: 51 },
  ];

  // Calculate progress percentage
  const completedCount = certificates.filter(cert => cert.status === "Completed").length;
  const progressPercentage = (completedCount / certificates.length) * 100;

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

          {/* Progress Summary */}
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
                  <div className="text-2xl font-bold">
                    {certificates.filter(cert => cert.status === "In Progress").length}
                  </div>
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
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  <div className="text-2xl font-bold">
                    {certificates.filter(cert => cert.status === "Pending" || cert.status === "Not Started").length}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Certificates to submit</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Certificate List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Certificates</CardTitle>
                  <CardDescription>
                    Track the status of your required certificates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {certificates.map(certificate => (
                      <div 
                        key={certificate.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center
                            ${certificate.status === "Completed" ? "bg-green-100 text-green-700" : 
                              certificate.status === "In Progress" ? "bg-blue-100 text-blue-700" : 
                              certificate.priority === "high" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`
                          }>
                            {certificate.status === "Completed" ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : certificate.status === "In Progress" ? (
                              <Clock className="h-5 w-5" />
                            ) : (
                              <AlertTriangle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">{certificate.name}</h4>
                            <p className="text-sm text-muted-foreground">Due: {certificate.dueDate}</p>
                          </div>
                        </div>
                        <div>
                          <Link 
                            to={`/certificates/${certificate.id}`}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deadlines.map(deadline => (
                      <div 
                        key={deadline.id}
                        className="flex items-start space-x-3"
                      >
                        <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center
                          ${deadline.daysLeft <= 10 ? "bg-red-100 text-red-700" : 
                            deadline.daysLeft <= 30 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`
                        }>
                          <Calendar className="h-3 w-3" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{deadline.name}</h4>
                          <p className="text-xs text-muted-foreground">Due: {deadline.date}</p>
                          <p className={`text-xs font-medium ${
                            deadline.daysLeft <= 10 ? "text-red-600" : 
                            deadline.daysLeft <= 30 ? "text-amber-600" : "text-gray-600"
                          }`}>
                            {deadline.daysLeft} days remaining
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Nearest Submission Centers */}
              <Card>
                <CardHeader>
                  <CardTitle>Nearest Submission Centers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 h-6 w-6 rounded-full bg-maroon-100 text-maroon-700 flex items-center justify-center">
                        <MapPin className="h-3 w-3" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Academic Section</h4>
                        <p className="text-xs text-muted-foreground">Admin Block, 1st Floor</p>
                        <Link 
                          to="/locations"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Get Directions
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 h-6 w-6 rounded-full bg-maroon-100 text-maroon-700 flex items-center justify-center">
                        <MapPin className="h-3 w-3" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Examination Department</h4>
                        <p className="text-xs text-muted-foreground">Science Block, Ground Floor</p>
                        <Link 
                          to="/locations"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Get Directions
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 h-6 w-6 rounded-full bg-maroon-100 text-maroon-700 flex items-center justify-center">
                        <MapPin className="h-3 w-3" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Student Affairs Office</h4>
                        <p className="text-xs text-muted-foreground">Central Library, 2nd Floor</p>
                        <Link 
                          to="/locations"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Get Directions
                        </Link>
                      </div>
                    </div>
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
