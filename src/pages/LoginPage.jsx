import { useState } from "react";
import bgImage from "../assests/login.png";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { Label } from "../components/lable";
import { Checkbox } from "../components/checkbox";
import { Wrench, Mail, Lock, ArrowRight, Package, TrendingUp, Settings } from "lucide-react";

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
    <div className="min-h-screen flex">
      {/* Left Section */}
      <aside className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 via-blue-500 to-blue-500 p-12 flex-col justify-between relative overflow-hidden border-r border-white/20">
        {/* Background image */}
        <img
          src={bgImage}
          alt="Garage Background"
          className="absolute inset-0 w-full h-full object-cover brightness-90 contrast-110"
        />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>

        {/* Logo */}
        <div className="relative z-10 mb-8 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
            <Wrench className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-white text-2xl">GarageFlow</h1>
            <p className="text-blue-200 text-sm">Inventory Management</p>
          </div>
        </div>

        {/* Main text */}
        <div className="relative z-10 space-y-4">
          <h2 className="text-white text-4xl font-semibold leading-snug">
            Streamline Your <br /> Garage Operations
          </h2>
          <p className="text-blue-100 text-lg">
            Complete inventory management solution for auto repair shops and garages.
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 mt-6 space-y-4">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 text-white">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">{feature.icon}</div>
              <div>
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-blue-200 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer text */}
        <div className="relative z-10 mt-8 text-blue-200 text-sm">
          Trusted by over 500+ auto repair shops worldwide
        </div>
      </aside>

      {/* Right Section */}
      <main className="flex-1 flex items-center justify-center p-8 bg-white shadow-[-8px_0_24px_rgba(0,0,0,0.08)]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900 text-xl">GarageFlow</h1>
              <p className="text-slate-500 text-sm">Inventory Management</p>
            </div>
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <h2 className="text-3xl text-slate-900 mb-2">Welcome back</h2>
            <p className="text-slate-500">Please enter your credentials to sign in</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                />
                <Label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                  Remember me
                </Label>
              </div>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Don't have an account?</span>
            </div>
          </div>

          {/* Register button */}
          <Button
            type="button"
            variant="outline"
            onClick={onSwitchToRegister}
            className="w-full h-12 border border-blue-600 text-white bg-blue-600 hover:bg-blue-700"
          >
            Create New Account
          </Button>

          {/* Footer */}
          <div className="mt-8 flex justify-center gap-6 text-sm text-slate-500">
            <button className="hover:text-slate-700">Terms</button>
            <button className="hover:text-slate-700">Privacy</button>
            <button className="hover:text-slate-700">Support</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;
