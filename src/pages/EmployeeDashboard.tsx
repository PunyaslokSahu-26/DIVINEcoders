import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { User, MessageSquare, Calendar, CalendarDays, Settings, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import EmployeeProfile from "@/components/employee/EmployeeProfile";
import EmployeeFeedback from "@/components/employee/EmployeeFeedback";
import EmployeeEvents from "@/components/employee/EmployeeEvents";
import LeaveApplication from "@/components/employee/LeaveApplication";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || "User"} />
              <AvatarFallback>{getUserInitials(user?.displayName || "User")}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user?.displayName || "User"}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <Button
            variant={activeSection === "profile" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button
            variant={activeSection === "feedback" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("feedback")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Feedback
          </Button>
          <Button
            variant={activeSection === "events" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("events")}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Events
          </Button>
          <Button
            variant={activeSection === "leave" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveSection("leave")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Leave Applications
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeSection === "profile" && <EmployeeProfile />}
          {activeSection === "feedback" && <EmployeeFeedback />}
          {activeSection === "events" && <EmployeeEvents />}
          {activeSection === "leave" && <LeaveApplication />}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
