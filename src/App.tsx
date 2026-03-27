import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/layout/Layout";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import Followers from "./pages/Followers";
import Facebook from "./pages/Facebook";
import YouTube from "./pages/YouTube";
import Website from "./pages/Website";
import Comparison from "./pages/Comparison";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";
import VerifyOTP from "./pages/VerifyOTP";
import Profile from "./pages/Profile";
import Metrics from "./pages/Metrics";
import Teams from "./pages/Teams";
import Billing from "./pages/Billing";
import Onboarding from "./pages/Onboarding";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MetaCallback from "./pages/auth/MetaCallback";
import GoogleCallback from "./pages/auth/GoogleCallback";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { session, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !session) {
      setLocation("/login");
    }
  }, [session, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  return session ? <Component {...rest} /> : null;
}

function PublicRoute({ component: Component, ...rest }: any) {
  const { session, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && session) {
      setLocation("/dashboard");
    }
  }, [session, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  return !session ? <Component {...rest} /> : null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={() => <PublicRoute component={Login} />} />
      <Route path="/verify-otp" component={VerifyOTP} />
      <Route path="/auth/callback/meta" component={() => <ProtectedRoute component={MetaCallback} />} />
      <Route path="/auth/callback/google" component={() => <ProtectedRoute component={GoogleCallback} />} />
      
      {/* Protected Routes inside Layout */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/dashboard" component={() => <ProtectedRoute component={Home} />} />
            <Route path="/instagram" component={() => <ProtectedRoute component={Followers} />} />
            <Route path="/followers" component={() => <ProtectedRoute component={Followers} />} />
            <Route path="/facebook" component={() => <ProtectedRoute component={Facebook} />} />
            <Route path="/youtube" component={() => <ProtectedRoute component={YouTube} />} />
            <Route path="/website" component={() => <ProtectedRoute component={Website} />} />
            <Route path="/comparison" component={() => <ProtectedRoute component={Comparison} />} />
            <Route path="/insights" component={() => <ProtectedRoute component={Insights} />} />
            <Route path="/reports" component={() => <ProtectedRoute component={Reports} />} />
            <Route path="/metrics" component={() => <ProtectedRoute component={Metrics} />} />
            <Route path="/teams" component={() => <ProtectedRoute component={Teams} />} />
            <Route path="/billing" component={() => <ProtectedRoute component={Billing} />} />
            <Route path="/onboarding" component={() => <ProtectedRoute component={Onboarding} />} />
            <Route path="/settings" component={() => <ProtectedRoute component={Profile} />} />
            <Route path="/connections" component={() => <ProtectedRoute component={Profile} />} />
            <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" switchable={true}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

