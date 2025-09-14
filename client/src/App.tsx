import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SnsHeader } from "@/components/sns-header";
import { ProgressIndicator } from "@/components/progress-indicator";
import { LanguageToggle } from "@/components/language-toggle";
import { useFormStore } from "@/hooks/use-form-store";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Step1 from "@/pages/step-1";
import Step2 from "@/pages/step-2";
import Step3 from "@/pages/step-3";
import Step4 from "@/pages/step-4";
import Success from "@/pages/success";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/step-1" component={Step1} />
      <Route path="/step-2" component={Step2} />
      <Route path="/step-3" component={Step3} />
      <Route path="/step-4" component={Step4} />
      <Route path="/success" component={Success} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppHeader() {
  const { currentStep } = useFormStore();
  const showProgress = currentStep >= 0;

  return (
    <div className="bg-white border-b border-border py-4 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <SnsHeader />
          {showProgress && <ProgressIndicator />}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <LanguageToggle />
          <AppHeader />
          <main>
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
