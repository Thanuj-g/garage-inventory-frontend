import { useState } from "react";
import Lottie from "lottie-react";
import signupAnimation from "../assests/progerss.json";
import { Button } from "../components/button";
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
    <div className="flex items-center justify-center min-h-screen px-4 bg-slate-900">
      {/* Left Section - Lottie animation */}
      <div className="flex items-center justify-center flex-1">
        <div className="w-100 h-4/5 opacity-60">
          <Lottie animationData={signupAnimation} loop />
        </div>
      </div>

      {/* Right Section - Registration card */}
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md p-2 border shadow-2xl bg-white/10 backdrop-blur-xl border-white/20 rounded-2xl">
          <CardHeader className="pb-4 space-y-2 text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-sm text-slate-300">
              Register your garage to manage inventory
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label className="text-slate-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute w-5 h-5 left-3 top-3 text-slate-400" />
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-12 text-white bg-white/10 border-white/20 placeholder:text-slate-400"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Garage Name</Label>
                <div className="relative">
                  <Building className="absolute w-5 h-5 left-3 top-3 text-slate-400" />
                  <Input
                    value={formData.garageName}
                    onChange={(e) =>
                      setFormData({ ...formData, garageName: e.target.value })
                    }
                    className="pl-12 text-white bg-white/10 border-white/20 placeholder:text-slate-400"
                    placeholder="Auto Works Garage"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 left-3 top-3 text-slate-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-12 text-white bg-white/10 border-white/20 placeholder:text-slate-400"
                    placeholder="admin@garage.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 left-3 top-3 text-slate-400" />
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-12 text-white bg-white/10 border-white/20"
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 left-3 top-3 text-slate-400" />
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="pl-12 text-white bg-white/10 border-white/20"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-semibold text-white shadow-lg h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={onSwitchToLogin}
                className="text-sm text-blue-400 hover:underline"
              >
                Already have an account? Sign in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;
