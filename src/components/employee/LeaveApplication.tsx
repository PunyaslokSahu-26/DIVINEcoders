import { useState } from "react";
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

const initialRequests = [
  { 
    id: 1, 
    type: "Annual Leave", 
    startDate: "2025-02-20", 
    endDate: "2025-02-27", 
    days: 5,
    reason: "Family vacation",
    appliedOn: "2025-02-15",
    status: "Approved",
    approvedOn: "2025-02-17"
  },
  { 
    id: 2, 
    type: "Sick Leave", 
    startDate: "2025-01-10", 
    endDate: "2025-01-12", 
    days: 3,
    reason: "Caught a flu",
    appliedOn: "2025-01-09",
    status: "Approved",
    approvedOn: "2025-01-09"
  },
  { 
    id: 3, 
    type: "Work From Home", 
    startDate: "2025-02-05", 
    endDate: "2025-02-09", 
    days: 5,
    reason: "Home maintenance",
    appliedOn: "2025-01-31",
    status: "Pending"
  },
  { 
    id: 4, 
    type: "Personal Leave", 
    startDate: "2024-12-05", 
    endDate: "2024-12-05", 
    days: 1,
    reason: "Doctor's appointment",
    appliedOn: "2024-12-01",
    status: "Rejected",
    rejectedOn: "2024-12-03",
    rejectionReason: "Critical project deadline"
  },
];

const leaveBalance = {
  annual: {
    total: 20,
    used: 5,
    pending: 0,
    remaining: 15
  },
  sick: {
    total: 10,
    used: 3,
    pending: 0,
    remaining: 7
  },
  personal: {
    total: 5,
    used: 1,
    pending: 0,
    remaining: 4
  },
  workFromHome: {
    total: 20,
    used: 0,
    pending: 5,
    remaining: 15
  }
};

const LeaveApplication = () => {
  const [activeTab, setActiveTab] = useState("apply");
  const [leaveRequests, setLeaveRequests] = useState(initialRequests);
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

    const newRequest = {
      id: Date.now(),
      type: leaveForm.type,
      startDate: format(dateRange.from, "yyyy-MM-dd"),
      endDate: format(dateRange.to, "yyyy-MM-dd"),
      days,
      reason: leaveForm.reason,
      appliedOn: format(new Date(), "yyyy-MM-dd"),
      status: "Pending"
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    
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
    setLeaveRequests(leaveRequests.filter(req => req.id !== id));
    setViewRequestDialog(false);
    toast({
      title: "Request Cancelled",
      description: "Your leave request has been cancelled.",
    });
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
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <p className="text-muted-foreground">Apply and track your leaves</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          Apply for Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveBalance.annual.remaining}/{leaveBalance.annual.total}</div>
            <p className="text-xs text-muted-foreground">
              Used: {leaveBalance.annual.used} | Pending: {leaveBalance.annual.pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveBalance.sick.remaining}/{leaveBalance.sick.total}</div>
            <p className="text-xs text-muted-foreground">
              Used: {leaveBalance.sick.used} | Pending: {leaveBalance.sick.pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Personal Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveBalance.personal.remaining}/{leaveBalance.personal.total}</div>
            <p className="text-xs text-muted-foreground">
              Used: {leaveBalance.personal.used} | Pending: {leaveBalance.personal.pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Work From Home</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveBalance.workFromHome.remaining}/{leaveBalance.workFromHome.total}</div>
            <p className="text-xs text-muted-foreground">
              Used: {leaveBalance.workFromHome.used} | Pending: {leaveBalance.workFromHome.pending}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="apply">Apply for Leave</TabsTrigger>
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="history">Leave History</TabsTrigger>
        </TabsList>

        <TabsContent value="apply">
          <Card>
            <CardHeader>
              <CardTitle>New Leave Application</CardTitle>
              <CardDescription>Fill out the form to apply for leave</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select 
                    value={leaveForm.type} 
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                      <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                      <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                      <SelectItem value="Work From Home">Work From Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !dateRange?.from && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange?.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          "Select date range"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        disabled={(date) => date < addDays(new Date(), -1)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {dateRange?.from && dateRange?.to && (
                    <p className="text-sm text-muted-foreground">
                      Working days: {calculateBusinessDays()} days
                    </p>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={leaveForm.reason}
                    onChange={handleInputChange}
                    placeholder="Please provide a reason for your leave request"
                    className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="contactInfo">Emergency Contact (Optional)</Label>
                  <Input
                    id="contactInfo"
                    name="contactInfo"
                    value={leaveForm.contactInfo}
                    onChange={handleInputChange}
                    placeholder="Phone number or email while on leave"
                  />
                </div>
                
                <Button onClick={handleApplyLeave} className="w-full">
                  Submit Leave Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Leave Requests</CardTitle>
              <CardDescription>Your pending and approved upcoming leaves</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.filter(req => req.status !== "Rejected" && new Date(req.endDate) >= new Date()).length > 0 ? (
                  leaveRequests
                    .filter(req => req.status !== "Rejected" && new Date(req.endDate) >= new Date())
                    .map((request) => (
                      <div key={request.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{request.type}</h4>
                            <span className="mx-2">•</span>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>
                              {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()} 
                              ({request.days} {request.days === 1 ? "day" : "days"})
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Applied on: {new Date(request.appliedOn).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewRequest(request)}>
                          View Details
                        </Button>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">You have no active leave requests.</p>
                    <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                      Apply for Leave
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
              <CardDescription>All your past leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.filter(req => new Date(req.endDate) < new Date() || req.status === "Rejected").length > 0 ? (
                  leaveRequests
                    .filter(req => new Date(req.endDate) < new Date() || req.status === "Rejected")
                    .map((request) => (
                      <div key={request.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{request.type}</h4>
                            <span className="mx-2">•</span>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>
                              {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()} 
                              ({request.days} {request.days === 1 ? "day" : "days"})
                            </span>
                          </div>
                          {request.status === "Approved" && request.approvedOn && (
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Approved on: {new Date(request.approvedOn).toLocaleDateString()}</span>
                            </div>
                          )}
                          {request.status === "Rejected" && request.rejectedOn && (
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Rejected on: {new Date(request.rejectedOn).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewRequest(request)}>
                          View Details
                        </Button>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">You have no leave history.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>
              Fill out the form to submit leave request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dialogLeaveType">Leave Type</Label>
              <Select 
                value={leaveForm.type} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="dialogLeaveType">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                  <SelectItem value="Work From Home">Work From Home</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      !dateRange?.from && "text-muted-foreground"
                    }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange?.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Select date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date < addDays(new Date(), -1)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {dateRange?.from && dateRange?.to && (
                <p className="text-sm text-muted-foreground">
                  Working days: {calculateBusinessDays()} days
                </p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dialogReason">Reason for Leave</Label>
              <textarea
                id="dialogReason"
                name="reason"
                value={leaveForm.reason}
                onChange={handleInputChange}
                placeholder="Please provide a reason for your leave request"
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dialogContactInfo">Emergency Contact (Optional)</Label>
              <Input
                id="dialogContactInfo"
                name="contactInfo"
                value={leaveForm.contactInfo}
                onChange={handleInputChange}
                placeholder="Phone number or email while on leave"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApplyLeave}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewRequestDialog} onOpenChange={setViewRequestDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              View the details of your leave request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{selectedRequest.type}</h3>
                {getStatusBadge(selectedRequest.status)}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 border rounded-md p-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">Start Date:</span>{" "}
                    {new Date(selectedRequest.startDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">End Date:</span>{" "}
                    {new Date(selectedRequest.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">Duration:</span>{" "}
                    {selectedRequest.days} {selectedRequest.days === 1 ? "day" : "days"}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground font-medium">Applied On:</span>{" "}
                    {new Date(selectedRequest.appliedOn).toLocaleDateString()}
                  </div>
                  {selectedRequest.status === "Approved" && selectedRequest.approvedOn && (
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">Approved On:</span>{" "}
                      {new Date(selectedRequest.approvedOn).toLocaleDateString()}
                    </div>
                  )}
                  {selectedRequest.status === "Rejected" && selectedRequest.rejectedOn && (
                    <div className="text-sm">
                      <span className="text-muted-foreground font-medium">Rejected On:</span>{" "}
                      {new Date(selectedRequest.rejectedOn).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Reason for Leave</h4>
                  <p className="text-sm p-3 bg-muted rounded-md">
                    {selectedRequest.reason}
                  </p>
                </div>

                {selectedRequest.status === "Rejected" && selectedRequest.rejectionReason && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Rejection Reason</h4>
                    <p className="text-sm p-3 bg-red-50 text-red-800 rounded-md">
                      {selectedRequest.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            {selectedRequest && selectedRequest.status === "Pending" && (
              <Button 
                variant="destructive" 
                onClick={() => handleCancelRequest(selectedRequest.id)}
              >
                Cancel Request
              </Button>
            )}
            <Button variant="outline" onClick={() => setViewRequestDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default LeaveApplication;
