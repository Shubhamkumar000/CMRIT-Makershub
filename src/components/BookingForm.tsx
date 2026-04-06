import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { bookingsAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const branches = [
  "Computer Science & Engineering",
  "Information Science & Engineering",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Artificial Intelligence & ML",
  "Data Science",
];

interface BookingFormProps {
  serviceName: string;
  icon: LucideIcon;
  nominalFee: number;
  cmritFee: number;
}

const BookingForm = ({ serviceName, icon: Icon, nominalFee, cmritFee }: BookingFormProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCmrit, setIsCmrit] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", usn: "", branch: "" });

  const fee = isCmrit ? cmritFee : nominalFee;
  const handleChange = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const getValidationError = () => {
    if (!form.name.trim()) return "Please enter your full name.";
    if (!form.phone.trim()) return "Please enter your phone number.";
    if (!/^\d{10}$/.test(form.phone.trim())) return "Phone number must be exactly 10 digits.";
    if (!form.email.trim()) return "Please enter your email address.";
    if (!/\S+@\S+\.\S+/.test(form.email.trim())) return "Please enter a valid email address.";
    if (isCmrit && !form.usn.trim()) return "Please enter your USN.";
    if (isCmrit && !form.branch) return "Please select your branch.";
    return null;
  };

  const generateInvoice = async () => {
    const error = getValidationError();
    if (error) { 
      toast({ title: "Invalid Details", description: error, variant: "destructive" }); 
      return; 
    }

    try {
      // First create booking in backend
      const bookingData = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        serviceName,
        fee,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
        isCmritStudent: isCmrit,
        usn: isCmrit ? form.usn.trim() : undefined,
        branch: isCmrit ? form.branch : undefined
      };

      const bookingResult = await bookingsAPI.create(bookingData);
      
      if (!bookingResult) {
        throw new Error('Failed to create booking');
      }

      // Generate PDF
      const doc = new jsPDF();
      const invoiceNo = bookingResult.booking.invoiceNumber;
      const date = bookingResult.booking.date;

      // PDF generation code (same as before)
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, 210, 45, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("CMRIT MakerSpace", 20, 22);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`${serviceName} - Booking Invoice`, 20, 34);

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.text(`Invoice #: ${invoiceNo}`, 140, 55);
      doc.text(`Date: ${date}`, 140, 62);

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("Billed To", 20, 60);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      let y = 70;
      doc.text(`Name: ${form.name}`, 20, y); y += 8;
      doc.text(`Phone: ${form.phone}`, 20, y); y += 8;
      doc.text(`Email: ${form.email}`, 20, y); y += 8;
      if (isCmrit) {
        doc.text(`USN: ${form.usn}`, 20, y); y += 8;
        doc.text(`Branch: ${form.branch}`, 20, y); y += 8;
      }
      doc.text(`Student Type: ${isCmrit ? "CMRIT Student" : "External"}`, 20, y); y += 16;

      doc.setFillColor(243, 244, 246);
      doc.rect(20, y, 170, 10, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Description", 25, y + 7);
      doc.text("Qty", 120, y + 7);
      doc.text("Amount", 155, y + 7); y += 14;
      doc.setFont("helvetica", "normal");
      doc.text(`${serviceName} Booking`, 25, y + 4);
      doc.text("1", 125, y + 4);
      doc.text(`Rs. ${fee}`, 155, y + 4); y += 10;
      doc.line(20, y, 190, y); y += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Total:", 120, y);
      doc.text(`Rs. ${fee}`, 155, y); y += 20;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(130, 130, 130);
      doc.text("Thank you for choosing CMRIT MakerSpace!", 20, y);
      doc.text("For queries, contact makerspace@cmrit.ac.in", 20, y + 6);

      const safeServiceName = serviceName.replace(/\s+/g, "_");
      doc.save(`CMRIT_${safeServiceName}_${invoiceNo}.pdf`);

      toast({ title: "Booking Confirmed!", description: "Your invoice has been downloaded." });
    } catch (error) {
      console.error("Booking error:", error);
      const description = error instanceof Error
        ? error.message
        : "Failed to create booking. Please try again.";
      toast({ title: "Error", description, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-6">
        <div className="max-w-2xl mx-auto px-4 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity"><ArrowLeft size={24} /></button>
          <div className="flex items-center gap-3">
            <Icon size={28} />
            <div>
              <h1 className="text-2xl font-bold">{serviceName}</h1>
              <p className="text-sm opacity-80">CMRIT MakerSpace — Book your slot</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-10 space-y-6">
          <h2 className="text-xl font-bold text-foreground">Booking Details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="Your full name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" placeholder="10-digit number" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="mt-1" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
            <div>
              <p className="font-semibold text-foreground">Are you a CMRIT student?</p>
              <p className="text-sm text-muted-foreground">CMRIT students get a discounted rate</p>
            </div>
            <Switch checked={isCmrit} onCheckedChange={setIsCmrit} />
          </div>

          {isCmrit && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div>
                <Label htmlFor="usn">USN (University Seat Number) *</Label>
                <Input id="usn" placeholder="e.g. 1CR22CS001" value={form.usn} onChange={(e) => handleChange("usn", e.target.value.toUpperCase())} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="branch">Branch *</Label>
                <Select value={form.branch} onValueChange={(v) => handleChange("branch", v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select your branch" /></SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-primary/10 border border-primary/20 p-5 text-center">
            <p className="text-sm text-muted-foreground mb-1">Booking Fee</p>
            <p className="text-4xl font-bold text-primary">₹{fee}</p>
            {isCmrit && (
              <p className="text-xs text-muted-foreground mt-1">
                <span className="line-through">₹{nominalFee}</span> — CMRIT student discount applied!
              </p>
            )}
          </div>

          <Button onClick={generateInvoice} size="lg" className="w-full text-lg py-6 rounded-xl font-semibold">
            Book & Download Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
