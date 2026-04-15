// Force redeploy with env vars
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, Router } from "wouter";
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
import Planning from "./pages/Planning";
import AcceptInvite from "./pages/AcceptInvite";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MetaCallback from "./pages/auth/MetaCallback";
import GoogleCallback from "./pages/auth/GoogleCallback";
import { useEffect } from "react";
import { Loader2, Activity } from "lucide-react";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Activity className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Acesso Restrito</h2>
          <p className="text-muted-foreground font-medium leading-relaxed">
            Detectamos que você não está autenticado no sistema principal. <br />
            Por favor, realize o login para acessar o Analytics.
          </p>
          <a 
            href="../" 
            className="inline-flex items-center justify-center px-8 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg"
          >
            Voltar para o Início
          </a>
        </div>
      </div>
    );
  }

  return <Component {...rest} />;
}

function PublicRoute({ component: Component, ...rest }: any) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const isAuthorized = !!user;

  useEffect(() => {
    if (!loading && isAuthorized) {
      setLocation("/dashboard");
    }
  }, [isAuthorized, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return !isAuthorized ? <Component {...rest} /> : null;
}

function AppRouter() {
  // Detect base path: if URL contains /analise/, we use /analise as base
  const pathSegments = window.location.pathname.split('/');
  const isAnaliseSubfolder = pathSegments.includes('analise');
  const base = isAnaliseSubfolder ? '/analise' : '';

  return (
    <Router base={base}>
      <Switch>
        {/* Tecnical routes */}
        <Route path="/verify-otp" component={VerifyOTP} />
        <Route path="/invite/:id" component={AcceptInvite} />
        <Route path="/auth/callback/meta" component={() => <ProtectedRoute component={MetaCallback} />} />
        <Route path="/auth/callback/google" component={() => <ProtectedRoute component={GoogleCallback} />} />
        
        {/* All routes go to Dashboard (root) */}
        <Route>
          <Layout>
            <Switch>
              <Route path="/" component={() => <ProtectedRoute component={Home} />} />
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
              <Route path="/planning" component={() => <ProtectedRoute component={Planning} />} />
              <Route path="/teams" component={() => <ProtectedRoute component={Teams} />} />
              <Route path="/billing" component={() => <ProtectedRoute component={Billing} />} />
              <Route path="/onboarding" component={() => <ProtectedRoute component={Onboarding} />} />
              <Route path="/settings" component={() => <ProtectedRoute component={Profile} />} />
              <Route path="/connections" component={() => <ProtectedRoute component={Profile} />} />
              <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
              <Route path="/404" component={NotFound} />
              <Route component={() => <ProtectedRoute component={Home} />} />
            </Switch>
          </Layout>
        </Route>
      </Switch>
    </Router>
  );
}

import { BrandingProvider } from "./contexts/BrandingContext";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrandingProvider>
          <ThemeProvider defaultTheme="dark" switchable={true}>
            <TooltipProvider>
              <Toaster />
              <AppRouter />
            </TooltipProvider>
          </ThemeProvider>
        </BrandingProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

