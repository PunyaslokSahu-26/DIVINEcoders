
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const pendingLeaves = [
  { 
    id: 1, 
    employee: "John Smith", 
    position: "Frontend Developer",
    department: "Engineering",
    type: "Annual Leave", 
    startDate: "2023-12-10", 
    endDate: "2023-12-15", 
    days: 5,
    reason: "Family vacation",
    appliedOn: "2023-11-28",
    status: "Pending",
    image: "https://i.pravatar.cc/150?img=1"
  },
  { 
    id: 2, 
    employee: "Emily Johnson", 
    position: "Marketing Specialist",
    department: "Marketing",
    type: "Sick Leave", 
    startDate: "2023-12-05", 
    endDate: "2023-12-07", 
    days: 3,
    reason: "Medical appointment",
    appliedOn: "2023-11-30",
    status: "Pending",
    image: "https://i.pravatar.cc/150?img=5"
  },
  { 
    id: 3, 
    employee: "Sarah Williams", 
    position: "UX Designer",
    department: "Design",
    type: "Work From Home", 
    startDate: "2023-12-12", 
    endDate: "2023-12-14", 
    days: 3,
    reason: "Home repairs",
    appliedOn: "2023-12-01",
    status: "Pending",
    image: "https://i.pravatar.cc/150?img=10"
  },
];

const approvedLeaves = [
  { 
    id: 101, 
    employee: "Michael Chen", 
    position: "Product Manager",
    department: "Product",
    type: "Annual Leave", 
    startDate: "2023-11-20", 
    endDate: "2023-11-24", 
    days: 5,
    reason: "Personal time off",
    appliedOn: "2023-11-10",
    approvedOn: "2023-11-12",
    status: "Approved",
    image: "https://i.pravatar.cc/150?img=9"
  },
  { 
    id: 102, 
    employee: "David Rodriguez", 
    position: "Backend Developer",
    department: "Engineering",
    type: "Sick Leave", 
    startDate: "2023-11-15", 
    endDate: "2023-11-16", 
    days: 2,
    reason: "Not feeling well",
    appliedOn: "2023-11-14",
    approvedOn: "2023-11-14",
    status: "Approved",
    image: "https://i.pravatar.cc/150?img=12"
  },
];

const rejectedLeaves = [
  { 
    id: 201, 
    employee: "Lisa Kim", 
    position: "Content Writer",
    department: "Marketing",
    type: "Annual Leave", 
    startDate: "2023-12-20", 
    endDate: "2023-12-31", 
    days: 10,
    reason: "Year-end vacation",
    appliedOn: "2023-11-25",
    rejectedOn: "2023-11-27",
    rejectionReason: "Critical project deadline during this period",
    status: "Rejected",
    image: "https://i.pravatar.cc/150?img=20"
  },
];

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState({
    pending: pendingLeaves,
    approved: approvedLeaves,
    rejected: rejectedLeaves
  });
  
  const [activeTab, setActiveTab] = useState("pending");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleViewLeave = (leave: any) => {
    setSelectedLeave(leave);
    setDialogOpen(true);
  };

  const handleApproveLeave = (id: number) => {
    // Move leave from pending to approved
    const leaveToApprove = leaves.pending.find(leave => leave.id === id);
    
    if (leaveToApprove) {
      const updatedLeave = {
        ...leaveToApprove,
        status: "Approved",
        approvedOn: new Date().toISOString().split('T')[0]
      };
      
      setLeaves({
        pending: leaves.pending.filter(leave => leave.id !== id),
        approved: [...leaves.approved, updatedLeave],
        rejected: leaves.rejected
      });
      
      toast({
        title: "Leave Approved",
        description: `Leave request for ${leaveToApprove.employee} has been approved.`,
      });
    }
    
    setDialogOpen(false);
  };

  const handleRejectLeave = (id: number, reason: string) => {
    // Move leave from pending to rejected
    const leaveToReject = leaves.pending.find(leave => leave.id === id);
    
    if (leaveToReject) {
      const updatedLeave = {
        ...leaveToReject,
        status: "Rejected",
        rejectedOn: new Date().toISOString().split('T')[0],
        rejectionReason: reason
      };
      
      setLeaves({
        pending: leaves.pending.filter(leave => leave.id !== id),
        approved: leaves.approved,
        rejected: [...leaves.rejected, updatedLeave]
      });
      
      toast({
        title: "Leave Rejected",
        description: `Leave request for ${leaveToReject.employee} has been rejected.`,
      });
    }
    
    setRejectionReason("");
    setDialogOpen(false);
  };

  const activeLeaves = 
    activeTab === "pending" ? leaves.pending :
    activeTab === "approved" ? leaves.approved :
    leaves.rejected;

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
            <div className="text-3xl font-bold text-yellow-500">{leaves.pending.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Approved</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{leaves.approved.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Rejected</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{leaves.rejected.length}</div>
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
            activeLeaves.map((leave) => (
              <Card key={leave.id} className="shadow-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={leave.image} alt={leave.employee} />
                        <AvatarFallback>{leave.employee.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{leave.employee}</CardTitle>
                        <CardDescription>{leave.position} • {leave.department}</CardDescription>
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
                      <span className="text-muted-foreground">From:</span> {new Date(leave.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">To:</span> {new Date(leave.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Applied on: {new Date(leave.appliedOn).toLocaleDateString()}
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
            ))
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
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedLeave.image} alt={selectedLeave.employee} />
                  <AvatarFallback>{selectedLeave.employee.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedLeave.employee}</h3>
                  <p className="text-sm text-muted-foreground">{selectedLeave.position} • {selectedLeave.department}</p>
                </div>
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
                    <span className="text-muted-foreground font-medium">From:</span> {new Date(selectedLeave.startDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">To:</span> {new Date(selectedLeave.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">Applied On:</span> {new Date(selectedLeave.appliedOn).toLocaleDateString()}
                  </div>
                  {selectedLeave.status === "Approved" && (
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">Approved On:</span> {new Date(selectedLeave.approvedOn).toLocaleDateString()}
                    </div>
                  )}
                  {selectedLeave.status === "Rejected" && (
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">Rejected On:</span> {new Date(selectedLeave.rejectedOn).toLocaleDateString()}
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
                    <h4 className="text-sm font-medium">Rejection Reason (Optional)</h4>
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
