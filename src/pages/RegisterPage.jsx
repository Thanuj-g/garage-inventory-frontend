import { useState } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import signupAnimation from "../assests/progerss.json";
import { Input } from "../components/input";
import { Label } from "../components/lable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/card";
import { User, Building, Mail, Lock } from "lucide-react";

export function RegisterPage({ onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    garageName: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister();
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-slate-900 px-4">
      {/* Left Section*/}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-100 h-4/5 opacity-60">
          <Lottie animationData={signupAnimation} loop />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="bg-blue-500/20 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border-none">
            <CardHeader className="text-center space-y-2 pb-2">
              <CardTitle className="text-lg font-semibold text-white">
                Create Account
              </CardTitle>
              <CardDescription className="text-blue-100 text-sm">
                Register your garage to manage inventory
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <form onSubmit={handleSubmit} className="space-y-2">
                {/* Full Name */}
                <div className="space-y-1">
                  <Label className="text-white/90">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="pl-11 h-12 bg-blue-400/20 text-white placeholder-blue-100 border-none focus:ring-blue-300"
                      required
                    />
                  </div>
                </div>

                {/* Garage Name */}
                <div className="space-y-1">
                  <Label className="text-white/90">Garage Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
                    <Input
                      value={formData.garageName}
                      onChange={(e) =>
                        setFormData({ ...formData, garageName: e.target.value })
                      }
                      placeholder="Auto Works Garage"
                      className="pl-11 h-12 bg-blue-400/20 text-white placeholder-blue-100 border-none focus:ring-blue-300"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label className="text-white/90">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="admin@garage.com"
                      className="pl-11 h-12 bg-blue-400/20 text-white placeholder-blue-100 border-none focus:ring-blue-300"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label className="text-white/90">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="pl-11 h-12 bg-blue-400/20 text-white border-none focus:ring-blue-300"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Label className="text-white/90">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="pl-11 h-12 bg-blue-400/20 text-white border-none focus:ring-blue-300"
                      required
                    />
                  </div>
                </div>

                {/* Button */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full h-12 bg-blue-600/80 hover:bg-blue-700/90 text-white rounded-lg flex items-center justify-center gap-2"
                >
                  Create Account
                </motion.button>
              </form>

              <div className="mt-4 text-center text-blue-100 text-sm">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-blue-300 hover:underline"
                >
                  Sign in
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default RegisterPage;
