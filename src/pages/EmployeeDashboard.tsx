import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  User, MessageSquare, Calendar, FileText
} from 'lucide-react';
import Notifications from "@/components/layout/Notifications";
import EmployeeProfile from "@/components/employee/EmployeeProfile";
import EmployeeFeedback from "@/components/employee/EmployeeFeedback";
import EmployeeEvents from "@/components/employee/EmployeeEvents";
import LeaveApplication from "@/components/employee/LeaveApplication";
import ChatBot from '@/components/Chatbot/Chatbot';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <EmployeeProfile />;
      case "feedback":
        return <EmployeeFeedback />;
      case "events":
        return <EmployeeEvents />;
      case "leave":
        return <LeaveApplication />;
      default:
        return <EmployeeProfile />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex w-full">
        <Sidebar>
          <SidebarHeader className="flex flex-col items-center pt-6">
            <div className="flex-shrink-0 flex items-center mb-6">
              <span className="text-xl font-bold text-groww-primary dark:text-blue-400">Atom HR</span>
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Avatar" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <p className="mt-2 font-medium text-gray-900 dark:text-gray-100">John Smith</p>
            <p className="text-xs text-muted-foreground dark:text-gray-400">Frontend Developer</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "profile"}
                  onClick={() => setActiveSection("profile")}
                  className="dark:hover:bg-gray-800 dark:text-gray-300"
                >
                  <User className="h-5 w-5" />
                  <span>My Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "feedback"}
                  onClick={() => setActiveSection("feedback")}
                  className="dark:hover:bg-gray-800 dark:text-gray-300"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Feedback</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "events"}
                  onClick={() => setActiveSection("events")}
                  className="dark:hover:bg-gray-800 dark:text-gray-300"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Tasks & Events</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "leave"}
                  onClick={() => setActiveSection("leave")}
                  className="dark:hover:bg-gray-800 dark:text-gray-300"
                >
                  <FileText className="h-5 w-5" />
                  <span>Leave Application</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="flex justify-center pb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Switch Role
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1">
          <div className="flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <SidebarTrigger />
                    <span className="text-xl font-semibold ml-4 text-gray-900 dark:text-gray-100">Employee Dashboard</span>
                  </div>
                  <div className="flex items-center">
                    <Notifications />
                    <div className="ml-3 relative">
                      <Avatar className="h-8 w-8 cursor-pointer">
                        <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="Avatar" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                  © 2023 GoFloww's Atom HR Platform. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
      <ChatBot />
    </SidebarProvider>
  );
};

export default EmployeeDashboard;
