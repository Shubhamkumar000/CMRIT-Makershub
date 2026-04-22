import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Book3DPrinting from "./pages/Book3DPrinting.tsx";
import BookLaserPrinting from "./pages/BookLaserPrinting.tsx";
import BookMakerSpace from "./pages/BookMakerSpace.tsx";
import Hardware from "./pages/Hardware.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import StudentLogin from "./pages/StudentLogin.tsx";
import StudentDashboard from "./pages/StudentDashboard.tsx";
import ReportIssue from "./pages/ReportIssue.tsx";
import StartupApplication from "./pages/StartupApplication.tsx";
import IdeaApplication from "./pages/IdeaApplication.tsx";
import StudentStartups from "./pages/StudentStartups.tsx";
import FacultyStartups from "./pages/FacultyStartups.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/book/3d-printing" element={<Book3DPrinting />} />
          <Route path="/book/laser-printing" element={<BookLaserPrinting />} />
          <Route path="/book/makerspace" element={<BookMakerSpace />} />
          <Route path="/hardware" element={<Hardware />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/report" element={<ReportIssue />} />
          <Route path="/apply/startup" element={<StartupApplication />} />
          <Route path="/apply/idea" element={<IdeaApplication />} />
          <Route path="/startups/student" element={<StudentStartups />} />
          <Route path="/startups/faculty" element={<FacultyStartups />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
