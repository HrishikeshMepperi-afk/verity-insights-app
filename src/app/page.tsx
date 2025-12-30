
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { getAnalysis, type FormState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { AnalysisResultDisplay } from "@/components/analysis-result-display";
import { Bot, Feather, Loader2, Search } from "lucide-react";

const initialState: FormState = {
  message: "",
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Search className="mr-2 h-5 w-5" />
          Analyze Content
        </>
      )}
    </Button>
  );
}

function AnalysisSection({ state }: { state: FormState }) {
  const { pending } = useFormStatus();

  if (pending) {
    return <LoadingSkeleton />;
  }
  
  if (state.data) {
    return <AnalysisResultDisplay data={state.data} />;
  }

  return (
    <div className="text-center text-muted-foreground py-16">
      <Bot size={48} className="mx-auto mb-4" />
      <h3 className="text-lg font-semibold">Ready for Analysis</h3>
      <p>Your analysis results will appear here.</p>
    </div>
  );
}


export default function Home() {
  const [state, formAction] = useFormState(getAnalysis, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleFormReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    formRef.current?.reset();
    // This is a way to reset the useFormState
    formAction(new FormData());
  }

  return (
    <main className="min-h-screen container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-2">
          <Feather className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
            Verity Insights
          </h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Uncover the truth. Paste text or a URL below to analyze content for
          potential misinformation with AI-powered insights.
        </p>
      </header>

      <div className="max-w-3xl mx-auto">
        <form ref={formRef} action={formAction}>
          <Card>
            <CardContent className="p-6">
              <div className="grid w-full gap-4">
                <Label htmlFor="content" className="text-lg font-medium">
                  Content to Analyze
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Paste an article, text, or a URL here..."
                  className="min-h-[150px] text-base"
                  required
                />
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <SubmitButton />
                   {(state.data || state.error) && (
                    <Button variant="outline" onClick={handleFormReset}>
                      Start New Analysis
                    </Button>
                  )}
                </div>
                {state.error && <p className="text-sm text-destructive">{state.error}</p>}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-12">
            <AnalysisSection state={state} />
          </div>
        </form>
      </div>
      <footer className="text-center mt-16 text-sm text-muted-foreground">
        <p>Powered by Firebase and Google AI. For informational purposes only.</p>
      </footer>
    </main>
  );
}
