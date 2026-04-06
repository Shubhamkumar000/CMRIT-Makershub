import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, Plus, Bell, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ticketsAPI, notificationsAPI } from "@/lib/api";

type Ticket = {
  id: string;
  title: string;
  equipment: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
};

const statusConfig = {
  open: { label: "Open", icon: AlertCircle, color: "bg-yellow-500/15 text-yellow-700 border-yellow-300" },
  "in-progress": { label: "In Progress", icon: Clock, color: "bg-blue-500/15 text-blue-700 border-blue-300" },
  resolved: { label: "Resolved", icon: CheckCircle2, color: "bg-green-500/15 text-green-700 border-green-300" },
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/student/login");
      return;
    }

    const refresh = async () => {
      try {
        const [ticketsRes, unreadRes] = await Promise.all([
          ticketsAPI.getMyTickets(),
          notificationsAPI.getUnreadCount()
        ]);

        const normalizedTickets: Ticket[] = (ticketsRes.tickets || []).map((t: any) => ({
          id: t._id || t.id,
          title: t.title,
          equipment: t.equipment,
          description: t.description,
          status: t.status,
          createdAt: t.createdAt
        }));

        setTickets(normalizedTickets);
        setUnread(unreadRes.unreadCount || 0);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, [isLoading, user, navigate]);

  if (isLoading || !user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMarkRead = async () => {
    try {
      await notificationsAPI.markRead();
      setUnread(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="hover:opacity-80"><ArrowLeft size={22} /></button>
            <h1 className="text-xl font-bold">My Tickets</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleMarkRead} className="relative hover:opacity-80">
              <Bell size={20} />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unread}</span>
              )}
            </button>
            <Button size="sm" variant="outline" onClick={() => navigate("/student/report")} className="bg-black/20 text-white border-white/45 hover:bg-black/35 hover:text-white gap-1.5 shadow-sm">
              <Plus size={16} /> Report Issue
            </Button>
            <Button size="sm" variant="outline" onClick={handleLogout} className="bg-black/20 text-white border-white/45 hover:bg-black/35 hover:text-white gap-1.5 shadow-sm">
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-muted-foreground mb-6">Welcome, <span className="font-semibold text-foreground">{user.name}</span>. You have {tickets.length} ticket(s).</p>

        {tickets.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <AlertCircle size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No tickets yet</p>
            <p className="text-sm mb-4">Report an issue to get started.</p>
            <Button onClick={() => navigate("/student/report")} className="gap-2"><Plus size={16} /> Report Issue</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((t) => {
              const cfg = statusConfig[t.status];
              const Icon = cfg.icon;
              return (
                <Card key={t.id} className="border-border">
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{t.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{t.equipment}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(t.createdAt).toLocaleDateString()} · {new Date(t.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge className={`${cfg.color} border gap-1 shrink-0`}>
                      <Icon size={12} /> {cfg.label}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
