import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminDashboard } from "@/components/AdminDashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ADMIN_EMAIL = "gnreddy3555@gmail.com";
const ADMIN_PASSWORD = "nandhu@sunny";

export default function Admin() {
  const { user, loading, signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Check if admin account exists
        checkAdminAccount();
        return;
      }
      if (user.email !== ADMIN_EMAIL) {
        navigate("/login");
        return;
      }
      setIsAuthorized(true);
    }
  }, [user, loading, navigate]);

  const checkAdminAccount = async () => {
    try {
      // Try to sign in with admin credentials to see if account exists
      const { error } = await signIn(ADMIN_EMAIL, ADMIN_PASSWORD);
      if (error) {
        setShowSetup(true);
      }
    } catch (error) {
      setShowSetup(true);
    }
  };

  const createAdminAccount = async () => {
    try {
      console.log("Creating admin account...");
      
      // Create the admin account
      const { error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: {
          data: {
            first_name: "Admin",
            last_name: "User"
          },
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) {
        console.error("Admin signup error:", error);
        toast.error(`Failed to create admin account: ${error.message}`);
        return;
      }

      toast.success("Admin account created successfully! Please check your email to confirm.");
      setShowSetup(false);
      
    } catch (error) {
      console.error("Create admin error:", error);
      toast.error("Failed to create admin account");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Setup Admin Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              The admin account ({ADMIN_EMAIL}) doesn't exist yet. 
              Click below to create it.
            </p>
            <Button onClick={createAdminAccount} className="w-full">
              Create Admin Account
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/login")} 
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar />
        <main className="flex-1">
          <AdminDashboard />
        </main>
      </div>
    </SidebarProvider>
  );
}