
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, CheckCircle2, Clock, Plus, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { motion } from "framer-motion";

// Mock data for tasks
const initialTasks = [
  { 
    id: 1, 
    title: "Complete Frontend Project", 
    description: "Finish the UI components for the new dashboard", 
    dueDate: "2023-12-15", 
    progress: 75, 
    priority: "High", 
    category: "Work"
  },
  { 
    id: 2, 
    title: "Prepare for Performance Review", 
    description: "Gather achievements and metrics for quarterly review", 
    dueDate: "2023-12-10", 
    progress: 30, 
    priority: "Medium", 
    category: "Personal"
  },
  { 
    id: 3, 
    title: "Team Meeting Preparation", 
    description: "Prepare agenda and slides for weekly team meeting", 
    dueDate: "2023-12-05", 
    progress: 50, 
    priority: "Low", 
    category: "Work"
  },
];

// Mock data for events
const initialEvents = [
  { 
    id: 101, 
    title: "Team Building Event", 
    date: "2023-12-20", 
    startTime: "10:00", 
    endTime: "17:00", 
    location: "Central Park", 
    description: "Annual team building activity with outdoor games and lunch", 
    category: "Social"
  },
  { 
    id: 102, 
    title: "Project Kickoff", 
    date: "2023-12-12", 
    startTime: "09:30", 
    endTime: "11:30", 
    location: "Conference Room A", 
    description: "Kickoff meeting for the new customer portal project", 
    category: "Work"
  },
  { 
    id: 103, 
    title: "Training Session", 
    date: "2023-12-18", 
    startTime: "13:00", 
    endTime: "15:00", 
    location: "Training Room", 
    description: "Advanced React techniques training session", 
    category: "Learning"
  },
];

const EmployeeEvents = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [tasks, setTasks] = useState(initialTasks);
  const [events, setEvents] = useState(initialEvents);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const [taskForm, setTaskForm] = useState({
    id: 0,
    title: "",
    description: "",
    dueDate: "",
    progress: 0,
    priority: "Medium",
    category: "Work"
  });
  
  const [eventForm, setEventForm] = useState({
    id: 0,
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: "",
    category: "Work"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (activeTab === "tasks") {
      setTaskForm(prev => ({ ...prev, [name]: value }));
    } else {
      setEventForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (activeTab === "tasks") {
      setTaskForm(prev => ({ ...prev, [name]: value }));
    } else {
      setEventForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskForm(prev => ({ ...prev, progress: parseInt(e.target.value) }));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      if (activeTab === "tasks") {
        setTaskForm(prev => ({ ...prev, dueDate: formattedDate }));
      } else {
        setEventForm(prev => ({ ...prev, date: formattedDate }));
      }
      
      setDate(selectedDate);
    }
  };

  const handleAddTask = () => {
    if (!taskForm.title || !taskForm.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and due date for the task.",
        variant: "destructive",
      });
      return;
    }

    const newTask = {
      ...taskForm,
      id: Date.now()
    };
    
    setTasks([...tasks, newTask]);
    setTaskForm({
      id: 0,
      title: "",
      description: "",
      dueDate: "",
      progress: 0,
      priority: "Medium",
      category: "Work"
    });
    
    setTaskDialogOpen(false);
    toast({
      title: "Task Added",
      description: "Your new task has been added successfully.",
    });
  };

  const handleAddEvent = () => {
    if (!eventForm.title || !eventForm.date || !eventForm.startTime) {
      toast({
        title: "Missing Information",
        description: "Please provide a title, date, and start time for the event.",
        variant: "destructive",
      });
      return;
    }

    const newEvent = {
      ...eventForm,
      id: Date.now()
    };
    
    setEvents([...events, newEvent]);
    setEventForm({
      id: 0,
      title: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      description: "",
      category: "Work"
    });
    
    setEventDialogOpen(false);
    toast({
      title: "Event Added",
      description: "Your new event has been added to the calendar.",
    });
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "The task has been deleted successfully.",
    });
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
    toast({
      title: "Event Deleted",
      description: "The event has been deleted from the calendar.",
    });
  };

  const handleCompleteTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, progress: 100 } : task
    ));
    toast({
      title: "Task Completed",
      description: "The task has been marked as completed.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Work":
        return "bg-blue-100 text-blue-800";
      case "Personal":
        return "bg-purple-100 text-purple-800";
      case "Learning":
        return "bg-indigo-100 text-indigo-800";
      case "Social":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <h2 className="text-2xl font-bold">My Tasks & Events</h2>
          <p className="text-muted-foreground">Manage your tasks, goals, and upcoming events</p>
        </div>
        <div className="space-x-2">
          {activeTab === "tasks" ? (
            <Button onClick={() => setTaskDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          ) : (
            <Button onClick={() => setEventDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tasks">Tasks & Goals</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Card key={task.id} className="shadow-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {task.title}
                        {task.progress === 100 && (
                          <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
                        )}
                      </CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getCategoryColor(task.category)}>
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                    {task.progress !== 100 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCompleteTask(task.id)}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Complete
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Tasks Yet</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  You don't have any tasks or goals yet.
                </p>
                <Button onClick={() => setTaskDialogOpen(true)}>
                  Add Your First Task
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>View and manage your upcoming events</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border mx-auto" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your scheduled events and appointments</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <p className="text-sm mt-2">{event.description}</p>
                      <div className="mt-2">
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No upcoming events.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task or goal to track your progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                name="title"
                value={taskForm.title}
                onChange={handleInputChange}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={taskForm.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!taskForm.dueDate && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {taskForm.dueDate ? format(new Date(taskForm.dueDate), "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={taskForm.priority} 
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={taskForm.category} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Learning">Learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="progress">Initial Progress</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="progress"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={taskForm.progress}
                    onChange={handleProgressChange}
                  />
                  <span>{taskForm.progress}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Schedule a new event on your calendar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                id="eventTitle"
                name="title"
                value={eventForm.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!eventForm.date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventForm.date ? format(new Date(eventForm.date), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={eventForm.startTime}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={eventForm.endTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={eventForm.location}
                onChange={handleInputChange}
                placeholder="Enter event location"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="eventDescription">Description</Label>
              <textarea
                id="eventDescription"
                name="description"
                value={eventForm.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="eventCategory">Category</Label>
              <Select 
                value={eventForm.category} 
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EmployeeEvents;
