import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";

type Message = {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
};

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Certificate Submission Assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [showDialogflow, setShowDialogflow] = useState(false);

  // Load Dialogflow script dynamically
  useEffect(() => {
    if (showDialogflow) {
      const script = document.createElement('script');
      script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showDialogflow]);

  // Mock responses based on keywords
  const getBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("bonafide") || lowerQuery.includes("bonafide certificate")) {
      return "Bonafide certificates can be obtained from the Academic Section located in the Admin Block, 1st Floor. You need to submit Form A-7 along with your ID card. The processing time is usually 2-3 working days.";
    }
    
    if (lowerQuery.includes("exam") || lowerQuery.includes("examination") || lowerQuery.includes("fee")) {
      return "Examination fee receipts must be submitted to the Examination Department by April 30, 2025. You can pay the fees online through the university portal or at the cash counter in the Finance Department.";
    }
    
    if (lowerQuery.includes("course completion") || lowerQuery.includes("completion certificate")) {
      return "The Course Completion Certificate needs to be submitted by May 15, 2025. You can get it from your respective department after all your course requirements are fulfilled.";
    }
    
    if (lowerQuery.includes("transcript") || lowerQuery.includes("academic transcript")) {
      return "Academic Transcripts can be requested from the Examination Department. Fill Form E-12 and submit it along with the prescribed fee. Processing time is 7-10 working days.";
    }
    
    if (lowerQuery.includes("deadline") || lowerQuery.includes("due date")) {
      return "Here are the upcoming deadlines:\n1. Examination Fee Receipt: April 30, 2025\n2. Course Completion Certificate: May 15, 2025\n3. Academic Transcript: June 10, 2025\n4. No Dues Certificate: June 15, 2025\n5. Character Certificate: June 20, 2025";
    }
    
    if (lowerQuery.includes("location") || lowerQuery.includes("office") || lowerQuery.includes("where")) {
      return "The main submission offices are:\n1. Academic Section: Admin Block, 1st Floor\n2. Examination Department: Science Block, Ground Floor\n3. Student Affairs Office: Central Library, 2nd Floor\n\nYou can view exact locations and get directions in the Locations tab.";
    }
    
    if (lowerQuery.includes("help") || lowerQuery.includes("how to")) {
      return "To submit a certificate, follow these steps:\n1. Check the specific requirements for the certificate in your dashboard\n2. Obtain the certificate from the relevant department\n3. Visit the submission office before the deadline\n4. Keep the acknowledgment slip safe\n5. Track the status in your dashboard";
    }
    
    return "I'm not sure about that specific query. Would you like me to connect you with a student support representative? Or you can try asking in a different way.";
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleDialogflow = () => {
    setShowDialogflow(!showDialogflow);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Chat Interface */}
            <div className="w-full md:w-2/3">
              <Card className="h-[calc(100vh-250px)] flex flex-col">
                <CardContent className="flex flex-col h-full p-0">
                  <div className="bg-maroon-700 text-white p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Bot className="h-5 w-5 mr-2" />
                        <div>
                          <h2 className="text-xl font-semibold">AI Certificate Assistant</h2>
                          <p className="text-sm opacity-80">
                            Ask me anything about certificate submissions, deadlines, or locations
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={toggleDialogflow}
                        className="text-maroon-700 bg-white hover:bg-gray-100"
                      >
                        {showDialogflow ? 'Hide' : 'Show'} Advanced AI
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                      >
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          message.isBot 
                            ? "bg-white border border-gray-200 text-gray-800" 
                            : "bg-maroon-600 text-white"
                        }`}>
                          <div className="flex items-center mb-1">
                            {message.isBot ? (
                              <Bot className="h-4 w-4 mr-1" />
                            ) : (
                              <User className="h-4 w-4 mr-1" />
                            )}
                            <span className="text-xs font-medium">
                              {message.isBot ? "AI Assistant" : "You"}
                            </span>
                            <span className="text-xs ml-2 opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="whitespace-pre-line">
                            {message.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your question here..."
                        className="flex-grow"
                      />
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-maroon-700 hover:bg-maroon-800"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="w-full md:w-1/3 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Suggested Questions</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => {
                        setInput("What are the upcoming deadlines?");
                        handleSendMessage();
                      }}
                    >
                      What are the upcoming deadlines?
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => {
                        setInput("Where do I submit my bonafide certificate?");
                        handleSendMessage();
                      }}
                    >
                      Where do I submit my bonafide certificate?
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => {
                        setInput("How can I get my academic transcript?");
                        handleSendMessage();
                      }}
                    >
                      How can I get my academic transcript?
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => {
                        setInput("What is the procedure for certificate submission?");
                        handleSendMessage();
                      }}
                    >
                      What is the procedure for certificate submission?
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Need Human Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you need assistance from a real person, you can contact the student support team.
                  </p>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full">
                      Email Support
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Call Helpdesk
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Dialogflow Messenger (conditionally rendered) */}
      {showDialogflow && (
        <df-messenger
          intent="WELCOME"
          chat-title="JNTUH Advanced Assistant"
          agent-id="d7491958-2a2a-4f84-a092-edb4c96e54d8"
          language-code="en"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            width: '350px',
            height: '500px'
          }}
        ></df-messenger>
      )}
    </div>
  );
};

export default Chatbot;