import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import Pets from "./pages/Pets";
import Owners from "./pages/Owners";
import CheckIn from "./pages/CheckIn";
import CheckOut from "./pages/CheckOut";
import Packages from "./pages/Packages";
import Employees from "./pages/Employees";
import Financial from "./pages/Financial";
import Settings from "./pages/Settings";
import Department from "./pages/Department";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/agendamentos" element={<Appointments />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/tutores" element={<Owners />} />
            <Route path="/check-in" element={<CheckIn />} />
            <Route path="/check-out" element={<CheckOut />} />
            <Route path="/pacotes" element={<Packages />} />
            <Route path="/colaboradores" element={<Employees />} />
            <Route path="/financeiro" element={<Financial />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/departamento/:id" element={<Department />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
