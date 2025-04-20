import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { ModalProvider } from "@/context/ModalContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabNavigation from "@/components/TabNavigation";
import Matches from "@/pages/Matches";
import Reports from "@/pages/Reports";
import Clubs from "@/pages/Clubs";
import Rewards from "@/pages/Rewards";
import AuthPage from "@/pages/auth-page";
import MatchDetailModal from "@/components/MatchDetailModal";

// Create a layout component to wrap the app content
function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <TabNavigation />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Matches} />
          <Route path="/reports" component={Reports} />
          <Route path="/clubs" component={Clubs} />
          <Route path="/rewards" component={Rewards} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <MatchDetailModal />
      <Footer />
    </div>
  );
}

// Put all the providers in the main App component
function App() {
  // For demonstration purposes, use a fixed user ID
  // In a real app, this would come from authentication
  const currentUserId = 1;
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <ModalProvider>
            <NotificationProvider userId={currentUserId}>
              <Toaster />
              <AppLayout />
            </NotificationProvider>
          </ModalProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
