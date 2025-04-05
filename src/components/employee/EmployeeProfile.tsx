import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, MapPin, Phone, Mail, Pencil, User, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";

// Mock data - Replace with actual data from your backend
const employeeData = {
  position: "Frontend Developer",
  department: "Engineering",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  joinDate: "5/15/2020",
  manager: "David Rodriguez",
  employeeId: "EMP-2020-001",
  availableLeaves: "10/15",
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
      title: "Frontend Developer",
      company: "Previous Company",
      duration: "2019-2020",
      description: "Developed and maintained web applications using React and JavaScript."
    }
  ]
};

const EmployeeProfile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    ...employeeData,
    name: user?.displayName || "",
    email: user?.email || ""
  });

  const handleSaveProfile = () => {
    setEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleChangeAvatar = () => {
    setAvatarDialogOpen(false);
    toast({
      title: "Profile Picture Updated",
      description: "Your profile picture has been successfully updated.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <Button
          onClick={() => setEditing(!editing)}
          variant={editing ? "default" : "outline"}
          className="gap-2"
        >
          <Pencil className="h-4 w-4" />
          {editing ? "Save Profile" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="col-span-1 space-y-6">
          {/* Profile Picture & Basic Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
                  <DialogTrigger asChild>
                    <div className="relative group cursor-pointer">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={user?.photoURL || undefined} alt={formData.name} />
                        <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                          <Upload className="h-6 w-6 text-white" />
                        </div>
                      </Avatar>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Profile Picture</DialogTitle>
                      <DialogDescription>
                        Upload a new profile picture. Recommended size: 400x400px
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4">
                      <div className="border-2 border-dashed rounded-lg p-6 w-full text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm font-medium">Drag and drop or click to upload</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG or GIF up to 2MB</p>
                      </div>
                      <Button onClick={handleChangeAvatar}>Upload Picture</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <h2 className="mt-4 text-xl font-semibold">{formData.name}</h2>
                <p className="text-sm text-gray-500">{formData.position}</p>
                <Badge className="mt-2" variant="secondary">{formData.department}</Badge>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{formData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{formData.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined: {formData.joinDate}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Manager: {formData.manager}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>ID: {formData.employeeId}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Available Leaves: {formData.availableLeaves}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs Content */}
        <div className="col-span-2">
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="skills">Skills & Education</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">About Me</h3>
                      {editing ? (
                        <Textarea
                          value={formData.about}
                          onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                          className="min-h-[100px]"
                        />
                      ) : (
                        <p className="text-gray-600">{formData.about}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="mt-6 space-y-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Education</h3>
                      {formData.education.map((edu, index) => (
                        <div key={index} className="mb-4">
                          <h4 className="font-medium">{edu.degree}</h4>
                          <p className="text-sm text-gray-500">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Work Experience</h3>
                    {formData.experience.map((exp, index) => (
                      <Card key={index} className="mb-4">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-base">{exp.title}</CardTitle>
                              <CardDescription>{exp.company}</CardDescription>
                            </div>
                            <Badge variant="outline">{exp.duration}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">{exp.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
