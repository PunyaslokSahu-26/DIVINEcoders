import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { generateUserCredentials } from "@/utils/testUsers";
import { Copy } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("employee");
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Credentials copied to clipboard",
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
      
      // Navigate to appropriate dashboard
      if (role === "hr") {
        navigate("/hr-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Failed to login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Generate credentials based on name and role
      const credentials = generateUserCredentials(name, role as 'employee' | 'hr');
      
      // Create user account with generated credentials
      const userCredential = await signUp(credentials.email, credentials.password);
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email: credentials.email,
        role,
        createdAt: new Date().toISOString(),
      });

      // Show success message with credentials
      toast({
        title: "Account Created Successfully!",
        description: (
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Your Email:</span>
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 px-2 py-1 rounded">{credentials.email}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(credentials.email)}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Your Password:</span>
              <div className="flex items-center gap-2">
                <code className="bg-gray-100 px-2 py-1 rounded">{credentials.password}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(credentials.password)}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Please save these credentials. You'll need them to login.
            </p>
          </div>
        ),
        duration: 15000, // Show for 15 seconds
      });

      // Navigate to appropriate dashboard
      if (role === "hr") {
        navigate("/hr-dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      let errorMessage = "Failed to create account";
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Please try logging in.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your connection.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    // Set role based on selected tab
    if (value === "login") {
      setRole("employee"); // Default to employee for login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
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
            <Tabs defaultValue="login" className="w-full" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Employee Login</TabsTrigger>
                <TabsTrigger value="hr-login">HR Login</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="youremail@gofloww.com" 
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
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Login as Employee"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="hr-login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hr-email">Email</Label>
                    <Input 
                      id="hr-email" 
                      type="email"
                      placeholder="youremail@gofloww.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hr-password">Password</Label>
                    <Input 
                      id="hr-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Login as HR"}
                  </Button>
                </form>
              </TabsContent>

              <TabsList className="grid w-full grid-cols-2 mb-6 mt-6">
                <TabsTrigger value="signup">Employee Signup</TabsTrigger>
                <TabsTrigger value="hr-signup">HR Signup</TabsTrigger>
              </TabsList>

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
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Employee Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="hr-signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hr-name">Full Name</Label>
                    <Input 
                      id="hr-name" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create HR Account"}
                  </Button>
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
      </div>
    </div>
  );
};

export default Login;

