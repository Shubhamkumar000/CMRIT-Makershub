import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Users, Trash2, Wrench, AlertCircle, Clock, CheckCircle2, CalendarPlus, Pencil, X, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import campusBg from "@/assets/campus-bg.jpg";
import { eventsAPI, ticketsAPI, notificationsAPI, inventoryAPI, bookingsAPI, uploadsAPI } from "@/lib/api";
import {
  type Ticket,
  type CampusEvent,
  type InventoryItem,
} from "@/lib/ticketStore";

interface Booking {
  id: string;
  name: string;
  phone: string;z
  email: string;
  isCmrit: boolean;
  usn?: string;
  branch?: string;
  service: string;
  fee: number;
  date: string;
}

const statusConfig = {
  open: { label: "Open", icon: AlertCircle, color: "bg-yellow-500/15 text-yellow-700 border-yellow-300" },
  "in-progress": { label: "In Progress", icon: Clock, color: "bg-blue-500/15 text-blue-700 border-blue-300" },
  resolved: { label: "Resolved", icon: CheckCircle2, color: "bg-green-500/15 text-green-700 border-green-300" },
};

const emptyEvent = { date: "", title: "", desc: "", time: "", venue: "", image: "" };
const emptyEquipment = { name: "", description: "", fee: 0, cmritFee: 0, quantity: 1, available: 1 };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"bookings" | "tickets" | "events" | "inventory">("bookings");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [adminUnread, setAdminUnread] = useState(0);

  // Event dialog state
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CampusEvent | null>(null);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [isUploadingEventImage, setIsUploadingEventImage] = useState(false);

  // Inventory dialog state
  const [invDialogOpen, setInvDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [invForm, setInvForm] = useState(emptyEquipment);

  const fetchTickets = async () => {
    const ticketsRes = await ticketsAPI.getAll();
    const normalizedTickets: Ticket[] = (ticketsRes.tickets || []).map((t: any) => ({
      id: t._id || t.id,
      userId: t.userId?._id || t.userId,
      userName: t.userName,
      userEmail: t.userEmail,
      equipment: t.equipment,
      title: t.title,
      description: t.description,
      status: t.status,
      assignedTo: t.assignedTo || "",
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    }));
    setTickets(normalizedTickets);
  };

  const fetchBookings = async () => {
    const bookingsRes = await bookingsAPI.getAll();
    const normalizedBookings: Booking[] = (bookingsRes.bookings || []).map((b: any) => ({
      id: b._id || b.id,
      name: b.name || b.userId?.name || 'Unknown',
      phone: b.phone || b.userId?.phone || '—',
      email: b.email || b.userId?.email || '—',
      isCmrit: !!b.isCmritStudent,
      usn: b.usn || '',
      branch: b.branch || '',
      service: b.serviceName,
      fee: b.fee,
      date: b.date
    }));
    setBookings(normalizedBookings);
  };

  const fetchEvents = async () => {
    const eventsRes = await eventsAPI.getAll();
    const normalizedEvents: CampusEvent[] = (eventsRes.events || []).map((ev: any) => ({
      id: ev._id || ev.id,
      date: ev.date,
      title: ev.title,
      desc: ev.description || ev.desc || "",
      time: ev.time,
      venue: ev.venue,
      image: ev.image || ""
    }));
    setEvents(normalizedEvents);
  };

  const fetchInventory = async () => {
    const inventoryRes = await inventoryAPI.getAll();
    const normalizedInventory: InventoryItem[] = (inventoryRes.inventory || []).map((item: any) => ({
      id: item._id || item.id,
      name: item.name,
      description: item.description,
      fee: item.fee,
      cmritFee: item.cmritFee,
      quantity: item.quantity,
      available: item.available,
      image: item.image
    }));
    setInventory(normalizedInventory);
  };

  const refreshActiveTabData = async () => {
    const unreadPromise = notificationsAPI.getUnreadCount();

    switch (activeTab) {
      case "bookings":
        await fetchBookings();
        break;
      case "tickets":
        await fetchTickets();
        break;
      case "events":
        await fetchEvents();
        break;
      case "inventory":
        await fetchInventory();
        break;
      default:
        break;
    }

    const unreadRes = await unreadPromise;
    setAdminUnread(unreadRes.unreadCount || 0);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in") || sessionStorage.getItem("admin_logged_in");
    if (isLoggedIn !== "true") { navigate("/admin/login"); return; }
    const refresh = async () => {
      if (document.hidden) return;
      try {
        await refreshActiveTabData();
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    };
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [navigate, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    sessionStorage.removeItem("admin_logged_in");
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/admin/login");
  };
  const handleClear = () => { localStorage.removeItem("cmrit_bookings"); setBookings([]); };

  const handleStatusChange = async (ticketId: string, newStatus: Ticket["status"]) => {
    try {
      await ticketsAPI.updateStatus(ticketId, { status: newStatus });
      await fetchTickets();
    } catch (error) {
      toast({ title: "Failed to update ticket", variant: "destructive" });
    }
  };

  const filteredTickets = statusFilter === "all" ? tickets : tickets.filter((t) => t.status === statusFilter);

  // Event handlers
  const openAddEvent = () => { setEditingEvent(null); setEventForm(emptyEvent); setEventDialogOpen(true); };
  const openEditEvent = (ev: CampusEvent) => {
    setEditingEvent(ev);
    setEventForm({ date: ev.date, title: ev.title, desc: ev.desc, time: ev.time, venue: ev.venue, image: ev.image || "" });
    setEventDialogOpen(true);
  };

  const handleEventImageUpload = async (file?: File) => {
    if (!file) return;
    try {
      setIsUploadingEventImage(true);
      const uploadRes = await uploadsAPI.uploadEventImage(file);
      setEventForm((prev) => ({ ...prev, image: uploadRes.url || "" }));
      toast({ title: "Image uploaded" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload image";
      toast({ title: "Upload failed", description: message, variant: "destructive" });
    } finally {
      setIsUploadingEventImage(false);
    }
  };

  const handleSaveEvent = async () => {
    if (isUploadingEventImage) {
      toast({ title: "Please wait", description: "Image upload is still in progress." });
      return;
    }

    if (!eventForm.title.trim() || !eventForm.date.trim() || !eventForm.time.trim() || !eventForm.venue.trim()) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      const payload = {
        title: eventForm.title,
        description: eventForm.desc,
        date: eventForm.date,
        time: eventForm.time,
        venue: eventForm.venue,
        image: eventForm.image,
      };

      if (editingEvent) {
        await eventsAPI.update(editingEvent.id, payload);
        toast({ title: "Event updated!" });
      } else {
        await eventsAPI.create(payload);
        toast({ title: "Event created!" });
      }

      await fetchEvents();
      setEventDialogOpen(false);
    } catch (error) {
      toast({ title: "Failed to save event", variant: "destructive" });
    }
  };
  const handleDeleteEvent = async (id: string) => {
    try {
      await eventsAPI.delete(id);
      await fetchEvents();
      toast({ title: "Event deleted" });
    } catch (error) {
      toast({ title: "Failed to delete event", variant: "destructive" });
    }
  };

  const handleSaveInventory = async () => {
    if (!invForm.name.trim()) {
      toast({ title: "Please enter equipment name", variant: "destructive" });
      return;
    }

    try {
      if (editingItem) {
        await inventoryAPI.update(editingItem.id, invForm);
        toast({ title: "Equipment updated!" });
      } else {
        await inventoryAPI.add({ ...invForm, category: "general" });
        toast({ title: "Equipment added!" });
      }
      await fetchInventory();
      setInvDialogOpen(false);
    } catch (error) {
      toast({ title: "Failed to save equipment", variant: "destructive" });
    }
  };

  const handleDeleteInventory = async (id: string) => {
    try {
      await inventoryAPI.delete(id);
      await fetchInventory();
      toast({ title: "Equipment deleted" });
    } catch (error) {
      toast({ title: "Failed to delete equipment", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="hover:opacity-80 transition-opacity"><ArrowLeft size={22} /></button>
            <div className="flex items-center gap-2">
              <Users size={24} />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleClear} className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Trash2 size={16} className="mr-1" /> Clear Bookings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <LogOut size={16} className="mr-1" /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button variant={activeTab === "bookings" ? "default" : "outline"} onClick={() => setActiveTab("bookings")} className="gap-2">
            <Users size={16} /> Bookings ({bookings.length})
          </Button>
          <Button variant={activeTab === "tickets" ? "default" : "outline"} onClick={async () => { setActiveTab("tickets"); await notificationsAPI.markRead(); setAdminUnread(0); }} className="gap-2 relative">
            <Wrench size={16} /> Tickets ({tickets.length})
            {adminUnread > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{adminUnread}</span>
            )}
          </Button>
          <Button variant={activeTab === "events" ? "default" : "outline"} onClick={() => setActiveTab("events")} className="gap-2">
            <CalendarPlus size={16} /> Events ({events.length})
          </Button>
          <Button variant={activeTab === "inventory" ? "default" : "outline"} onClick={() => setActiveTab("inventory")} className="gap-2">
            <Package size={16} /> Inventory ({inventory.length})
          </Button>
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <>
            {bookings.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Users size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg font-medium">No bookings yet</p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border shadow overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead><TableHead>Name</TableHead><TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead><TableHead>Service</TableHead><TableHead>Type</TableHead>
                      <TableHead>USN</TableHead><TableHead>Branch</TableHead><TableHead>Fee</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="text-sm whitespace-nowrap">{b.date}</TableCell>
                        <TableCell className="font-medium">{b.name}</TableCell>
                        <TableCell>{b.phone}</TableCell>
                        <TableCell>{b.email}</TableCell>
                        <TableCell>{b.service}</TableCell>
                        <TableCell><Badge variant={b.isCmrit ? "default" : "secondary"}>{b.isCmrit ? "CMRIT" : "External"}</Badge></TableCell>
                        <TableCell>{b.usn || "—"}</TableCell>
                        <TableCell>{b.branch || "—"}</TableCell>
                        <TableCell className="font-semibold">₹{b.fee}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium text-muted-foreground">Filter:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredTickets.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Wrench size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg font-medium">No tickets found</p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border shadow overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Created</TableHead><TableHead>Title</TableHead><TableHead>Equipment</TableHead>
                      <TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead>
                      <TableHead>Assign To</TableHead><TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((t) => {
                      const cfg = statusConfig[t.status];
                      const Icon = cfg.icon;
                      return (
                        <TableRow key={t.id}>
                          <TableCell className="text-sm whitespace-nowrap">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <p className="font-medium">{t.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{t.description}</p>
                          </TableCell>
                          <TableCell className="text-sm">{t.equipment}</TableCell>
                          <TableCell className="font-medium">{t.userName}</TableCell>
                          <TableCell className="text-sm">{t.userEmail}</TableCell>
                          <TableCell>
                            <Badge className={`${cfg.color} border gap-1`}><Icon size={12} /> {cfg.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <Input
                              placeholder="Staff name"
                              defaultValue={t.assignedTo || ""}
                              className="h-8 text-xs w-28"
                              onBlur={async (e) => {
                                try {
                                  await ticketsAPI.updateStatus(t.id, { status: t.status, assignedTo: e.target.value });
                                  await fetchTickets();
                                } catch (error) {
                                  toast({ title: "Failed to assign ticket", variant: "destructive" });
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Select value={t.status} onValueChange={(val) => handleStatusChange(t.id, val as Ticket["status"])}>
                              <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Manage campus events displayed on the homepage.</p>
              <Button onClick={openAddEvent} className="gap-2">
                <Plus size={16} /> Add Event
              </Button>
            </div>

            {events.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <CalendarPlus size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg font-medium">No events yet</p>
                <p className="text-sm mb-4">Create your first campus event.</p>
                <Button onClick={openAddEvent} className="gap-2"><Plus size={16} /> Add Event</Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((ev) => (
                  <div key={ev.id} className="bg-card rounded-xl border border-border shadow p-5 space-y-3">
                    <div className="rounded-lg overflow-hidden border border-border aspect-video">
                      <img src={ev.image || campusBg} alt={ev.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="text-xs">{ev.date}</Badge>
                      <div className="flex gap-1">
                        <button onClick={() => openEditEvent(ev)} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDeleteEvent(ev.id)} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground">{ev.title}</h3>
                    <p className="text-sm text-muted-foreground">{ev.desc}</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>🕐 {ev.time}</p>
                      <p>📍 {ev.venue}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add/Edit Event Dialog */}
            <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label>Event Title *</Label>
                    <Input placeholder="e.g. Hackathon 2026" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Date *</Label>
                    <Input placeholder="e.g. Aug 18 2026" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Time *</Label>
                    <Input placeholder="e.g. 09:00 AM - 06:00 PM" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Venue *</Label>
                    <Input placeholder="e.g. Main Auditorium" value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Brief description of the event" value={eventForm.desc} onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })} className="mt-1" rows={3} />
                  </div>
                  <div>
                    <Label>Event Image URL</Label>
                    <Input placeholder="https://example.com/event-image.jpg" value={eventForm.image} onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Or Upload Image</Label>
                    <Input type="file" accept="image/*" onChange={(e) => handleEventImageUpload(e.target.files?.[0])} className="mt-1" disabled={isUploadingEventImage} />
                    {isUploadingEventImage && <p className="mt-1 text-xs text-muted-foreground">Uploading image...</p>}
                  </div>
                  {eventForm.image && (
                    <div className="rounded-lg overflow-hidden border border-border">
                      <img src={eventForm.image} alt="Event preview" className="w-full h-36 object-cover" />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEventDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveEvent} disabled={isUploadingEventImage}>{editingEvent ? "Save Changes" : "Create Event"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">Manage hardware equipment available for booking.</p>
              <Button onClick={() => { setEditingItem(null); setInvForm(emptyEquipment); setInvDialogOpen(true); }} className="gap-2">
                <Plus size={16} /> Add Equipment
              </Button>
            </div>

            {inventory.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Package size={48} className="mx-auto mb-4 opacity-40" />
                <p className="text-lg font-medium">No equipment yet</p>
                <Button onClick={() => { setEditingItem(null); setInvForm(emptyEquipment); setInvDialogOpen(true); }} className="gap-2 mt-4"><Plus size={16} /> Add Equipment</Button>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border shadow overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead><TableHead>Description</TableHead>
                      <TableHead>Fee (Ext)</TableHead><TableHead>Fee (CMRIT)</TableHead>
                      <TableHead>Total</TableHead><TableHead>Available</TableHead><TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{item.description}</TableCell>
                        <TableCell>₹{item.fee}</TableCell>
                        <TableCell>₹{item.cmritFee}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={item.available > 0 ? "default" : "destructive"}>{item.available}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <button onClick={() => {
                              setEditingItem(item);
                              setInvForm({ name: item.name, description: item.description, fee: item.fee, cmritFee: item.cmritFee, quantity: item.quantity, available: item.available });
                              setInvDialogOpen(true);
                            }} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => {
                              handleDeleteInventory(item.id);
                            }} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                              <X size={14} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <Dialog open={invDialogOpen} onOpenChange={setInvDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit Equipment" : "Add New Equipment"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label>Equipment Name *</Label>
                    <Input placeholder="e.g. Arduino Kit" value={invForm.name} onChange={(e) => setInvForm({ ...invForm, name: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Brief description" value={invForm.description} onChange={(e) => setInvForm({ ...invForm, description: e.target.value })} className="mt-1" rows={2} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>External Fee (₹) *</Label>
                      <Input type="number" value={invForm.fee} onChange={(e) => setInvForm({ ...invForm, fee: Number(e.target.value) })} className="mt-1" />
                    </div>
                    <div>
                      <Label>CMRIT Fee (₹) *</Label>
                      <Input type="number" value={invForm.cmritFee} onChange={(e) => setInvForm({ ...invForm, cmritFee: Number(e.target.value) })} className="mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Total Quantity *</Label>
                      <Input type="number" value={invForm.quantity} onChange={(e) => setInvForm({ ...invForm, quantity: Number(e.target.value) })} className="mt-1" />
                    </div>
                    <div>
                      <Label>Available *</Label>
                      <Input type="number" value={invForm.available} onChange={(e) => setInvForm({ ...invForm, available: Number(e.target.value) })} className="mt-1" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setInvDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveInventory}>{editingItem ? "Save Changes" : "Add Equipment"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
