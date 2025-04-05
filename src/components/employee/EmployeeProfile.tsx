import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, MapPin, Phone, Mail, Pencil, Star, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { feedbacks } from "@/data/mockDatabase";

const EmployeeProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "+91 98765 43210",
    location: "India",
    about: "Experienced frontend developer with expertise in React, TypeScript, and modern web technologies. Passionate about creating intuitive user interfaces and optimizing web performance.",
    skills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Redux", "Tailwind CSS"],
  });
  const [activeTab, setActiveTab] = useState("info");
  
  // State for feedback stats
  const [feedbackStats, setFeedbackStats] = useState({
    averageRating: 0,
    totalFeedbacks: 0,
    lastFiveRatings: [] as number[],
    ratingDistribution: [0, 0, 0, 0, 0], // Count of 1, 2, 3, 4, 5 star ratings
    ratingsOverTime: [] as {date: string, rating: number}[]
  });

  // Function to calculate feedback stats
  const calculateFeedbackStats = () => {
    if (!user) return;
    
    // Filter feedbacks for current user
    const myFeedbacks = feedbacks.filter(feedback => feedback.to === user.id);
    
    if (myFeedbacks.length > 0) {
      // Calculate average rating
      const totalRating = myFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
      const average = totalRating / myFeedbacks.length;
      
      // Get last five ratings
      const sortedFeedbacks = [...myFeedbacks].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const lastFive = sortedFeedbacks.slice(0, 5).map(feedback => feedback.rating);
      
      // Calculate rating distribution
      const distribution = [0, 0, 0, 0, 0];
      myFeedbacks.forEach(feedback => {
        distribution[feedback.rating - 1]++;
      });
      
      // Prepare time series data
      // Group by month for better visualization
      const byMonth: Record<string, {sum: number, count: number}> = {};
      myFeedbacks.forEach(feedback => {
        const month = feedback.date.substring(0, 7); // YYYY-MM format
        if (!byMonth[month]) {
          byMonth[month] = { sum: 0, count: 0 };
        }
        byMonth[month].sum += feedback.rating;
        byMonth[month].count += 1;
      });
      
      // Calculate average per month and format for chart
      const ratingsOverTime = Object.entries(byMonth)
        .map(([date, data]) => ({
          date,
          rating: data.sum / data.count
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
      
      setFeedbackStats({
        averageRating: parseFloat(average.toFixed(1)),
        totalFeedbacks: myFeedbacks.length,
        lastFiveRatings: lastFive,
        ratingDistribution: distribution,
        ratingsOverTime
      });
    } else {
      // Reset stats to initial values
      setFeedbackStats({
        averageRating: 0,
        totalFeedbacks: 0,
        lastFiveRatings: [],
        ratingDistribution: [0, 0, 0, 0, 0],
        ratingsOverTime: []
      });
    }
  };

  useEffect(() => {
    calculateFeedbackStats();
    
    // Add event listener for feedback updates
    const handleFeedbackUpdate = () => {
      calculateFeedbackStats();
    };
    
    window.addEventListener('feedbackUpdate', handleFeedbackUpdate);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('feedbackUpdate', handleFeedbackUpdate);
    };
  }, [user]); // Only depend on user changes

  if (!user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  // Helper to format date label
  const formatDateLabel = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    return `${month}/${year.slice(2)}`;
  };

  // Calculate max value for distribution chart
  const maxDistribution = Math.max(...feedbackStats.ratingDistribution, 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 w-full"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.position} • {user.department}</CardDescription>
            </div>
            
            {feedbackStats.totalFeedbacks > 0 && (
              <div className="flex flex-col items-center sm:items-start sm:ml-auto">
                <div className="flex items-center mb-1">
                  <span className="text-2xl font-bold mr-1">{feedbackStats.averageRating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-4 w-4 ${star <= Math.round(feedbackStats.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">Based on {feedbackStats.totalFeedbacks} feedbacks</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="break-all">{user.id}@company.com</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{formData.phone}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{formData.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Joined: {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>ID: {user.id}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Available Leaves: 15/20</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Profile Info</TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>Feedback Stats</span>
            {feedbackStats.totalFeedbacks > 0 && (
              <Badge variant="secondary" className="ml-1">
                {feedbackStats.totalFeedbacks}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-6 mt-6">
          {/* Main Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{formData.about}</p>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-6 mt-6">
          {feedbackStats.totalFeedbacks > 0 ? (
            <>
              {/* Ratings Over Time Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Ratings Over Time</CardTitle>
                  <CardDescription>Your average rating trend from feedbacks received</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex flex-col">
                    <div className="flex-1 flex items-end">
                      {feedbackStats.ratingsOverTime.map((item, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 h-full">
                          <div className="w-full px-1 flex justify-center items-end h-[85%]">
                            <div 
                              className="w-full max-w-[40px] bg-blue-500 rounded-t-md transition-all duration-500"
                              style={{ height: `${(item.rating / 5) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-center mt-2 w-full truncate px-1 text-muted-foreground">
                            {formatDateLabel(item.date)}
                          </div>
                          <div className="text-xs font-medium mt-1">
                            {item.rating.toFixed(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-xs text-muted-foreground mt-4">
                      Time Period
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Rating Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>Breakdown of all your feedback ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex flex-col">
                    <div className="flex-1 flex items-end">
                      {feedbackStats.ratingDistribution.map((count, index) => (
                        <div key={index} className="flex flex-col items-center flex-1 h-full">
                          <div className="w-full px-1 flex justify-center items-end h-[85%]">
                            <div 
                              className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${
                                index === 0 ? 'bg-red-500' :
                                index === 1 ? 'bg-orange-500' :
                                index === 2 ? 'bg-yellow-500' :
                                index === 3 ? 'bg-green-500' :
                                'bg-blue-500'
                              }`}
                              style={{ height: count > 0 ? `${(count / maxDistribution) * 100}%` : '4px' }}
                            ></div>
                          </div>
                          <div className="text-xs text-center mt-2">
                            {index + 1}★
                          </div>
                          <div className="text-xs font-medium mt-1">
                            {count}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-xs text-muted-foreground mt-4">
                      Rating Stars
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Ratings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Ratings</CardTitle>
                  <CardDescription>Your most recent feedback scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    {feedbackStats.lastFiveRatings.map((rating, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">Feedback #{index + 1}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-5 w-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="py-8">
              <CardContent className="flex flex-col items-center justify-center">
                <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Feedback Yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  You haven't received any feedback yet. Feedback from colleagues and managers will be displayed here when available.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-[95vw] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="sm:text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="sm:text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="about" className="sm:text-right">
                About
              </Label>
              <Input
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                className="sm:col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row">
            <Button type="submit" onClick={handleSave} className="w-full sm:w-auto">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EmployeeProfile;