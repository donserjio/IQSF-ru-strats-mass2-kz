import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import HomeKz from "@/pages/home-kz";
import NotFound from "@/pages/not-found";
import { LanguageProvider, useTranslation } from "@/i18n";

function Router() {
  const { lang } = useTranslation();
  const HomePage = lang === "kz" ? HomeKz : Home;
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/:strategy" component={HomePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppInner() {
  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppInner />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;