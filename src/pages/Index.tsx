import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, ChevronRight, User } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Index() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-groww-primary mb-2 dark:text-white">
          Atom HR Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Performance & Feedback Management
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <motion.div
          whileHover={{ 
            scale: 1.03,
            transition: { duration: 0.2 }
          }}
          onHoverStart={() => setHoveredCard("hr")}
          onHoverEnd={() => setHoveredCard(null)}
          className="cursor-pointer"
          onClick={() => navigate("/login")}
        >
          <Card className={`shadow-lg border-2 transition-all duration-300 h-full ${hoveredCard === "hr" ? "border-groww-primary" : "border-transparent"}`}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-groww-light p-4 rounded-full mb-4">
                <Building2 className="h-12 w-12 text-groww-primary" />
              </div>
              <CardTitle className="text-2xl">HR Dashboard</CardTitle>
              <CardDescription>
                Manage employee performance and feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-8">
                Access tools for managing reviews, feedback cycles, and analytics to support your team's growth and development.
              </p>
              <Button className="group">
                HR Login
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ 
            scale: 1.03,
            transition: { duration: 0.2 }
          }}
          onHoverStart={() => setHoveredCard("employee")}
          onHoverEnd={() => setHoveredCard(null)}
          className="cursor-pointer"
          onClick={() => navigate("/login")}
        >
          <Card className={`shadow-lg border-2 transition-all duration-300 h-full ${hoveredCard === "employee" ? "border-groww-primary" : "border-transparent"}`}>
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-groww-light p-4 rounded-full mb-4">
                <User className="h-12 w-12 text-groww-primary" />
              </div>
              <CardTitle className="text-2xl">Employee Dashboard</CardTitle>
              <CardDescription>
                Track your performance and feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-8">
                View your performance metrics, request and provide feedback, and access resources to support your professional growth.
              </p>
              <Button className="group">
                Employee Login
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm"
      >
        © 2025 GoFloww's Atom HR Platform. All rights reserved.
      </motion.div>
    </div>
  );
}
