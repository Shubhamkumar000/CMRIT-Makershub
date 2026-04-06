import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const StudentLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    
    if (isRegister) {
      const result = await register({ name, email, password });
      if (!result.success) { 
        toast({ title: result.error || "Registration failed", variant: "destructive" }); 
        return; 
      }
      toast({ title: "Account created! Please log in." });
      setIsRegister(false);
    } else {
      const result = await login(email, password);
      if (!result.success) { 
        toast({ title: result.error || "Invalid credentials", variant: "destructive" }); 
        return; 
      }
      toast({ title: `Welcome, ${result.user?.name}!` });
      navigate("/student/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft size={16} /> Back to Home
        </button>
        <Card className="border-border shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{isRegister ? "Create Account" : "Student Login"}</CardTitle>
            <CardDescription>{isRegister ? "Register to report & track issues" : "Login to access your tickets"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />}
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Button type="submit" className="w-full gap-2">
                {isRegister ? <><UserPlus size={16} /> Create Account</> : <><LogIn size={16} /> Login</>}
              </Button>
            </form>
            <p className="text-sm text-center mt-4 text-muted-foreground">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsRegister(!isRegister)} className="text-primary font-medium hover:underline">
                {isRegister ? "Login" : "Register"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentLogin;
