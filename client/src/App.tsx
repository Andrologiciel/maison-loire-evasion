/** Direction « Carnet de terroir » : routes simples et lisibles pour un séjour sans friction. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Around from "@/pages/Around";
import Chateaux from "@/pages/Chateaux";
import Home from "@/pages/Home";
import Maison from "@/pages/Maison";
import Outdoors from "@/pages/Outdoors";
import Leisure from "@/pages/Leisure";
import Stays from "@/pages/Stays";
import Useful from "@/pages/Useful";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/maison" component={Maison} />
      <Route path="/chateaux" component={Chateaux} />
      <Route path="/autour-de-nous" component={Around} />
      <Route path="/balades" component={Outdoors} />
      <Route path="/commerces-utiles" component={Useful} />
      <Route path="/idees-de-sejour" component={Stays} />
      <Route path="/loisirs" component={Leisure} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
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
