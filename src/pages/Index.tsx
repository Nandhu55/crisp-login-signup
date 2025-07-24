import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandHeader } from "@/components/ui/brand-header";
import { AuthCard } from "@/components/ui/auth-card";

const Index = () => {
  return (
    <AuthCard>
      <BrandHeader />
      
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Welcome to B-Tech Hub</h2>
        <p className="text-muted-foreground">Your gateway to academic excellence and community learning.</p>
      </div>

      <div className="space-y-3">
        <Button asChild className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium py-3">
          <Link to="/login">Sign In</Link>
        </Button>
        
        <Button asChild variant="outline" className="w-full border-border text-foreground hover:bg-secondary">
          <Link to="/signup">Create Account</Link>
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Join thousands of students in their learning journey
      </div>
    </AuthCard>
  );
};

export default Index;
