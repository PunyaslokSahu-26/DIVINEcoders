import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { addDays, differenceInBusinessDays, format } from "date-fns";
import { Calendar as CalendarIcon, Clock, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/hooks/useAuth";
import { leaveApplications, addLeaveApplication, LeaveApplication as LeaveType } from "@/data/mockDatabase";
import { cn } from "@/lib/utils";

const leaveTypes = [
  "Annual Leave",
  "Sick Leave",
  "Personal Leave",
  "Work From Home"
];

const LeaveApplication = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("apply");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewRequestDialog, setViewRequestDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  
  const [leaveForm, setLeaveForm] = useState({
    type: "Annual Leave",
    reason: "",
    contactInfo: ""
  });

  // Get user's leave requests
  const userLeaves = leaveApplications.filter(leave => leave.employeeId === user?.id);

  // Calculate leave balances
  const calculateLeaveBalances = () => {
    const leaveBalance = {
      "Annual Leave": {
        total: 20,
        used: 0,
        pending: 0,
        remaining: 20
      },
      "Sick Leave": {
        total: 10,
        used: 0,
        pending: 0,
        remaining: 10
      },
      "Personal Leave": {
        total: 5,
        used: 0,
        pending: 0,
        remaining: 5
      },
      "Work From Home": {
        total: 20,
        used: 0,
        pending: 0,
        remaining: 20
      }
    };

    // Calculate used and pending days
    userLeaves.forEach(leave => {
      const leaveType = leave.type as keyof typeof leaveBalance;
      if (leaveType in leaveBalance) {
        if (leave.status === 'Approved') {
          leaveBalance[leaveType].used += leave.days;
        } else if (leave.status === 'Pending') {
          leaveBalance[leaveType].pending += leave.days;
        }
      }
    });

    // Calculate remaining days
    Object.keys(leaveBalance).forEach(type => {
      const typeKey = type as keyof typeof leaveBalance;
      leaveBalance[typeKey].remaining = leaveBalance[typeKey].total - leaveBalance[typeKey].used - leaveBalance[typeKey].pending;
    });

    return leaveBalance;
  };

  const leaveBalance = calculateLeaveBalances();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLeaveForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setLeaveForm(prev => ({ ...prev, type: value }));
  };

  const calculateBusinessDays = () => {
    if (dateRange?.from && dateRange?.to) {
      return differenceInBusinessDays(dateRange.to, dateRange.from) + 1;
    }
    return 0;
  };

  const handleApplyLeave = () => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "You must be logged in to apply for leave.",
        variant: "destructive",
      });
      return;
    }

    if (!dateRange?.from || !dateRange?.to || !leaveForm.type || !leaveForm.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const days = calculateBusinessDays();
    if (days <= 0) {
      toast({
        title: "Invalid Date Range",
        description: "Please select a valid date range.",
        variant: "destructive",
      });
      return;
    }

    // Check if there's enough leave balance
    const leaveTypeKey = leaveForm.type as keyof typeof leaveBalance;
    if (days > leaveBalance[leaveTypeKey].remaining) {
      toast({
        title: "Insufficient Leave Balance",
        description: `You don't have enough ${leaveForm.type} balance for this request.`,
        variant: "destructive",
      });
      return;
    }

    const newLeave: Omit<LeaveType, 'id'> = {
      employeeId: user.id,
      employeeName: user.name,
      startDate: format(dateRange.from, "yyyy-MM-dd"),
      endDate: format(dateRange.to, "yyyy-MM-dd"),
      type: leaveForm.type,
      reason: leaveForm.reason,
      status: "Pending",
      contactInfo: leaveForm.contactInfo || `+91 ${user.id.slice(3)}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      appliedOn: format(new Date(), "yyyy-MM-dd"),
      days
    };

    // Add the new leave application to our database
    addLeaveApplication(newLeave);
    
    setDateRange({ from: undefined, to: undefined });
    setLeaveForm({
      type: "Annual Leave",
      reason: "",
      contactInfo: ""
    });
    
    setDialogOpen(false);
    toast({
      title: "Leave Applied",
      description: "Your leave request has been submitted successfully.",
    });
  };

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setViewRequestDialog(true);
  };

  const handleCancelRequest = (id: number) => {
    const leaveToCancel = leaveApplications.find(leave => leave.id === id);
    
    if (leaveToCancel && leaveToCancel.status === 'Pending') {
      // In a real system, we would call an API to cancel the leave
      // For now, we'll simulate by filtering it out in our component's state
      const updatedLeaves = leaveApplications.filter(leave => leave.id !== id);
      
      toast({
        title: "Request Cancelled",
        description: "Your leave request has been cancelled.",
      });
      setViewRequestDialog(false);
    } else {
      toast({
        title: "Cannot Cancel",
        description: "Only pending requests can be cancelled.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 w-full"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <p className="text-muted-foreground">Apply and track your leaves</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          Apply for Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveBalance["Annual Leave"].remaining}/{leaveBalance["Annual Leave"].total}</div>
            <p className="text-xs text-muted-foreground">
              Used: {leaveBalance["Annual Leave"].used} | Pending: {leaveBalance["Annual Leave"].pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveBalance["Sick Leave"].remaining}/{leaveBalance["Sick Leave"].total}</div>
            <p className="text-xs text-muted-foreground">
              Used: {leaveBalance["Sick Leave"].used} | Pending: {leaveBalance["Sick Leave"].pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Personal Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveBalance["Personal Leave"].remaining}/{leaveBalance["Personal Leave"].total}</div>
            <p className="text-xs text-muted-foreground">
              Used: {leaveBalance["Personal Leave"].used} | Pending: {leaveBalance["Personal Leave"].pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Work From Home</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveBalance["Work From Home"].remaining}/{leaveBalance["Work From Home"].total}</div>
            <p className="text-xs text-muted-foreground">
              Used: {leaveBalance["Work From Home"].used} | Pending: {leaveBalance["Work From Home"].pending}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="apply">Apply for Leave</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="history">Leave History</TabsTrigger>
        </TabsList>

        <TabsContent value="apply">
          <Card>
            <CardHeader>
              <CardTitle>Request Leave</CardTitle>
              <CardDescription>Fill in the details to request time off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="leave-type">Leave Type</Label>
                <Select value={leaveForm.type} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal w-full"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={new Date()}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        disabled={date => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {dateRange?.from && dateRange?.to && (
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Duration: {calculateBusinessDays()} business day{calculateBusinessDays() !== 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Leave</Label>
                <Input
                  id="reason"
                  name="reason"
                  value={leaveForm.reason}
                  onChange={handleInputChange}
                  placeholder="Brief description of your leave reason"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  value={leaveForm.contactInfo}
                  onChange={handleInputChange}
                  placeholder="How to reach you during your leave (optional)"
                />
              </div>
              
              <Button className="mt-4 w-full" onClick={handleApplyLeave}>
                Submit Leave Request
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Track the status of your pending leave requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userLeaves.filter(leave => leave.status === "Pending").length > 0 ? (
                userLeaves
                  .filter(leave => leave.status === "Pending")
                  .sort((a, b) => new Date(b.appliedOn).getTime() - new Date(a.appliedOn).getTime())
                  .map((leave) => (
                    <div key={leave.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{leave.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(leave.startDate), "MMM dd, yyyy")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                        {getStatusBadge(leave.status)}
                      </div>
                      <p className="text-sm mb-4">{leave.reason}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Applied on: {format(new Date(leave.appliedOn), "MMM dd, yyyy")}</span>
                        <Button variant="outline" size="sm" onClick={() => handleViewRequest(leave)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No Pending Requests</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    You don't have any pending leave requests.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
              <CardDescription>View your past and upcoming leave records</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userLeaves.filter(leave => leave.status !== "Pending").length > 0 ? (
                userLeaves
                  .filter(leave => leave.status !== "Pending")
                  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                  .map((leave) => (
                    <div key={leave.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{leave.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(leave.startDate), "MMM dd, yyyy")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                          </p>
                        </div>
                        {getStatusBadge(leave.status)}
                      </div>
                      <p className="text-sm mb-4">{leave.reason}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {leave.status === "Approved" 
                            ? `Approved on: ${format(new Date(leave.approvedOn || ""), "MMM dd, yyyy")}` 
                            : `Rejected on: ${format(new Date(leave.rejectedOn || ""), "MMM dd, yyyy")}`}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => handleViewRequest(leave)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No Leave History</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    You don't have any past leave records.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Apply for Leave Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>
              Request time off by filling in the required details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-leave-type">Leave Type</Label>
              <Select value={leaveForm.type} onValueChange={handleSelectChange}>
                <SelectTrigger id="dialog-leave-type">
                  <SelectValue placeholder="Select a leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal w-full"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={new Date()}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      disabled={date => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {dateRange?.from && dateRange?.to && (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Duration: {calculateBusinessDays()} business day{calculateBusinessDays() !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dialog-reason">Reason for Leave</Label>
              <Input
                id="dialog-reason"
                name="reason"
                value={leaveForm.reason}
                onChange={handleInputChange}
                placeholder="Brief description of your leave reason"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dialog-contactInfo">Contact Information</Label>
              <Input
                id="dialog-contactInfo"
                name="contactInfo"
                value={leaveForm.contactInfo}
                onChange={handleInputChange}
                placeholder="How to reach you during your leave (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApplyLeave}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Request Dialog */}
      <Dialog open={viewRequestDialog} onOpenChange={setViewRequestDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              View the details of your leave request.
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between flex-wrap gap-2">
                <h3 className="font-medium">{selectedRequest.type}</h3>
                {getStatusBadge(selectedRequest.status)}
              </div>
              
              <div className="space-y-1 border-y py-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">From:</span> {format(new Date(selectedRequest.startDate), "MMM dd, yyyy")}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">To:</span> {format(new Date(selectedRequest.endDate), "MMM dd, yyyy")}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Duration:</span> {selectedRequest.days} day(s)
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Applied:</span> {format(new Date(selectedRequest.appliedOn), "MMM dd, yyyy")}
                  </div>
                  {selectedRequest.status === "Approved" && selectedRequest.approvedOn && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Approved:</span> {format(new Date(selectedRequest.approvedOn), "MMM dd, yyyy")}
                    </div>
                  )}
                  {selectedRequest.status === "Rejected" && selectedRequest.rejectedOn && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Rejected:</span> {format(new Date(selectedRequest.rejectedOn), "MMM dd, yyyy")}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Reason for Leave</h4>
                <p className="text-sm p-3 bg-muted rounded-md">{selectedRequest.reason}</p>
              </div>
              
              {selectedRequest.contactInfo && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contact Information</h4>
                  <p className="text-sm">{selectedRequest.contactInfo}</p>
                </div>
              )}
              
              {selectedRequest.status === "Rejected" && selectedRequest.rejectionReason && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Rejection Reason</h4>
                  <p className="text-sm p-3 bg-red-50 text-red-800 rounded-md">
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedRequest && selectedRequest.status === "Pending" && (
              <Button variant="destructive" onClick={() => handleCancelRequest(selectedRequest.id)}>
                Cancel Request
              </Button>
            )}
            <Button variant={selectedRequest?.status === "Pending" ? "outline" : "default"} onClick={() => setViewRequestDialog(false)}>
              {selectedRequest?.status === "Pending" ? "Close" : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default LeaveApplication;
