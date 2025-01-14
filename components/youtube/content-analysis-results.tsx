import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentAnalysisResultsProps {
  type: "transcript" | "sentiment" | "trends";
  analysis: string;
}

export function ContentAnalysisResults({
  type,
  analysis,
}: ContentAnalysisResultsProps) {
  const titles = {
    transcript: "Content Analysis",
    sentiment: "Sentiment Analysis",
    trends: "Trend Analysis",
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{titles[type]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap">{analysis}</div>
      </CardContent>
    </Card>
  );
}
