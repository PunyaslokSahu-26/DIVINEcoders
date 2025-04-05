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
  Users, User, FileText, MessageSquare, Calendar, BarChart2
} from 'lucide-react';
import Notifications from "@/components/layout/Notifications";
import EmployeeManagement from "@/components/hr/EmployeeManagement";
import PerformanceReviews from "@/components/hr/PerformanceReviews";
import FeedbackHub from "@/components/hr/FeedbackHub";
import LeaveApproval from "@/components/hr/LeaveApproval";
import SalaryPayroll from "@/components/hr/SalaryPayroll";
import { useAuth } from '@/hooks/useAuth';

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("employee-management");

  const renderContent = () => {
    switch (activeSection) {
      case "employee-management":
        return <EmployeeManagement />;
      case "performance-reviews":
        return <PerformanceReviews />;
      case "feedback-hub":
        return <FeedbackHub />;
      case "leave-approval":
        return <LeaveApproval />;
      case "salary-payroll":
        return <SalaryPayroll />;
      default:
        return <EmployeeManagement />;
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full flex-col md:flex-row">
        <Sidebar className="md:w-64 w-full">
          <SidebarHeader className="flex flex-col items-center pt-6">
            <div className="flex-shrink-0 flex items-center mb-6">
              <span className="text-xl font-bold text-groww-primary">Atom HR</span>
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="mt-2 font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.position}</p>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "employee-management"}
                  onClick={() => setActiveSection("employee-management")}
                >
                  <Users className="h-5 w-5" />
                  <span>Employee Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "performance-reviews"}
                  onClick={() => setActiveSection("performance-reviews")}
                >
                  <FileText className="h-5 w-5" />
                  <span>Performance Reviews</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "feedback-hub"}
                  onClick={() => setActiveSection("feedback-hub")}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>360° Feedback</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "leave-approval"}
                  onClick={() => setActiveSection("leave-approval")}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Leave Approval</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeSection === "salary-payroll"}
                  onClick={() => setActiveSection("salary-payroll")}
                >
                  <BarChart2 className="h-5 w-5" />
                  <span>Salary & Payroll</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="w-full"
            >
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 w-full">
          <div className="flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <SidebarTrigger />
                    <span className="text-xl font-semibold ml-4">HR Dashboard</span>
                  </div>
                  <div className="flex items-center">
                    <Notifications />
                    <div className="ml-3 relative">
                      <Avatar 
                        className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        onClick={() => setActiveSection("employee-management")}
                      >
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto bg-gray-50 w-full overflow-x-hidden">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {renderContent()}
              </motion.div>
            </main>

            {/* Footer */}
            <footer className="mt-auto">
              <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 text-sm">
                  © 2023 GoFloww's Atom HR Platform. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HRDashboard;
