import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "../assests/login.png";
import { Input } from "../components/input";
import { Label } from "../components/lable";
import { Checkbox } from "../components/checkbox";
import { login as apiLogin } from "../lib/auth";
import {
  Wrench,
  Mail,
  Lock,
  ArrowRight,
  Package,
  TrendingUp,
  Settings,
} from "lucide-react";

export function LoginPage({ onLogin, onSwitchToRegister }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");

      const me = await apiLogin({ email, password });
      onLogin?.(me);

      const from = location.state?.from || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Package className="w-5 h-5" />,
      title: "Smart Inventory Tracking",
      description: "Real-time stock monitoring with automated alerts",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Sales Analytics",
      description: "Comprehensive reporting and insights",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Supplier Management",
      description: "Manage orders and track deliveries",
    },
  ];

  return (
    <div
      className="relative flex min-h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/25"></div>

      {/* LEFT SECTION - Remains dark/promotional */}
      <aside className="relative z-10 flex-col justify-between hidden p-12 lg:flex lg:w-1/2">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 border bg-blue-600/30 backdrop-blur-sm rounded-xl border-white/20">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl text-white">GarageFlow</h1>
            <p className="text-sm text-blue-200">Inventory Management</p>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-semibold leading-snug text-white">
            Streamline Your <br /> Garage Operations
          </h2>
          <p className="max-w-lg text-lg text-blue-100">
            Complete inventory management solution for auto repair shops and
            garages.
          </p>
        </div>
        <div className="mt-6 space-y-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 text-white">
              <div className="p-2 rounded-lg bg-blue-600/20 backdrop-blur-sm">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-blue-200">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-sm text-blue-200">
          Trusted by over 500+ auto repair shops worldwide
        </div>
      </aside>

      {/* RIGHT SECTION - Transparent glassmorphism theme */}
      <main className="relative z-10 flex items-center justify-center flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md p-8 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-2xl border-white/20"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="p-2 border rounded-lg bg-blue-600/40 backdrop-blur-sm border-white/30">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">GarageFlow</h1>
              <p className="text-sm text-blue-100">Inventory Management</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-semibold text-white">
              Welcome back
            </h2>
            <p className="text-sm text-blue-100">
              Please enter your credentials to sign in
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="font-medium text-white/90">Email Address</Label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-white/70" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-white placeholder-blue-200 border pl-11 bg-white/10 border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-medium text-white/90">Password</Label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-white/70" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-white placeholder-blue-200 border pl-11 bg-white/10 border-white/30 focus:border-blue-400 focus:ring-blue-400 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                />
                <Label className="text-sm text-white/90">Remember me</Label>
              </div>
              <button
                type="button"
                className="text-sm text-blue-200 hover:text-white hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-200 border rounded bg-red-900/30 border-red-400/30">
                {error}
              </div>
            )}

            {/* Login button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center w-full h-12 gap-2 font-medium text-white rounded-lg shadow-md bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign In"}{" "}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-8 text-sm text-center text-blue-100">
            Don’t have an account?
          </div>

          {/* Register button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              onSwitchToRegister ? onSwitchToRegister() : navigate("/register")
            }
            className="w-full h-12 font-medium text-white transition border rounded-lg border-white/40 hover:bg-white/10 backdrop-blur-sm"
          >
            Create New Account
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}

export default LoginPage;
