import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Building, Clock, Calendar } from "lucide-react";

const Locations = () => {
  // Mock data for submission locations - all with same coordinates
  const locations = [
    {
      id: 1,
      name: "Academic Section",
      building: "Admin Block",
      floor: "1st Floor",
      room: "A-105",
      hours: "9:00 AM - 5:00 PM",
      days: "Monday - Friday",
      coordinates: { lat: 17.4952, lng: 78.393 },
      certificates: ["Bonafide Certificate", "Character Certificate","Epass certificate","Metro pass"],
      contact: "+91 40 2272 1058",
      image: "https://assets.collegedunia.com/public/college_data/images/og_images/news/1664545148-pasted-image-0---2022-09-30T190558.285.png"
    },
    {
      id: 2,
      name: "Examination Department",
      building: "Exam centre",
      floor: "Ground Floor",
      room: "counter-1",
      hours: "10:00 AM - 5:00 PM",
      days: "Monday - Saturday",
      coordinates: { lat: 17.495331, lng: 78.392880 },
      certificates: ["Examination Fee Receipt","memos", "Academic Transcript"],
      contact: "+91 40 2272 2060",
      image: "https://tse3.mm.bing.net/th/id/OIP.1D9RH335ullfq3kguJ3mSQHaC9?w=1248&h=500&rs=1&pid=ImgDetMain"
    },
    {
      id: 3,
      name: "counter services",
      building: "SBI",
      floor: "1st Floor",
      room: "-",
      hours: "9:30 AM - 4:30 PM",
      days: "Monday - Friday",
      coordinates: { lat: 17.494080, lng: 78.3935626 },
      certificates: ["4th year graduation certificates like ODE.."],
      contact: "+91 40 2272 3042",
      image: "https://media-hosting.imagekit.io/9a599ca3a39a4f7b/1.png?Expires=1839937009&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=UDaQgLtBHKs1Jyv72dN2R76zn6rwxROxs8nNMyTGEFQ96prOao-21sLE-DBzNazsoRLJ4I-HAPOG7~i9OLqmp0tcl7f~uk~UuA3wzqGwYBAjwLF73bDc0b2PpG6XuwNGbc3Tfrdc0Pf1ySNVJAdAyqnWWiKNBnOBg6JnjGj0bWlQtX6GJBTJQLltfIcQavoFNJLDP4EUKkMCOGTP6W434BEPGL1UziKwaG9VlDSVwHaqMQD80o4RENGOsF5ec2X87PCsng50BfejdmMq4dDLqA5zBbgZsc6Z12GE7a6m6riVLQndheClFdzbsI0sf-Z~AQdp-jOt26nj2majmw6~wA__"
    },
    {
      id: 4,
      name: "Department Office - CSE",
      building: "Engineering Block",
      floor: "Ground Floor",
      room: "G2 beside",
      hours: "10:00 AM - 5:00 PM",
      days: "Monday-Friday",
      coordinates: { lat: 17.493388, lng: 78.392391 },
      certificates: ["Event certificates (Technical events)", "Project Completion Certificate"],
      contact: "+91 40 2272 4120",
      image: "https://tse4.mm.bing.net/th/id/OIP.DWjPz_C3-ecx59ERfLO6gAHaC4?rs=1&pid=ImgDetMain"
    },
    {
      id: 5,
      name: "Placement Cell",
      building: "Training & Placement Building",
      floor: "3rd Floor",
      room: "303",
      hours: "9:00 AM - 5:00 PM",
      days: "Monday - Friday",
      coordinates: { lat: 17.493036, lng: 78.391561 },
      certificates: ["Internship Certificate", "Placement Verification"],
      contact: "+91 40 2272 5215",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500"
    },
  ];

  // Function to handle getting directions
  const handleGetDirections = (lat: number, lng: number) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">Submission Locations</h1>
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Search locations or certificates..." 
                  className="pl-8 w-[300px]" 
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="list" className="mb-8">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {locations.map(location => (
                  <Card key={location.id} className="overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={location.image} 
                        alt={location.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{location.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Building className="h-4 w-4 mr-1" /> 
                            {location.building}, {location.floor}, Room {location.room}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">Office Hours</p>
                              <p className="text-xs text-muted-foreground">{location.hours}</p>
                              <p className="text-xs text-muted-foreground">{location.days}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Contact</p>
                            <p className="text-xs text-muted-foreground">{location.contact}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Certificates Handled</p>
                          <div className="flex flex-wrap gap-2">
                            {location.certificates.map((cert, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 bg-maroon-100 text-maroon-800 rounded-full text-xs"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center"
                            onClick={() => handleGetDirections(location.coordinates.lat, location.coordinates.lng)}
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>Get Directions</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="map" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="relative h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center p-8">
                      <MapPin className="h-12 w-12 text-maroon-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Campus Map View</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-4">
                        Interactive campus map showing all certificate submission locations
                      </p>
                      <Button 
                        className="bg-maroon-700 hover:bg-maroon-800"
                        onClick={() => handleGetDirections(17.4952, 78.393)}
                      >
                        Enable Google Maps
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Submission Guidelines</CardTitle>
              <CardDescription>
                Important information about submitting certificates at the university
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Working Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Most submission offices are open from 9:00 AM to 5:00 PM, Monday through Friday. Some offices have special hours, please check the specific location details above.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Required Documents</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    When visiting a submission office, please bring the following:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    <li>Original certificate document</li>
                    <li>Photocopy of the certificate</li>
                    <li>Student ID card</li>
                    <li>Submission form (if applicable)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Special Instructions</h3>
                  <p className="text-sm text-muted-foreground">
                    During peak submission periods (end of semester), offices may experience high traffic. It's recommended to visit during mid-morning or mid-afternoon for shorter wait times.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Locations;