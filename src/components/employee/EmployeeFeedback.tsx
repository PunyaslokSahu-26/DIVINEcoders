
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Star } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

// Mock data for colleagues
const colleagues = [
  { id: 1, name: "David Rodriguez", position: "Backend Developer", department: "Engineering", image: "https://i.pravatar.cc/150?img=12" },
  { id: 2, name: "Emily Johnson", position: "Marketing Specialist", department: "Marketing", image: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Michael Chen", position: "Product Manager", department: "Product", image: "https://i.pravatar.cc/150?img=9" },
  { id: 4, name: "Sarah Williams", position: "UX Designer", department: "Design", image: "https://i.pravatar.cc/150?img=10" },
  { id: 5, name: "James Wilson", position: "HR Manager", department: "Human Resources", image: "https://i.pravatar.cc/150?img=15" },
];

// Mock data for previously submitted feedback
const previousFeedback = [
  { 
    id: 101, 
    to: "David Rodriguez", 
    position: "Backend Developer",
    type: "Peer",
    date: "2023-11-15", 
    rating: 4,
    strengths: ["Technical knowledge", "Problem-solving", "Team player"],
    improvements: ["Documentation", "Knowledge sharing"],
    comments: "David has been an excellent collaborator on our recent project. His technical skills were crucial to our success.",
    image: "https://i.pravatar.cc/150?img=12"
  },
  { 
    id: 102, 
    to: "James Wilson", 
    position: "HR Manager",
    type: "Manager",
    date: "2023-10-20", 
    rating: 5,
    strengths: ["Leadership", "Communication", "Empathy"],
    improvements: ["Process efficiency"],
    comments: "James has been a supportive manager who provides clear guidance and addresses team concerns promptly.",
    image: "https://i.pravatar.cc/150?img=15"
  },
];

const EmployeeFeedback = () => {
  const [activeTab, setActiveTab] = useState("give-feedback");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedColleague, setSelectedColleague] = useState<any>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    strengths: "",
    improvements: "",
    comments: "",
    rating: 0
  });
  const [viewFeedbackDialog, setViewFeedbackDialog] = useState(false);
  const [viewingFeedback, setViewingFeedback] = useState<any>(null);

  const handleGiveFeedback = (colleague: any) => {
    setSelectedColleague(colleague);
    setFeedbackForm({
      strengths: "",
      improvements: "",
      comments: "",
      rating: 0
    });
    setDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitFeedback = () => {
    if (!feedbackForm.comments || feedbackForm.rating === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a rating and comments for your feedback.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feedback Submitted",
      description: `Your feedback for ${selectedColleague.name} has been successfully submitted.`,
    });
    
    setDialogOpen(false);
  };

  const handleViewFeedback = (feedback: any) => {
    setViewingFeedback(feedback);
    setViewFeedbackDialog(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Employee Feedback</h2>
        <p className="text-muted-foreground">Give and track feedback for colleagues and management</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="give-feedback">Give Your Feedback</TabsTrigger>
          <TabsTrigger value="my-feedback">My Previous Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="give-feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Colleagues</CardTitle>
              <CardDescription>Select from colleagues to give feedback</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {colleagues.map((colleague) => (
                <div key={colleague.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={colleague.image} alt={colleague.name} />
                      <AvatarFallback>{colleague.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{colleague.name}</p>
                      <p className="text-sm text-muted-foreground">{colleague.position} • {colleague.department}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleGiveFeedback(colleague)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Give Your Feedback
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-feedback" className="space-y-4">
          {previousFeedback.length > 0 ? (
            previousFeedback.map((feedback) => (
              <Card key={feedback.id} className="shadow-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={feedback.image} alt={feedback.to} />
                        <AvatarFallback>{feedback.to.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{feedback.to}</CardTitle>
                        <CardDescription>{feedback.position}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline">{feedback.type} Feedback</Badge>
                      <span className="text-sm text-muted-foreground mt-1">
                        {new Date(feedback.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <span className="mr-2 font-medium">Rating:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-5 w-5 ${star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm line-clamp-2">{feedback.comments}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="ml-auto"
                    onClick={() => handleViewFeedback(feedback)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Feedback Yet</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  You haven't provided any feedback yet.
                </p>
                <Button variant="outline" onClick={() => setActiveTab("give-feedback")}>
                  Give Your First Feedback
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
            <DialogDescription>
              Share your thoughts and feedback for your colleague.
            </DialogDescription>
          </DialogHeader>
          
          {selectedColleague && (
            <div className="py-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedColleague.image} alt={selectedColleague.name} />
                  <AvatarFallback>{selectedColleague.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedColleague.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedColleague.position} • {selectedColleague.department}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedbackType">Feedback Type</Label>
                  <Select defaultValue="peer">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="peer">Peer Feedback</SelectItem>
                      <SelectItem value="manager">Manager Feedback</SelectItem>
                      <SelectItem value="upward">Upward Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-6 w-6 cursor-pointer ${star <= feedbackForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="strengths">Strengths</Label>
                  <Input
                    id="strengths"
                    name="strengths"
                    placeholder="What are their key strengths?"
                    value={feedbackForm.strengths}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improvements">Areas for Improvement</Label>
                  <Input
                    id="improvements"
                    name="improvements"
                    placeholder="What could they improve on?"
                    value={feedbackForm.improvements}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Detailed Feedback</Label>
                  <Textarea
                    id="comments"
                    name="comments"
                    placeholder="Provide detailed feedback and specific examples..."
                    className="min-h-[100px]"
                    value={feedbackForm.comments}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitFeedback}>
              <Send className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewFeedbackDialog} onOpenChange={setViewFeedbackDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              Review your submitted feedback.
            </DialogDescription>
          </DialogHeader>
          
          {viewingFeedback && (
            <div className="py-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={viewingFeedback.image} alt={viewingFeedback.to} />
                    <AvatarFallback>{viewingFeedback.to.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{viewingFeedback.to}</h3>
                    <p className="text-sm text-muted-foreground">{viewingFeedback.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{viewingFeedback.type} Feedback</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(viewingFeedback.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= viewingFeedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Strengths</Label>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {viewingFeedback.strengths.map((strength: string, index: number) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label>Areas for Improvement</Label>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {viewingFeedback.improvements.map((improvement: string, index: number) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label>Detailed Feedback</Label>
                  <p className="text-sm p-3 bg-muted rounded-md">
                    {viewingFeedback.comments}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setViewFeedbackDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EmployeeFeedback;
