
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("employee");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would validate credentials with your backend
    // For demo purposes, we'll navigate based on the selected role
    toast({
      title: "Success",
      description: "Login successful!",
    });
    
    if (role === "hr") {
      navigate("/hr-dashboard");
    } else {
      navigate("/employee-dashboard");
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would register the user with your backend
    toast({
      title: "Success",
      description: "Account created successfully!",
    });
    
    if (role === "hr") {
      navigate("/hr-dashboard");
    } else {
      navigate("/employee-dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-groww-primary">Atom HR</h1>
          <p className="text-gray-600 mt-2">Performance & Feedback Management Platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Atom HR</CardTitle>
            <CardDescription>
              Login or create an account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="youremail@company.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                  <div className="space-y-2">
                    <Label>Select Role</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="employee-login"
                          name="role"
                          value="employee"
                          checked={role === "employee"}
                          onChange={() => setRole("employee")}
                          className="mr-2"
                        />
                        <Label htmlFor="employee-login">Employee</Label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="hr-login"
                          name="role"
                          value="hr"
                          checked={role === "hr"}
                          onChange={() => setRole("hr")}
                          className="mr-2"
                        />
                        <Label htmlFor="hr-login">HR</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">Login</Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input 
                      id="email-signup" 
                      type="email" 
                      placeholder="youremail@company.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input 
                      id="password-signup" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Select Role</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="employee-signup"
                          name="role-signup"
                          value="employee"
                          checked={role === "employee"}
                          onChange={() => setRole("employee")}
                          className="mr-2"
                        />
                        <Label htmlFor="employee-signup">Employee</Label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="hr-signup"
                          name="role-signup"
                          value="hr"
                          checked={role === "hr"}
                          onChange={() => setRole("hr")}
                          className="mr-2"
                        />
                        <Label htmlFor="hr-signup">HR</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">Create Account</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              © 2023 GoFloww's Atom HR Platform
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
