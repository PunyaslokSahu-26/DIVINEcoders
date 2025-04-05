import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { leaveApplications, updateLeaveStatus, users } from "@/data/mockDatabase";
import { useAuth } from "@/hooks/useAuth";

const LeaveApproval = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  
  // Get user profiles for employee details
  const getUserProfile = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  // Filter leaves by status
  const pendingLeaves = leaveApplications.filter(leave => leave.status === "Pending");
  const approvedLeaves = leaveApplications.filter(leave => leave.status === "Approved");
  const rejectedLeaves = leaveApplications.filter(leave => leave.status === "Rejected");

  const handleViewLeave = (leave: any) => {
    setSelectedLeave(leave);
    setRejectionReason(""); // Reset rejection reason
    setDialogOpen(true);
  };

  const handleApproveLeave = (id: number) => {
    const leaveToApprove = leaveApplications.find(leave => leave.id === id);
    
    if (leaveToApprove) {
      // Update the leave status in our mock database
      updateLeaveStatus(id, "Approved", "", new Date().toISOString().split('T')[0]);
      
      toast({
        title: "Leave Approved",
        description: `Leave request for ${leaveToApprove.employeeName} has been approved.`,
      });
      
      setDialogOpen(false);
    }
  };

  const handleRejectLeave = (id: number, reason: string) => {
    const leaveToReject = leaveApplications.find(leave => leave.id === id);
    
    if (leaveToReject) {
      if (!reason.trim()) {
        toast({
          title: "Rejection Reason Required",
          description: "Please provide a reason for rejecting this leave request.",
          variant: "destructive",
        });
        return;
      }
      
      // Update the leave status in our mock database
      updateLeaveStatus(id, "Rejected", reason, undefined, new Date().toISOString().split('T')[0]);
      
      toast({
        title: "Leave Rejected",
        description: `Leave request for ${leaveToReject.employeeName} has been rejected.`,
      });
      
      setRejectionReason("");
      setDialogOpen(false);
    }
  };

  let activeLeaves;
  switch (activeTab) {
    case "pending":
      activeLeaves = pendingLeaves;
      break;
    case "approved":
      activeLeaves = approvedLeaves;
      break;
    case "rejected":
      activeLeaves = rejectedLeaves;
      break;
    default:
      activeLeaves = pendingLeaves;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Leave Approval</h2>
        <p className="text-muted-foreground">Manage and respond to employee leave requests</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
            <CardDescription>Awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{pendingLeaves.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Approved</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{approvedLeaves.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rejected</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{rejectedLeaves.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {activeLeaves.length > 0 ? (
            activeLeaves.map((leave) => {
              const employeeProfile = getUserProfile(leave.employeeId);
              return (
                <Card key={leave.id} className="shadow-card hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={employeeProfile?.image} alt={leave.employeeName} />
                          <AvatarFallback>{leave.employeeName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{leave.employeeName}</CardTitle>
                          <CardDescription>{employeeProfile?.position} • {employeeProfile?.department}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={
                        leave.status === "Pending" ? "outline" : 
                        leave.status === "Approved" ? "default" : 
                        "destructive"
                      }>
                        {leave.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Leave Type:</span> {leave.type}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Duration:</span> {leave.days} days
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">From:</span> {format(new Date(leave.startDate), "MMM dd, yyyy")}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">To:</span> {format(new Date(leave.endDate), "MMM dd, yyyy")}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Applied on: {format(new Date(leave.appliedOn), "MMM dd, yyyy")}
                      </div>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewLeave(leave)}>
                          View Details
                        </Button>
                        {leave.status === "Pending" && (
                          <>
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handleApproveLeave(leave.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleViewLeave(leave)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Leave Requests</h3>
                <p className="text-sm text-muted-foreground text-center">
                  There are no {activeTab} leave requests at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              View and manage the leave application.
            </DialogDescription>
          </DialogHeader>
          
          {selectedLeave && (
            <div className="py-4">
              <div className="flex items-center space-x-4 mb-4">
                {(() => {
                  const employeeProfile = getUserProfile(selectedLeave.employeeId);
                  return (
                    <>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employeeProfile?.image} alt={selectedLeave.employeeName} />
                        <AvatarFallback>{selectedLeave.employeeName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedLeave.employeeName}</h3>
                        <p className="text-sm text-muted-foreground">{employeeProfile?.position} • {employeeProfile?.department}</p>
                      </div>
                    </>
                  )
                })()}
                <Badge className="ml-auto" variant={
                  selectedLeave.status === "Pending" ? "outline" : 
                  selectedLeave.status === "Approved" ? "default" : 
                  "destructive"
                }>
                  {selectedLeave.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 border rounded-md p-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">Leave Type:</span> {selectedLeave.type}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">Duration:</span> {selectedLeave.days} days
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">From:</span> {format(new Date(selectedLeave.startDate), "MMM dd, yyyy")}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">To:</span> {format(new Date(selectedLeave.endDate), "MMM dd, yyyy")}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">Applied On:</span> {format(new Date(selectedLeave.appliedOn), "MMM dd, yyyy")}
                  </div>
                  {selectedLeave.status === "Approved" && selectedLeave.approvedOn && (
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">Approved On:</span> {format(new Date(selectedLeave.approvedOn), "MMM dd, yyyy")}
                    </div>
                  )}
                  {selectedLeave.status === "Rejected" && selectedLeave.rejectedOn && (
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">Rejected On:</span> {format(new Date(selectedLeave.rejectedOn), "MMM dd, yyyy")}
                    </div>
                  )}
                  {selectedLeave.contactInfo && (
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">Contact:</span> {selectedLeave.contactInfo}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Reason for Leave</h4>
                  <p className="text-sm p-3 bg-muted rounded-md">
                    {selectedLeave.reason}
                  </p>
                </div>

                {selectedLeave.status === "Rejected" && selectedLeave.rejectionReason && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Rejection Reason</h4>
                    <p className="text-sm p-3 bg-red-50 text-red-800 rounded-md">
                      {selectedLeave.rejectionReason}
                    </p>
                  </div>
                )}

                {selectedLeave.status === "Pending" && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Rejection Reason (Required if rejecting)</h4>
                    <textarea
                      className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Provide a reason if you're rejecting this leave request..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            {selectedLeave && selectedLeave.status === "Pending" ? (
              <>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleRejectLeave(selectedLeave.id, rejectionReason)}
                >
                  Reject Leave
                </Button>
                <Button onClick={() => handleApproveLeave(selectedLeave.id)}>
                  Approve Leave
                </Button>
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

export default LeaveApproval;
