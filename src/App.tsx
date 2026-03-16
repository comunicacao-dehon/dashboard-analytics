import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/layout/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import Followers from "./pages/Followers";
import Facebook from "./pages/Facebook";
import YouTube from "./pages/YouTube";
import Comparison from "./pages/Comparison";
import Insights from "./pages/Insights";
import Settings from "./pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route>
        <Layout>
          <Switch>
            <Route path={"/dashboard"} component={Home} />
            <Route path={"/instagram"} component={Followers} />
            <Route path={"/followers"} component={Followers} />
            <Route path={"/facebook"} component={Facebook} />
            <Route path={"/youtube"} component={YouTube} />
            <Route path={"/comparison"} component={Comparison} />
            <Route path={"/insights"} component={Insights} />
            <Route path={"/reports"} component={Reports} />
            <Route path={"/settings"} component={Settings} />
            <Route path={"/404"} component={NotFound} />
            {/* Final fallback route */}
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
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
