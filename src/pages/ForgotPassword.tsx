import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/ui/auth-card";
import { BrandHeader } from "@/components/ui/brand-header";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset request for:", email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <AuthCard>
        <BrandHeader />
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Check your email</h2>
          <p className="text-muted-foreground">
            We've sent a password reset link to <br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <BrandHeader />
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Reset Password</h2>
        <p className="text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary"
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-3 transition-all duration-200"
        >
          Send Reset Link
        </Button>
      </form>

      <div className="text-center">
        <Link to="/login" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors font-medium">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Link>
      </div>
    </AuthCard>
  );
};

export default ForgotPassword;