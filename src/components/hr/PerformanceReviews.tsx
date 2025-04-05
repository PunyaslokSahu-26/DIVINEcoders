
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, CheckCircle, Clock, FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

// Mock data
const ongoingReviews = [
  { id: 1, employee: "Rahul Sharma", position: "Frontend Developer", department: "Engineering", deadline: "2023-12-15", progress: 75, started: "2023-11-01", image: "https://i.pravatar.cc/150?img=1" },
  { id: 2, employee: "Emily Johnson", position: "Marketing Specialist", department: "Marketing", deadline: "2023-12-20", progress: 50, started: "2023-11-05", image: "https://i.pravatar.cc/150?img=5" },
  { id: 3, employee: "Sneha Patel", position: "Product Manager", department: "Product", deadline: "2023-12-18", progress: 25, started: "2023-11-10", image: "https://i.pravatar.cc/150?img=9" },
];

const pastReviews = [
  { id: 101, employee: "Sneha Patel", position: "UX Designer", department: "Design", completedDate: "2023-06-15", rating: 4.5, reviewPeriod: "Q2 2023", image: "https://i.pravatar.cc/150?img=10" },
  { id: 102, employee: "Naveen Joshi", position: "Backend Developer", department: "Engineering", completedDate: "2023-09-30", rating: 4.2, reviewPeriod: "Q3 2023", image: "https://i.pravatar.cc/150?img=12" },
  { id: 103, employee: "Santoshi Gupta", position: "Content Writer", department: "Marketing", completedDate: "2023-03-20", rating: 3.8, reviewPeriod: "Q1 2023", image: "https://i.pravatar.cc/150?img=20" },
];

const PerformanceReviews = () => {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewInfo, setReviewInfo] = useState<any>(null);

  const handleViewReview = (review: any) => {
    setReviewInfo(review);
    setDialogOpen(true);
  };

  const handleCreateNewCycle = () => {
    toast({
      title: "New Review Cycle Created",
      description: "The new performance review cycle has been initiated.",
    });
  };

  const handleCompleteReview = (id: number) => {
    toast({
      title: "Review Completed",
      description: "The performance review has been marked as completed.",
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
          <h2 className="text-2xl font-bold">Performance Reviews</h2>
          <p className="text-muted-foreground">Track ongoing and past employee performance evaluations</p>
        </div>
        <Button onClick={handleCreateNewCycle}>
          <FileText className="mr-2 h-4 w-4" />
          Create New Cycle
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="ongoing">Ongoing Reviews</TabsTrigger>
          <TabsTrigger value="past">Past Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing" className="space-y-4">
          {ongoingReviews.map((review) => (
            <Card key={review.id} className="shadow-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={review.image} alt={review.employee} />
                      <AvatarFallback>{review.employee.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{review.employee}</CardTitle>
                      <CardDescription>{review.position} • {review.department}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>Deadline: {new Date(review.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>Started: {new Date(review.started).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{review.progress}%</span>
                  </div>
                  <Progress value={review.progress} className="h-2" />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <Badge variant={
                    review.progress < 30 ? "destructive" : 
                    review.progress < 70 ? "outline" : 
                    "default"
                  }>
                    {review.progress < 30 ? "At Risk" : 
                     review.progress < 70 ? "In Progress" : 
                     "Almost Complete"}
                  </Badge>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewReview(review)}>
                      View Details
                    </Button>
                    <Button size="sm" onClick={() => handleCompleteReview(review.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastReviews.map((review) => (
            <Card key={review.id} className="shadow-card hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={review.image} alt={review.employee} />
                      <AvatarFallback>{review.employee.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{review.employee}</CardTitle>
                      <CardDescription>{review.position} • {review.department}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      Rating: {review.rating}/5
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <span>Completed: {new Date(review.completedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">
                    {review.reviewPeriod}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => handleViewReview(review)}>
                    View Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {activeTab === "ongoing" ? "Review Details" : "Performance Report"}
            </DialogTitle>
            <DialogDescription>
              {activeTab === "ongoing" 
                ? "View and manage the ongoing performance review." 
                : "View the completed performance evaluation report."}
            </DialogDescription>
          </DialogHeader>
          
          {reviewInfo && (
            <div className="py-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={reviewInfo.image} alt={reviewInfo.employee} />
                  <AvatarFallback>{reviewInfo.employee?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{reviewInfo.employee}</h3>
                  <p className="text-sm text-muted-foreground">{reviewInfo.position} • {reviewInfo.department}</p>
                </div>
              </div>

              {activeTab === "ongoing" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Review Period</Label>
                    <div className="text-sm">
                      {new Date(reviewInfo.started).toLocaleDateString()} - {new Date(reviewInfo.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Progress</Label>
                    <Progress value={reviewInfo.progress} className="h-2 mb-1" />
                    <div className="text-sm text-muted-foreground">
                      {reviewInfo.progress}% complete
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Review Notes</Label>
                    <textarea
                      id="notes"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Add your review notes here..."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Review Period</Label>
                    <div className="text-sm">{reviewInfo.reviewPeriod}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Completion Date</Label>
                    <div className="text-sm">{new Date(reviewInfo.completedDate).toLocaleDateString()}</div>
                  </div>

                  <div className="space-y-2">
                    <Label>Overall Rating</Label>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">{reviewInfo.rating}</span>
                      <span className="text-sm text-muted-foreground">out of 5</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Performance Summary</Label>
                    <div className="text-sm p-3 bg-muted rounded-md">
                      This is a placeholder for the performance summary. In a real application, this would contain a detailed assessment of the employee's performance during the review period.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {activeTab === "ongoing" ? (
              <>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  toast({
                    title: "Changes Saved",
                    description: "The review has been updated successfully.",
                  });
                  setDialogOpen(false);
                }}>Save Changes</Button>
              </>
            ) : (
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default PerformanceReviews;
