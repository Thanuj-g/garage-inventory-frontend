import { useState } from "react";
import { motion } from "framer-motion";
import bgImage from "../assests/login.png";
import { Input } from "../components/input";
import { Label } from "../components/lable";
import { Checkbox } from "../components/checkbox";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
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
      className="min-h-screen flex relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      {/*LEFT SECTION*/}
      <aside className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative z-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-white text-2xl">GarageFlow</h1>
            <p className="text-blue-200 text-sm">Inventory Management</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-white text-4xl font-semibold leading-snug">
            Streamline Your <br /> Garage Operations
          </h2>
          <p className="text-blue-100 text-lg max-w-lg">
            Complete inventory management solution for auto repair shops and
            garages.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 text-white">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-blue-200 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-blue-200 text-sm">
          Trusted by over 500+ auto repair shops worldwide
        </div>
      </aside>

      {/*RIGHT SECTION*/}
      <main className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900 text-xl">GarageFlow</h1>
              <p className="text-slate-500 text-sm">Inventory Management</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">
              Please enter your credentials to sign in
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12"
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
                <Label className="text-sm text-slate-600">Remember me</Label>
              </div>
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          <div className="my-8 text-center text-sm text-slate-500">
            Don’t have an account?
          </div>

          {/* Register */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSwitchToRegister}
            className="w-full h-12 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
          >
            Create New Account
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}

export default LoginPage;
