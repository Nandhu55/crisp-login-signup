import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthCard } from "@/components/ui/auth-card";
import { BrandHeader } from "@/components/ui/brand-header";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    course: "",
    phoneNumber: "",
    year: "",
    semester: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup attempt:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AuthCard>
      <BrandHeader />
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Create an Account</h2>
        <p className="text-muted-foreground">Join our community of learners today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="course" className="text-foreground">Course/Branch</Label>
            <Select onValueChange={(value) => handleSelectChange("course", value)}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="computer-science">Computer Science</SelectItem>
                <SelectItem value="electrical">Electrical Engineering</SelectItem>
                <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                <SelectItem value="civil">Civil Engineering</SelectItem>
                <SelectItem value="electronics">Electronics & Communication</SelectItem>
                <SelectItem value="chemical">Chemical Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-foreground">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="123-456-7890"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year" className="text-foreground">Year</Label>
            <Select onValueChange={(value) => handleSelectChange("year", value)}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester" className="text-foreground">Semester</Label>
            <Select onValueChange={(value) => handleSelectChange("semester", value)}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="1">1st Semester</SelectItem>
                <SelectItem value="2">2nd Semester</SelectItem>
                <SelectItem value="3">3rd Semester</SelectItem>
                <SelectItem value="4">4th Semester</SelectItem>
                <SelectItem value="5">5th Semester</SelectItem>
                <SelectItem value="6">6th Semester</SelectItem>
                <SelectItem value="7">7th Semester</SelectItem>
                <SelectItem value="8">8th Semester</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-3 transition-all duration-200"
        >
          Send OTP
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">OR CONTINUE WITH</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-border text-foreground hover:bg-secondary"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </Button>
      </form>

      <div className="text-center">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
          Sign in
        </Link>
      </div>
    </AuthCard>
  );
};

export default Signup;