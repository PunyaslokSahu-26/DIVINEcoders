import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Building2, Shield, Clock } from "lucide-react";
import { useState } from "react";

const colorAnimation = {
  backgroundPosition: ["100% 50%", "-45% 50%"],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "linear"
  }
};

const zoomAnimation = {
  scale: [1, 1.1, 1],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function Index() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleLogin = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate("/login");
    }, 800); // Reduced to match the exit animation duration
  };

  return (
    <AnimatePresence>
      {!isNavigating && (
        <motion.div
          className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            transition: {
              duration: 0.4,
              ease: "easeInOut"
            }
          }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-gray-200 to-blue-600 bg-clip-text text-transparent bg-[length:300%_100%]"
                animate={colorAnimation}
              >
                Welcome to Atom HR
              </motion.h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Streamline your HR processes with our comprehensive management solution. 
                From employee management to performance tracking, we've got you covered.
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div 
                className="p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                animate={zoomAnimation}
                style={{ transformOrigin: "center center" }}
              >
                <div className="relative">
                  <Users className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Employee Management</h3>
                  <p className="text-sm text-muted-foreground">Efficiently manage your workforce with our intuitive tools</p>
                </div>
              </motion.div>
              <motion.div 
                className="p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                animate={zoomAnimation}
                style={{ transformOrigin: "center center" }}
              >
                <div className="relative">
                  <Building2 className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Organization Structure</h3>
                  <p className="text-sm text-muted-foreground">Maintain clear hierarchies and department structures</p>
                </div>
              </motion.div>
              <motion.div 
                className="p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                animate={zoomAnimation}
                style={{ transformOrigin: "center center" }}
              >
                <div className="relative">
                  <Shield className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Secure Platform</h3>
                  <p className="text-sm text-muted-foreground">Your data is protected with enterprise-grade security</p>
                </div>
              </motion.div>
              <motion.div 
                className="p-6 rounded-lg bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
                animate={zoomAnimation}
                style={{ transformOrigin: "center center" }}
              >
                <div className="relative">
                  <Clock className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Time Management</h3>
                  <p className="text-sm text-muted-foreground">Track attendance and manage leave efficiently</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center"
            >
              <Button 
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                onClick={handleLogin}
              >
                Login to Dashboard
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
