import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import HomeKz from "@/pages/home-kz";
import NotFound from "@/pages/not-found";
import { LanguageProvider, useTranslation, Language } from "@/i18n";
import { useEffect } from "react";

function parsePath(path: string): { lang: Language | null; strategy: string | null } {
  const parts = path.replace(/^\//, "").split("/").filter(Boolean);
  if (parts[0] === "kz" || parts[0] === "ru") {
    return { lang: parts[0] as Language, strategy: parts[1] ?? null };
  }
  if (parts[0] === "basket-50" || parts[0] === "basket-70-tf") {
    return { lang: null, strategy: parts[0] };
  }
  return { lang: null, strategy: null };
}

function Router() {
  const { lang, setLang } = useTranslation();
  const [location, setLocation] = useLocation();

  // Sync lang from URL + redirect legacy URLs
  useEffect(() => {
    const { lang: pathLang, strategy } = parsePath(location);

    if (pathLang && pathLang !== lang) {
      setLang(pathLang);
    } else if (!pathLang && lang !== "ru") {
      setLang("ru");
    }

    if (!pathLang) {
      const targetLang = pathLang ?? "ru";
      const targetStrategy = strategy ?? "basket-50";
      setLocation(`/${targetLang}/${targetStrategy}`);
    }
  }, [location]);

  // Dynamic page title
  useEffect(() => {
    document.title = lang === "kz"
      ? "Алгоритмдік сауда стратегиясы | IQSF"
      : "Алгоритмическая торговая стратегия | IQSF";
  }, [lang]);

  const { lang: pathLang } = parsePath(location);
  const activeLang = pathLang ?? lang;
  const HomePage = activeLang === "kz" ? HomeKz : Home;

  return (
    <Switch>
      <Route path="/kz/:strategy" component={HomeKz} />
      <Route path="/ru/:strategy" component={Home} />
      <Route path="/kz" component={HomeKz} />
      <Route path="/ru" component={Home} />
      <Route path="/:strategy" component={HomePage} />
      <Route path="/" component={HomePage} />
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
      <LanguageProvider defaultLang="ru">
        <AppInner />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
