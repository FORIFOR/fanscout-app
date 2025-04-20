import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { ModalProvider } from "@/context/ModalContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
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
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      {user && <TabNavigation />}
      <main className="flex-grow">
        <Switch>
          <ProtectedRoute path="/" component={Matches} />
          <ProtectedRoute path="/reports" component={Reports} />
          <ProtectedRoute path="/clubs" component={Clubs} />
          <ProtectedRoute path="/rewards" component={Rewards} />
          <Route path="/auth" component={AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <MatchDetailModal />
      <Footer />
    </div>
  );
}

// A separate component for notifications that uses the authenticated user
function AuthenticatedApp() {
  const { user } = useAuth();
  
  return (
    <NotificationProvider userId={user?.id || null}>
      <ModalProvider>
        <Toaster />
        <AppLayout />
      </ModalProvider>
    </NotificationProvider>
  );
}

// Put all the providers in the main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <TooltipProvider>
          <AuthProvider>
            <AuthenticatedApp />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
