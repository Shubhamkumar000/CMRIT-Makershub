import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("admin_logged_in") || sessionStorage.getItem("admin_logged_in");
    if (isAdminLoggedIn === "true") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const result = await login(username, password, true);
    if (!result.success) {
      toast({ title: result.error || "Login Failed", description: "Invalid credentials.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    
    toast({ title: "Welcome, Admin!", description: "Redirecting to dashboard..." });
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Home
        </button>
        <div className="bg-card rounded-2xl border border-border shadow-xl p-8 space-y-6">
          <div className="flex items-center gap-3 justify-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Lock className="text-primary-foreground" size={22} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-foreground">Admin Login</h1>
          <p className="text-sm text-center text-muted-foreground">Access the booking management dashboard</p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
            </div>
          </div>

          <Button onClick={handleLogin} size="lg" className="w-full text-lg py-6 rounded-xl font-semibold" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
