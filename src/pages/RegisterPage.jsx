import { useState } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import bgImage from "../assests/login.png";
import signupAnimation from "../assests/Isometric data analysis.json";
import { Input } from "../components/input";
import { Label } from "../components/lable";
import { register as apiRegister, login as apiLogin } from "../lib/auth";
import { User, Building, Mail, Lock, ArrowRight, Wrench } from "lucide-react";

export function RegisterPage({ onRegister, onSwitchToLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    garageName: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await apiRegister({
        name: formData.name,
        email: formData.email,
        garageName: formData.garageName,
        password: formData.password,
      });

      const me = await apiLogin({
        email: formData.email,
        password: formData.password,
      });
      onRegister?.(me);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Register failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <aside className="items-center justify-center hidden p-8 lg:flex lg:w-1/2">
        <div className="max-w-xl w-190">
          <Lottie animationData={signupAnimation} loop autoplay />
        </div>
      </aside>

      <main className="flex items-center justify-center flex-1 p-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="p-5 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-2xl border-white/20 sm:p-8">
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 mb-5 lg:hidden">
              <div className="bg-blue-600/40 backdrop-blur-sm p-2.5 rounded-lg border border-white/30">
                <Wrench className="text-white w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">GarageFlow</h1>
                <p className="text-xs text-blue-100">Inventory Management</p>
              </div>
            </div>

            {/* Header */}
            <div className="mb-5 text-center">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Create Account
              </h2>
              <p className="mt-1 text-xs text-blue-100 sm:text-sm">
                Register your garage and start managing inventory
              </p>
            </div>

            {/* Form - NO internal scrolling */}
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              {/* Full Name */}
              <div>
                <Label className="text-sm font-medium text-white/90">
                  Full Name
                </Label>
                <div className="relative mt-1">
                  <User className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/70" />
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    className="h-10 pl-10 text-sm text-white placeholder-blue-200 border sm:h-11 bg-white/10 border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Garage Name */}
              <div>
                <Label className="text-sm font-medium text-white/90">
                  Garage Name
                </Label>
                <div className="relative mt-1">
                  <Building className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/70" />
                  <Input
                    value={formData.garageName}
                    onChange={(e) =>
                      setFormData({ ...formData, garageName: e.target.value })
                    }
                    placeholder="Garage name"
                    className="h-10 pl-10 text-sm text-white placeholder-blue-200 border sm:h-11 bg-white/10 border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label className="text-sm font-medium text-white/90">
                  Email Address
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/70" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your Email"
                    className="h-10 pl-10 text-sm text-white placeholder-blue-200 border sm:h-11 bg-white/10 border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label className="text-sm font-medium text-white/90">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/70" />
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="h-10 pl-10 text-sm text-white placeholder-blue-200 border sm:h-11 bg-white/10 border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <Label className="text-sm font-medium text-white/90">
                  Confirm Password
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-white/70" />
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
                    className="h-10 pl-10 text-sm text-white placeholder-blue-200 border sm:h-11 bg-white/10 border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-red-200 border rounded bg-red-900/30 border-red-400/30">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center w-full gap-2 font-medium text-white rounded-lg shadow-md h-11 sm:h-12 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create Account"}{" "}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </form>

            {/* Sign In Link */}
            <div className="mt-5 text-xs text-center text-blue-100 sm:text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() =>
                  onSwitchToLogin
                    ? onSwitchToLogin()
                    : navigate("/login")
                }
                className="font-medium text-blue-200 transition hover:text-white hover:underline"
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
