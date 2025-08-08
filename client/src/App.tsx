import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Chat from "@/pages/chat";
import Education from "@/pages/education";
import Journal from "@/pages/journal";
import SRQ29 from "@/pages/srq29";
import Relaxation from "@/pages/relaxation";
import Achievements from "@/pages/achievements";
import Counselors from "@/pages/counselors";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/chat" component={Chat} />
      <Route path="/chat/:sessionId" component={Chat} />
      <Route path="/education" component={Education} />
      <Route path="/journal" component={Journal} />
      <Route path="/srq29" component={SRQ29} />
      <Route path="/relaxation" component={Relaxation} />
      <Route path="/achievements" component={Achievements} />
      <Route path="/counselors" component={Counselors} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
