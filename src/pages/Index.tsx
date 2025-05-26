
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ArrowRight, CheckCircle, MapPin, MessageCircle, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-maroon-50 to-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-maroon-900 leading-tight">
              Certificate Submission Made Simple
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-md">
              A centralized solution that reduces confusion, saves time, and ensures accurate and up-to-date information.
            </p>
            <div className="mt-8 space-x-4">
              <Button asChild size="lg" className="bg-maroon-700 hover:bg-maroon-800">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://media.wcnc.com/assets/WCNC/images/fb371d0f-ea16-4f59-a9a6-8d8fc72d4e10/fb371d0f-ea16-4f59-a9a6-8d8fc72d4e10_1920x1080.jpg" 
              alt="Certificate Submission Assistant" 
              className="rounded-lg shadow-xl w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-maroon-100 text-maroon-700 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certificate Checklist</h3>
              <p className="text-gray-600">Personalized certificate lists tailored to your program and requirements.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-maroon-100 text-maroon-700 rounded-full flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Location Services</h3>
              <p className="text-gray-600">Easy navigation to submission offices via integrated Google Maps.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-maroon-100 text-maroon-700 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Chatbot</h3>
              <p className="text-gray-600">Instant query support to answer all your certificate-related questions.</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-maroon-100 text-maroon-700 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Notifications</h3>
              <p className="text-gray-600">Deadline alerts and updates to keep you on track with your submissions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-full bg-maroon-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Register</h3>
              <p className="text-gray-600">Create your account with your university credentials.</p>
            </div>
            <div className="hidden md:block">
              <ArrowRight className="h-8 w-8 text-maroon-300 mt-8" />
            </div>
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-full bg-maroon-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">View Your Checklist</h3>
              <p className="text-gray-600">See all required certificates specific to your program.</p>
            </div>
            <div className="hidden md:block">
              <ArrowRight className="h-8 w-8 text-maroon-300 mt-8" />
            </div>
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-full bg-maroon-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Find Locations</h3>
              <p className="text-gray-600">Get directions to the right submission offices.</p>
            </div>
            <div className="hidden md:block">
              <ArrowRight className="h-8 w-8 text-maroon-300 mt-8" />
            </div>
            <div className="flex-1 text-center">
              <div className="h-16 w-16 rounded-full bg-maroon-700 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your submission status and receive updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <p className="italic text-gray-600 mb-4">"The Certificate Submission Assistant saved me from missing important deadlines. The checklist feature is a lifesaver!"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-maroon-200 flex items-center justify-center mr-3">
                  <span className="text-maroon-700 font-medium">SK</span>
                </div>
                <div>
                  <h4 className="font-semibold">Sakshi K.</h4>
                  <p className="text-sm text-gray-500">B.Tech CSE, 3rd Year</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <p className="italic text-gray-600 mb-4">"Finding the right office for submission was always a challenge. The location service makes it so much easier now!"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-maroon-200 flex items-center justify-center mr-3">
                  <span className="text-maroon-700 font-medium">RJ</span>
                </div>
                <div>
                  <h4 className="font-semibold">Rahul J.</h4>
                  <p className="text-sm text-gray-500">M.Tech, 1st Year</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <p className="italic text-gray-600 mb-4">"The AI chatbot answered all my questions instantly. No more waiting in long queues at the admin office!"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-maroon-200 flex items-center justify-center mr-3">
                  <span className="text-maroon-700 font-medium">AP</span>
                </div>
                <div>
                  <h4 className="font-semibold">Anjali P.</h4>
                  <p className="text-sm text-gray-500">B.Tech ECE, 4th Year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-maroon-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to simplify your certificate submissions?</h2>
          <p className="max-w-md mx-auto mb-8">Join thousands of students who are saving time and avoiding confusion with our certificate management system.</p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-maroon-700 hover:bg-gray-100">
            <Link to="/register">Sign Up Now</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

// Index.tsx (anywhere before export)
import(/* webpackPrefetch: true */ "@/pages/Register");


export default Index;
