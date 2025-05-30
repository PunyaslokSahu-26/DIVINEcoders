import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !password) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setIsNavigating(true);

    try {
      const user = await signIn(id, password);
      if (user.role === "hr") {
        navigate("/hr-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
      {!isNavigating && (
        <motion.div 
          className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4"
          initial={{ 
            opacity: 0, 
            scale: 1.05,
            x: 0 // Start from right side of screen
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: 0,
            transition: {
              duration: 0.4,
              ease: "easeInOut"
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.95,
            x: 0, // Exit to left side of screen
            transition: {
              duration: 0.4,
              ease: "easeInOut"
            }
          }}
        >
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="mt-2 text-sm text-gray-600">
                Please sign in to your account
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Welcome to Atom HR</CardTitle>
                <CardDescription>
                  Login to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Employee/HR ID</Label>
                    <Input 
                      id="id" 
                      placeholder="Enter your ID" 
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">Login</Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500">
                  © 2025 GoFloww's Atom HR Platform
                </p>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Login;
