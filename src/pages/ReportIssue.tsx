import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ticketsAPI } from "@/lib/api";
import { EQUIPMENT_LIST } from "@/lib/ticketStore";

const ReportIssue = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [equipment, setEquipment] = useState(searchParams.get("equipment") || "");

  if (!user) { navigate("/student/login"); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !equipment) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    try {
      await ticketsAPI.create({
        equipment,
        title: title.trim(),
        description: description.trim(),
      });
      toast({ title: "Ticket submitted successfully!" });
      navigate("/student/dashboard");
    } catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Failed to submit ticket",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate("/student/dashboard")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <Card className="border-border shadow-xl">
          <CardHeader><CardTitle className="text-2xl font-bold">Report an Issue</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Equipment / Facility</label>
                <Select value={equipment} onValueChange={setEquipment}>
                  <SelectTrigger><SelectValue placeholder="Select equipment" /></SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_LIST.map((eq) => (<SelectItem key={eq} value={eq}>{eq}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Issue Title</label>
                <Input placeholder="e.g. Printer nozzle clogged" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
                <Textarea placeholder="Describe the issue in detail..." rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <Button type="submit" className="w-full gap-2"><Send size={16} /> Submit Ticket</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssue;
