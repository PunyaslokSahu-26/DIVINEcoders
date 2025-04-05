
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const feedbackData = [
  { 
    id: 1, 
    type: "peer", 
    from: "Emily Johnson", 
    to: "John Smith", 
    date: "2023-11-25", 
    summary: "Great collaboration on the frontend project", 
    strengths: ["Technical skills", "Communication", "Problem-solving"],
    improvements: ["Could delegate more tasks", "Time management"],
    fromImage: "https://i.pravatar.cc/150?img=5",
    toImage: "https://i.pravatar.cc/150?img=1"
  },
  { 
    id: 2, 
    type: "manager", 
    from: "David Rodriguez", 
    to: "Sarah Williams", 
    date: "2023-11-20", 
    summary: "Excellent design work on the new product", 
    strengths: ["Creativity", "Attention to detail", "User empathy"],
    improvements: ["Meeting deadlines", "Presenting work to stakeholders"],
    fromImage: "https://i.pravatar.cc/150?img=12",
    toImage: "https://i.pravatar.cc/150?img=10"
  },
  { 
    id: 3, 
    type: "360", 
    from: "Multiple Sources", 
    to: "Michael Chen", 
    date: "2023-11-15", 
    summary: "Overall positive feedback on project management", 
    strengths: ["Leadership", "Strategic thinking", "Team building"],
    improvements: ["Technical knowledge", "Work-life balance"],
    fromImage: "",
    toImage: "https://i.pravatar.cc/150?img=9"
  },
];

const FeedbackHub = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  const filteredFeedback = activeTab === "all" 
    ? feedbackData 
    : feedbackData.filter(feedback => feedback.type === activeTab);

  const handleViewFeedback = (feedback: any) => {
    setSelectedFeedback(feedback);
    setDialogOpen(true);
  };

  const handleCreateFeedback = () => {
    toast({
      title: "Feedback Request Sent",
      description: "The 360° feedback request has been sent to the selected participants.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">360° Feedback Hub</h2>
          <p className="text-muted-foreground">View feedback from peers, managers, and subordinates</p>
        </div>
        <Button onClick={handleCreateFeedback}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Request Feedback
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="peer">Peer</TabsTrigger>
          <TabsTrigger value="manager">Manager</TabsTrigger>
          <TabsTrigger value="360">360° Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((feedback) => (
              <Card key={feedback.id} className="shadow-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          feedback.type === "peer" ? "outline" : 
                          feedback.type === "manager" ? "secondary" : 
                          "default"
                        }>
                          {feedback.type === "peer" ? "Peer Feedback" : 
                           feedback.type === "manager" ? "Manager Feedback" : 
                           "360° Review"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(feedback.date).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle>Feedback for {feedback.to}</CardTitle>
                      <CardDescription>From: {feedback.from}</CardDescription>
                    </div>
                    <div className="flex">
                      {feedback.type === "360" ? (
                        <Avatar className="h-10 w-10 border-2 border-background">
                          <AvatarImage src={feedback.toImage} alt={feedback.to} />
                          <AvatarFallback>{feedback.to.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="flex -space-x-2">
                          <Avatar className="h-10 w-10 border-2 border-background">
                            <AvatarImage src={feedback.fromImage} alt={feedback.from} />
                            <AvatarFallback>{feedback.from.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <Avatar className="h-10 w-10 border-2 border-background">
                            <AvatarImage src={feedback.toImage} alt={feedback.to} />
                            <AvatarFallback>{feedback.to.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">{feedback.summary}</p>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewFeedback(feedback)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Feedback Found</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  There is no feedback data for this category yet.
                </p>
                <Button variant="outline" onClick={handleCreateFeedback}>
                  Request New Feedback
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              Detailed feedback information and assessment.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Badge variant={
                    selectedFeedback.type === "peer" ? "outline" : 
                    selectedFeedback.type === "manager" ? "secondary" : 
                    "default"
                  }>
                    {selectedFeedback.type === "peer" ? "Peer Feedback" : 
                     selectedFeedback.type === "manager" ? "Manager Feedback" : 
                     "360° Review"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Date: {new Date(selectedFeedback.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 text-right">
                    <p className="text-sm font-medium">To: {selectedFeedback.to}</p>
                    <p className="text-sm text-muted-foreground">From: {selectedFeedback.from}</p>
                  </div>
                  {selectedFeedback.type === "360" ? (
                    <Avatar>
                      <AvatarImage src={selectedFeedback.toImage} alt={selectedFeedback.to} />
                      <AvatarFallback>{selectedFeedback.to.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex -space-x-2">
                      <Avatar className="border-2 border-background">
                        <AvatarImage src={selectedFeedback.fromImage} alt={selectedFeedback.from} />
                        <AvatarFallback>{selectedFeedback.from.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Avatar className="border-2 border-background">
                        <AvatarImage src={selectedFeedback.toImage} alt={selectedFeedback.to} />
                        <AvatarFallback>{selectedFeedback.to.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Summary</Label>
                  <p className="text-sm p-3 bg-muted rounded-md">
                    {selectedFeedback.summary}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Strengths</Label>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {selectedFeedback.strengths.map((strength: string, index: number) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label>Areas for Improvement</Label>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {selectedFeedback.improvements.map((improvement: string, index: number) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FeedbackHub;
