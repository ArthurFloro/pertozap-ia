import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WalletProvider } from "./contexts/WalletContext";
import Home from "./pages/Home";
import Negocios from "./pages/Negocios";
import NegocioDetalhe from "./pages/NegocioDetalhe";
import Cadastro from "./pages/Cadastro";
import Carteira from "./pages/Carteira";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/negocios" component={Negocios} />
      <Route path="/negocios/:id" component={NegocioDetalhe} />
      <Route path="/cadastro" component={Cadastro} />
      <Route path="/carteira" component={Carteira} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <WalletProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </WalletProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
