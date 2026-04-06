// Lightweight localStorage-based store for tickets and student accounts

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  equipment: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface CampusEvent {
  id: string;
  date: string;
  title: string;
  desc: string;
  time: string;
  venue: string;
  image?: string;
}

const TICKETS_KEY = "cmrit_tickets";
const STUDENTS_KEY = "cmrit_students";
const STUDENT_SESSION_KEY = "cmrit_student_session";
const NOTIFICATIONS_KEY = "cmrit_notifications";
const EVENTS_KEY = "cmrit_events";

export interface Notification {
  id: string;
  userId: string;
  message: string;
  ticketId: string;
  read: boolean;
  createdAt: string;
}

// Default events (seeded if none exist)
const DEFAULT_EVENTS: CampusEvent[] = [
  { id: "1", date: "Aug 18 2026", title: "ICNI Conference 2026", desc: "Networking + poster sessions", time: "09:00 AM - 06:00 PM", venue: "Main Auditorium" },
  { id: "2", date: "Sep 5 2026", title: "Hackathon: Build the Future", desc: "24-hour maker challenge", time: "10:00 AM - 10:00 AM", venue: "Makerspace Lab" },
  { id: "3", date: "Oct 12 2026", title: "IoT Workshop Series", desc: "Hands-on with sensors & microcontrollers", time: "02:00 PM - 05:00 PM", venue: "Electronics Lab" },
];

// Events
export function getEvents(): CampusEvent[] {
  const stored = localStorage.getItem(EVENTS_KEY);
  if (!stored) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(DEFAULT_EVENTS));
    return DEFAULT_EVENTS;
  }
  return JSON.parse(stored);
}

export function saveEvents(events: CampusEvent[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function addEvent(event: Omit<CampusEvent, "id">): CampusEvent {
  const events = getEvents();
  const newEvent: CampusEvent = { ...event, id: crypto.randomUUID() };
  events.push(newEvent);
  saveEvents(events);
  return newEvent;
}

export function updateEvent(id: string, data: Omit<CampusEvent, "id">) {
  const events = getEvents();
  const idx = events.findIndex((e) => e.id === id);
  if (idx !== -1) {
    events[idx] = { ...data, id };
    saveEvents(events);
  }
}

export function deleteEvent(id: string) {
  const events = getEvents().filter((e) => e.id !== id);
  saveEvents(events);
}

// Students
export function getStudents(): StudentUser[] {
  return JSON.parse(localStorage.getItem(STUDENTS_KEY) || "[]");
}

export function registerStudent(name: string, email: string, password: string): StudentUser | null {
  const students = getStudents();
  if (students.find((s) => s.email === email)) return null;
  const student: StudentUser = { id: crypto.randomUUID(), name, email, password };
  students.push(student);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  return student;
}

export function loginStudent(email: string, password: string): StudentUser | null {
  const student = getStudents().find((s) => s.email === email && s.password === password);
  if (student) {
    sessionStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(student));
  }
  return student || null;
}

export function getLoggedInStudent(): StudentUser | null {
  const data = sessionStorage.getItem(STUDENT_SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function logoutStudent() {
  sessionStorage.removeItem(STUDENT_SESSION_KEY);
}

// Tickets
export function getTickets(): Ticket[] {
  return JSON.parse(localStorage.getItem(TICKETS_KEY) || "[]");
}

export function getTicketsByUser(userId: string): Ticket[] {
  return getTickets().filter((t) => t.userId === userId);
}

export function createTicket(data: Omit<Ticket, "id" | "status" | "createdAt" | "updatedAt">): Ticket {
  const tickets = getTickets();
  const ticket: Ticket = {
    ...data,
    id: crypto.randomUUID(),
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tickets.push(ticket);
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  addNotification("admin", `New ticket: "${ticket.title}" from ${ticket.userName}`, ticket.id);
  return ticket;
}

export function updateTicketStatus(ticketId: string, status: Ticket["status"], assignedTo?: string) {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return;
  tickets[idx].status = status;
  tickets[idx].updatedAt = new Date().toISOString();
  if (assignedTo !== undefined) tickets[idx].assignedTo = assignedTo;
  localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  if (status === "resolved") {
    addNotification(tickets[idx].userId, `Your ticket "${tickets[idx].title}" has been resolved!`, ticketId);
  }
}

// Notifications
export function getNotifications(userId: string): Notification[] {
  const all: Notification[] = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
  return all.filter((n) => n.userId === userId);
}

export function addNotification(userId: string, message: string, ticketId: string) {
  const all: Notification[] = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
  all.push({ id: crypto.randomUUID(), userId, message, ticketId, read: false, createdAt: new Date().toISOString() });
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
}

export function markNotificationsRead(userId: string) {
  const all: Notification[] = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]");
  all.forEach((n) => { if (n.userId === userId) n.read = true; });
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(all));
}

export const EQUIPMENT_LIST = [
  "3D Printer - Creality Ender 3",
  "3D Printer - Prusa i3",
  "Laser Cutter",
  "CNC Machine",
  "Soldering Station",
  "Oscilloscope",
  "PCB Milling Machine",
  "Resin Printer",
  "Heat Press",
  "Vinyl Cutter",
  "General Facility",
];

// Hardware Inventory
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  fee: number;
  cmritFee: number;
  quantity: number;
  available: number;
  image?: string;
}

const INVENTORY_KEY = "cmrit_inventory";

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: "1", name: "Creality Ender 3 - 3D Printer", description: "FDM 3D printer for PLA/ABS prototyping", fee: 150, cmritFee: 50, quantity: 3, available: 3 },
  { id: "2", name: "Prusa i3 MK3S+", description: "High-precision FDM 3D printer", fee: 200, cmritFee: 75, quantity: 2, available: 2 },
  { id: "3", name: "Laser Cutter - 60W CO2", description: "For cutting wood, acrylic, and engraving", fee: 250, cmritFee: 100, quantity: 1, available: 1 },
  { id: "4", name: "CNC Milling Machine", description: "3-axis CNC for precision machining", fee: 300, cmritFee: 120, quantity: 1, available: 1 },
  { id: "5", name: "Soldering Station", description: "Temperature-controlled soldering for PCB work", fee: 50, cmritFee: 20, quantity: 5, available: 5 },
  { id: "6", name: "Digital Oscilloscope", description: "4-channel oscilloscope for signal analysis", fee: 100, cmritFee: 40, quantity: 3, available: 3 },
  { id: "7", name: "Resin 3D Printer", description: "High-detail SLA printer for fine prototypes", fee: 200, cmritFee: 80, quantity: 2, available: 2 },
  { id: "8", name: "Arduino Starter Kit", description: "Microcontroller kit with sensors & modules", fee: 30, cmritFee: 10, quantity: 10, available: 10 },
];

export function getInventory(): InventoryItem[] {
  const stored = localStorage.getItem(INVENTORY_KEY);
  if (!stored) {
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(DEFAULT_INVENTORY));
    return DEFAULT_INVENTORY;
  }
  return JSON.parse(stored);
}

export function saveInventory(items: InventoryItem[]) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
}

export function addInventoryItem(item: Omit<InventoryItem, "id">): InventoryItem {
  const items = getInventory();
  const newItem: InventoryItem = { ...item, id: crypto.randomUUID() };
  items.push(newItem);
  saveInventory(items);
  return newItem;
}

export function updateInventoryItem(id: string, data: Omit<InventoryItem, "id">) {
  const items = getInventory();
  const idx = items.findIndex((i) => i.id === id);
  if (idx !== -1) {
    items[idx] = { ...data, id };
    saveInventory(items);
  }
}

export function deleteInventoryItem(id: string) {
  const items = getInventory().filter((i) => i.id !== id);
  saveInventory(items);
}

export function bookEquipment(itemId: string): boolean {
  const items = getInventory();
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx === -1 || items[idx].available <= 0) return false;
  items[idx].available -= 1;
  saveInventory(items);
  return true;
}
