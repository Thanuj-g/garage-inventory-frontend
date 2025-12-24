import { useState } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import bgImage from "../assests/login.png";
import signupAnimation from "../assests/Isometric data analysis.json";
import { Input } from "../components/input";
import { Label } from "../components/lable";
import { User, Building, Mail, Lock, ArrowRight, Wrench } from "lucide-react";

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
    <div
      className="min-h-screen flex relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <aside className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
        <div className="w-190 max-w-xl">
          <Lottie animationData={signupAnimation} loop autoplay />
        </div>
      </aside>

      {/* Right: Form */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-5 sm:p-8">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-5">
              <div className="bg-blue-600/40 backdrop-blur-sm p-2.5 rounded-lg border border-white/30">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-white text-xl font-semibold">GarageFlow</h1>
                <p className="text-blue-100 text-xs">Inventory Management</p>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-5">
              <h2 className="text-white text-2xl sm:text-3xl font-semibold">
                Create Account
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                Register your garage and start managing inventory
              </p>
            </div>

            {/* Form - NO internal scrolling */}
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {/* Full Name */}
              <div>
                <Label className="text-white/90 text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4" />
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    className="pl-10 h-10 sm:h-11 bg-white/10 text-white placeholder-blue-200 border border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm text-sm"
                    required
                  />
                </div>
              </div>

              {/* Garage Name */}
              <div>
                <Label className="text-white/90 text-sm font-medium">
                  Garage Name
                </Label>
                <div className="relative mt-1">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4" />
                  <Input
                    value={formData.garageName}
                    onChange={(e) =>
                      setFormData({ ...formData, garageName: e.target.value })
                    }
                    placeholder="Garage name"
                    className="pl-10 h-10 sm:h-11 bg-white/10 text-white placeholder-blue-200 border border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label className="text-white/90 text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your Email"
                    className="pl-10 h-10 sm:h-11 bg-white/10 text-white placeholder-blue-200 border border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label className="text-white/90 text-sm font-medium">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4" />
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="pl-10 h-10 sm:h-11 bg-white/10 text-white placeholder-blue-200 border border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm text-sm"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label className="text-white/90 text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-4 h-4" />
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="pl-10 h-10 sm:h-11 bg-white/10 text-white placeholder-blue-200 border border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm text-sm"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full h-11 sm:h-12 bg-blue-600/80 text-white hover:bg-blue-600 rounded-lg flex items-center justify-center gap-2 font-medium shadow-md backdrop-blur-sm"
              >
                Create Account <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </form>

            {/* Sign In Link */}
            <div className="mt-5 text-center text-blue-100 text-xs sm:text-sm">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-200 hover:text-white font-medium hover:underline transition"
              >
                Sign in
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default RegisterPage;
