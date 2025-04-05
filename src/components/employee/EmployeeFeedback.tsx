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
import { useAuth } from "@/hooks/useAuth";
import { users, feedbacks, addFeedback, Feedback } from "@/data/mockDatabase";

// Function to emit feedback update event
const notifyFeedbackUpdate = (feedback: any) => {
  const event = new CustomEvent('feedbackUpdate', { 
    detail: { feedback } 
  });
  window.dispatchEvent(event);
};

const EmployeeFeedback = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("give-feedback");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedColleague, setSelectedColleague] = useState<any>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    strengths: "",
    improvements: "",
    comments: "",
    rating: 0,
    isAnonymous: false,
    type: "Peer"
  });
  const [viewFeedbackDialog, setViewFeedbackDialog] = useState(false);
  const [viewingFeedback, setViewingFeedback] = useState<any>(null);

  // Filter out current user from colleagues list
  const colleagues = users.filter(u => u.role === 'employee' && u.id !== user?.id);

  // Get feedbacks for current user - both given and received
  const myGivenFeedbacks = feedbacks.filter(f => f.from === user?.id);
  // Include all feedback addressed to the current user, whether anonymous or not
  const myReceivedFeedbacks = feedbacks.filter(f => f.to === user?.id);

  const handleGiveFeedback = (colleague: any) => {
    setSelectedColleague(colleague);
    setFeedbackForm({
      strengths: "",
      improvements: "",
      comments: "",
      rating: 0,
      isAnonymous: false,
      type: "Peer" // Default to peer feedback
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

    // Convert comma-separated strengths and improvements to arrays
    const strengths = feedbackForm.strengths
      ? feedbackForm.strengths.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    
    const improvements = feedbackForm.improvements
      ? feedbackForm.improvements.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    // Prepare the new feedback data
    const newFeedback: Omit<Feedback, 'id'> = {
      from: user?.id || '',
      to: selectedColleague.id,
      type: feedbackForm.type as 'Peer' | 'Manager' | 'Upward',
      date: new Date().toISOString().split('T')[0],
      rating: feedbackForm.rating,
      strengths,
      improvements,
      comments: feedbackForm.comments,
      isAnonymous: feedbackForm.isAnonymous
    };

    // Add the new feedback to our database
    const addedFeedback = addFeedback(newFeedback);
    
    // Emit event to update charts
    notifyFeedbackUpdate(addedFeedback);
    
    toast({
      title: "Feedback Submitted",
      description: `Your feedback for ${selectedColleague.name} has been successfully submitted.`,
    });
    
    setDialogOpen(false);
  };

  const handleViewFeedback = (feedback: any) => {
    // Find the complete feedback details if we're viewing received feedback
    const feedbackDetails = activeTab === "received-feedback" 
      ? feedbacks.find(f => f.id === feedback.id)
      : feedback;
      
    // For received anonymous feedback, hide the sender information
    if (feedbackDetails && feedbackDetails.isAnonymous && activeTab === "received-feedback" && feedbackDetails.from !== 'HR001') {
      setViewingFeedback({
        ...feedbackDetails,
        from: "Anonymous",
        fromImage: ""
      });
    } else {
      setViewingFeedback(feedbackDetails);
    }
    
    setViewFeedbackDialog(true);
  };

  const handleFeedbackTypeChange = (value: string) => {
    setFeedbackForm(prev => ({ ...prev, type: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 w-full"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Employee Feedback</h2>
        <p className="text-muted-foreground">Give and track feedback for colleagues and management</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6">
          <TabsTrigger value="give-feedback">Give Feedback</TabsTrigger>
          <TabsTrigger value="my-feedback">Given Feedback</TabsTrigger>
          <TabsTrigger value="received-feedback">Received Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="give-feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Colleagues</CardTitle>
              <CardDescription>Select from colleagues to give feedback</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {colleagues.map((colleague) => (
                <div key={colleague.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-4">
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
                    Give Feedback
                  </Button>
                </div>
              ))}
              {user?.role === 'employee' && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={users.find(u => u.id === 'HR001')?.image} alt="HR Manager" />
                      <AvatarFallback>HR</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{users.find(u => u.id === 'HR001')?.name}</p>
                      <p className="text-sm text-muted-foreground">HR Manager • Human Resources</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleGiveFeedback(users.find(u => u.id === 'HR001'))}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Give Feedback
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-feedback" className="space-y-4">
          {myGivenFeedbacks.length > 0 ? (
            myGivenFeedbacks.map((feedback) => {
              const feedbackTo = users.find(u => u.id === feedback.to);
              return (
                <Card key={feedback.id} className="shadow-card hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={feedbackTo?.image} alt={feedbackTo?.name} />
                          <AvatarFallback>{feedbackTo?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{feedbackTo?.name}</CardTitle>
                          <CardDescription>{feedbackTo?.position}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 items-end sm:items-start">
                        <Badge variant="outline">{feedback.type} Feedback</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(feedback.date).toLocaleDateString()}
                        </span>
                        {feedback.isAnonymous && (
                          <Badge variant="secondary">Anonymous</Badge>
                        )}
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
              );
            })
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Feedback Given Yet</h3>
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

        <TabsContent value="received-feedback" className="space-y-4">
          {myReceivedFeedbacks.length > 0 ? (
            myReceivedFeedbacks.map((feedback) => {
              const feedbackFrom = feedback.isAnonymous && feedback.from !== 'HR001'
                ? { name: "Anonymous", position: "", image: "" }
                : users.find(u => u.id === feedback.from);
              
              return (
                <Card key={feedback.id} className="shadow-card hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex items-center space-x-4">
                        {!feedback.isAnonymous || feedback.from === 'HR001' ? (
                          <Avatar>
                            <AvatarImage src={feedbackFrom?.image} alt={feedbackFrom?.name} />
                            <AvatarFallback>{feedbackFrom?.name?.charAt(0) || "A"}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar>
                            <AvatarFallback>A</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <CardTitle>{feedbackFrom?.name}</CardTitle>
                          {!feedback.isAnonymous && <CardDescription>{feedbackFrom?.position}</CardDescription>}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 items-end sm:items-start">
                        <Badge variant="outline">{feedback.type} Feedback</Badge>
                        <span className="text-sm text-muted-foreground">
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
              );
            })
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Feedback Received Yet</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  You haven't received any feedback yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
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
                  <Select 
                    defaultValue="Peer"
                    onValueChange={handleFeedbackTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Peer">Peer Feedback</SelectItem>
                      {selectedColleague.role === 'hr' && (
                        <SelectItem value="Upward">Upward Feedback</SelectItem>
                      )}
                      {user?.role === 'hr' && (
                        <SelectItem value="Manager">Manager Feedback</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    checked={feedbackForm.isAnonymous}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isAnonymous" className="text-sm">
                    Submit anonymously
                  </Label>
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
                  <Label htmlFor="strengths">Strengths (comma-separated)</Label>
                  <Input
                    id="strengths"
                    name="strengths"
                    placeholder="Technical skills, Communication, Problem-solving"
                    value={feedbackForm.strengths}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improvements">Areas for Improvement (comma-separated)</Label>
                  <Input
                    id="improvements"
                    name="improvements"
                    placeholder="Time management, Documentation"
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
        <DialogContent className="max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
            <DialogDescription>
              {activeTab === "received-feedback" ? "View feedback you've received" : "Review your submitted feedback"}
            </DialogDescription>
          </DialogHeader>
          
          {viewingFeedback && (
            <div className="py-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                {activeTab === "my-feedback" ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={users.find(u => u.id === viewingFeedback.to)?.image} alt={users.find(u => u.id === viewingFeedback.to)?.name} />
                        <AvatarFallback>{users.find(u => u.id === viewingFeedback.to)?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">To: {users.find(u => u.id === viewingFeedback.to)?.name}</h3>
                        <p className="text-sm text-muted-foreground">{users.find(u => u.id === viewingFeedback.to)?.position}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-4">
                      {viewingFeedback.from !== "Anonymous" ? (
                        <>
                          <Avatar>
                            <AvatarImage src={users.find(u => u.id === viewingFeedback.from)?.image} alt={users.find(u => u.id === viewingFeedback.from)?.name} />
                            <AvatarFallback>{users.find(u => u.id === viewingFeedback.from)?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">From: {users.find(u => u.id === viewingFeedback.from)?.name}</h3>
                            <p className="text-sm text-muted-foreground">{users.find(u => u.id === viewingFeedback.from)?.position}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Avatar>
                            <AvatarFallback>A</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">From: Anonymous</h3>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
                <div className="text-right">
                  <Badge variant="outline">{viewingFeedback.type} Feedback</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(viewingFeedback.date).toLocaleDateString()}
                  </p>
                  {viewingFeedback.isAnonymous && activeTab === "my-feedback" && (
                    <Badge variant="secondary" className="mt-1">Anonymous</Badge>
                  )}
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
                  {viewingFeedback.strengths && viewingFeedback.strengths.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {viewingFeedback.strengths.map((strength: string, index: number) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific strengths mentioned.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Areas for Improvement</Label>
                  {viewingFeedback.improvements && viewingFeedback.improvements.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {viewingFeedback.improvements.map((improvement: string, index: number) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No specific improvements mentioned.</p>
                  )}
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
