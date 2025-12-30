"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShieldAlert, ShieldCheck, ShieldQuestion, ThumbsUp, ThumbsDown, BookOpenCheck, BarChart4, MessageSquareWarning } from "lucide-react";
import type { AnalyzeContentOutput } from "@/ai/flows/analyze-content-for-misinformation";

type AnalysisResultDisplayProps = {
  data: AnalyzeContentOutput;
};

const getVerdictBadge = (isMisinfo: boolean) => {
  return isMisinfo ? (
    <Badge variant="destructive" className="text-sm">
      <MessageSquareWarning className="mr-2 h-4 w-4" />
      Potential Misinformation
    </Badge>
  ) : (
    <Badge className="bg-green-600 hover:bg-green-600/90 text-sm text-white">
      <ShieldCheck className="mr-2 h-4 w-4" />
      Likely Credible
    </Badge>
  );
};

const getCredibilityIcon = (score: number) => {
  if (score > 70) return <ShieldCheck className="h-6 w-6 text-green-600" />;
  if (score > 40) return <ShieldQuestion className="h-6 w-6 text-yellow-500" />;
  return <ShieldAlert className="h-6 w-6 text-destructive" />;
};

function UserFeedback() {
  const [feedback, setFeedback] = useState<'helpful' | 'unhelpful' | null>(null);

  if (feedback) {
    return (
      <div className="text-center text-muted-foreground p-4">
        <p>Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <span className="text-sm text-muted-foreground">Was this analysis helpful?</span>
      <Button variant="outline" size="icon" onClick={() => setFeedback('helpful')} aria-label="Helpful">
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => setFeedback('unhelpful')} aria-label="Not helpful">
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function AnalysisResultDisplay({ data }: AnalysisResultDisplayProps) {
  const confidencePercent = Math.round(data.confidenceScore * 100);
  const credibilityPercent = data.sourceCredibilityScore;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <Card className="bg-card/80 border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Overall Verdict</CardTitle>
          <CardDescription>
            Our AI's assessment of the provided content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {getVerdictBadge(data.isMisinformation)}
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Confidence Score</CardTitle>
            <BarChart4 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{confidencePercent}%</p>
            <Progress value={confidencePercent} className="mt-2" />
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">Our AI's confidence in its verdict.</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Source Credibility</CardTitle>
            {getCredibilityIcon(credibilityPercent)}
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{credibilityPercent}/100</p>
            <Progress value={credibilityPercent} className="mt-2" />
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">Estimated reliability of the original source.</p>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenCheck className="h-6 w-6 text-primary" />
            Supporting Evidence & Rationale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap font-sans">
            {data.supportingEvidence || "No specific supporting evidence was found or provided by the analysis."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <UserFeedback />
        </CardContent>
      </Card>
    </div>
  );
}
