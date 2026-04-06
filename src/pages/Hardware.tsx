import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Cpu, Package, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import { bookingsAPI, inventoryAPI } from "@/lib/api";
import { type InventoryItem } from "@/lib/ticketStore";

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

const Hardware = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCmrit, setIsCmrit] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", usn: "", branch: "" });

  const fetchInventory = async () => {
    try {
      const inventoryRes = await inventoryAPI.getAll();
      const normalizedItems: InventoryItem[] = (inventoryRes.inventory || []).map((item: any) => ({
        id: item._id || item.id,
        name: item.name,
        description: item.description,
        fee: item.fee,
        cmritFee: item.cmritFee,
        quantity: item.quantity,
        available: item.available,
        image: item.image,
      }));
      setItems(normalizedItems);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      toast({ title: "Error", description: "Failed to load equipment list.", variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const openBooking = (item: InventoryItem) => {
    setSelectedItem(item);
    setForm({ name: "", phone: "", email: "", usn: "", branch: "" });
    setIsCmrit(false);
    setDialogOpen(true);
  };

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

  const handleBooking = async () => {
    if (!selectedItem) return;
    const error = getValidationError();
    if (error) { toast({ title: "Invalid Details", description: error, variant: "destructive" }); return; }

    const fee = isCmrit ? selectedItem.cmritFee : selectedItem.fee;

    try {
      await inventoryAPI.book(selectedItem.id);

      const bookingData = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        serviceName: `Hardware: ${selectedItem.name}`,
        fee,
        date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
        isCmritStudent: isCmrit,
        usn: isCmrit ? form.usn.trim() : undefined,
        branch: isCmrit ? form.branch : undefined,
      };

      const bookingResult = await bookingsAPI.create(bookingData);

      const doc = new jsPDF();
      const invoiceNo = bookingResult?.booking?.invoiceNumber || `HW-${Date.now().toString(36).toUpperCase()}`;
      const date = bookingResult?.booking?.date || bookingData.date;

      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, 210, 45, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("CMRIT MakerSpace", 20, 22);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Hardware Booking Invoice", 20, 34);

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
      doc.text("Equipment", 25, y + 7);
      doc.text("Qty", 120, y + 7);
      doc.text("Amount", 155, y + 7); y += 14;
      doc.setFont("helvetica", "normal");
      doc.text(selectedItem.name, 25, y + 4);
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

      doc.save(`CMRIT_Hardware_${invoiceNo}.pdf`);

      toast({ title: "Booking Confirmed!", description: "Invoice downloaded. Equipment reserved." });
      setDialogOpen(false);
      await fetchInventory();
    } catch (err) {
      console.error(err);
      const description = err instanceof Error ? err.message : "Failed to book equipment.";
      toast({ title: "Error", description, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-6">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity"><ArrowLeft size={24} /></button>
          <div className="flex items-center gap-3">
            <Cpu size={28} />
            <div>
              <h1 className="text-2xl font-bold">Hardware & Equipment</h1>
              <p className="text-sm opacity-80">CMRIT MakerSpace — Browse & book equipment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl border border-border shadow-lg p-6 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-foreground text-lg leading-tight">{item.name}</h3>
                  <Badge variant={item.available > 0 ? "default" : "destructive"} className="ml-2 shrink-0">
                    {item.available > 0 ? `${item.available} left` : "Out of stock"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
                  <Package size={14} /> Total: {item.quantity}
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-primary flex items-center"><IndianRupee size={18} />{item.cmritFee}</span>
                  <span className="text-sm text-muted-foreground line-through">₹{item.fee}</span>
                  <span className="text-xs text-muted-foreground">(CMRIT)</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">External fee: ₹{item.fee}</p>
                <Button onClick={() => openBooking(item)} disabled={item.available <= 0} className="w-full rounded-xl">
                  {item.available > 0 ? "Book Now" : "Unavailable"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Cpu size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No equipment available yet</p>
            <p className="text-sm">Check back soon!</p>
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book: {selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Full Name *</Label>
              <Input placeholder="Your full name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Phone *</Label>
                <Input type="tel" placeholder="10-digit" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" placeholder="you@email.com" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="mt-1" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
              <div>
                <p className="font-semibold text-foreground text-sm">CMRIT student?</p>
                <p className="text-xs text-muted-foreground">Get discounted rate</p>
              </div>
              <Switch checked={isCmrit} onCheckedChange={setIsCmrit} />
            </div>

            {isCmrit && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <Label>USN *</Label>
                  <Input placeholder="e.g. 1CR22CS001" value={form.usn} onChange={(e) => handleChange("usn", e.target.value.toUpperCase())} className="mt-1" />
                </div>
                <div>
                  <Label>Branch *</Label>
                  <Select value={form.branch} onValueChange={(v) => handleChange("branch", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedItem && (
              <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Booking Fee</p>
                <p className="text-3xl font-bold text-primary">₹{isCmrit ? selectedItem.cmritFee : selectedItem.fee}</p>
                {isCmrit && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="line-through">₹{selectedItem.fee}</span> — CMRIT discount!
                  </p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleBooking}>Book & Download Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Hardware;
