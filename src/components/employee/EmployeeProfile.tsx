
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, MapPin, Phone, Mail, Pencil, User, Upload } from "lucide-react";
import { motion } from "framer-motion";

// Mock employee data
const employeeData = {
  id: 1,
  name: "John Smith",
  position: "Frontend Developer",
  department: "Engineering",
  email: "john.smith@company.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  joiningDate: "2020-05-15",
  manager: "David Rodriguez",
  employeeId: "EMP-2020-001",
  about: "Experienced frontend developer with expertise in React, TypeScript, and modern web technologies. Passionate about creating intuitive user interfaces and optimizing web performance.",
  skills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Redux", "Tailwind CSS"],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California, Berkeley",
      year: "2015-2019"
    }
  ],
  experience: [
    {
      title: "Junior Frontend Developer",
      company: "Tech Solutions Inc.",
      duration: "2019-2020",
      description: "Developed and maintained web applications using React and JavaScript."
    }
  ],
  image: "https://i.pravatar.cc/150?img=1",
  availableLeaves: 15,
  usedLeaves: 5
};

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(employeeData);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(employee);
  const [activeTab, setActiveTab] = useState("overview");
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setEmployee(formData);
    setEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleChangeAvatar = () => {
    // In a real app, this would handle file upload
    const randomId = Math.floor(Math.random() * 70);
    setEmployee(prev => ({ ...prev, image: `https://i.pravatar.cc/150?img=${randomId}` }));
    setFormData(prev => ({ ...prev, image: `https://i.pravatar.cc/150?img=${randomId}` }));
    setAvatarDialogOpen(false);
    
    toast({
      title: "Avatar Updated",
      description: "Your profile picture has been successfully updated.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Profile</h2>
        {!editing ? (
          <Button onClick={() => setEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4 relative">
              <Avatar className="h-24 w-24 cursor-pointer" onClick={() => setAvatarDialogOpen(true)}>
                <AvatarImage src={employee.image} alt={employee.name} />
                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute bottom-0 right-1/3 rounded-full bg-primary text-white h-7 w-7"
                onClick={() => setAvatarDialogOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
            <CardTitle>{employee.name}</CardTitle>
            <CardDescription>{employee.position}</CardDescription>
            <div className="flex justify-center mt-2">
              <Badge variant="outline">{employee.department}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{employee.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Joined: {new Date(employee.joiningDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Manager: {employee.manager}</span>
              </div>
              <div className="flex items-center text-sm">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>ID: {employee.employeeId}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Available Leaves: {employee.availableLeaves - employee.usedLeaves}/{employee.availableLeaves}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills & Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
              </TabsList>
              <div className="mt-2">
                <TabsContent value="overview" className="space-y-4">
                  {editing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="position">Position</Label>
                          <Input
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about">About Me</Label>
                        <textarea
                          id="about"
                          name="about"
                          className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={formData.about}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">About Me</h3>
                      <p className="text-sm text-muted-foreground">{employee.about}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Education</h3>
                      {employee.education.map((edu, index) => (
                        <div key={index} className="mb-3">
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-sm text-muted-foreground">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Work Experience</h3>
                  {employee.experience.map((exp, index) => (
                    <Card key={index} className="mb-3">
                      <CardHeader className="py-3">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-base">{exp.title}</CardTitle>
                            <CardDescription>{exp.company}</CardDescription>
                          </div>
                          <Badge variant="outline">{exp.duration}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3">
                        <p className="text-sm">{exp.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="flex justify-center mt-4">
                    <Button variant="outline">
                      Add Experience
                    </Button>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardHeader>
          <CardContent>
            {/* Content is now rendered within the Tabs component above */}
          </CardContent>
        </Card>
      </div>

      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
            <DialogDescription>
              Upload a new profile picture or choose from available options.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 flex flex-col items-center space-y-4">
            <Avatar className="h-28 w-28">
              <AvatarImage src={employee.image} alt={employee.name} />
              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="border-2 border-dashed rounded-lg p-6 w-full flex flex-col items-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">Drag and drop or click to upload</p>
              <p className="text-xs text-muted-foreground mb-4">PNG, JPG or GIF up to 2MB</p>
              <Button variant="outline">Browse Files</Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvatarDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleChangeAvatar}>Update Avatar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default EmployeeProfile;
