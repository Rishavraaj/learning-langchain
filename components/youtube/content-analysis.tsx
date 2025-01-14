import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContentAnalysisResults } from "./content-analysis-results";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoData {
  transcript: string;
  comments: string[];
  metrics: {
    likes: number;
    views: number;
    commentCount: number;
  };
}

export function ContentAnalysis({ videoData }: { videoData: VideoData }) {
  const [analysisResults, setAnalysisResults] = useState<{
    transcript?: string;
    sentiment?: string;
    trends?: string;
  }>({});
  const [loading, setLoading] = useState<string | null>(null);

  const analyzeContent = async (
    type: "transcript" | "sentiment" | "trends"
  ) => {
    setLoading(type);
    try {
      const response = await fetch("/api/content-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          data: {
            transcript:
              type === "transcript" ? videoData.transcript : undefined,
            comments: type === "sentiment" ? videoData.comments : undefined,
            metrics: type === "sentiment" ? videoData.metrics : undefined,
            videoData: type === "trends" ? videoData : undefined,
          },
        }),
      });

      const result = await response.json();
      setAnalysisResults((prev) => ({
        ...prev,
        [type]: result.analysis,
      }));
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="transcript" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transcript">Content Analysis</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="transcript">
          <div className="space-y-4">
            <Button
              onClick={() => analyzeContent("transcript")}
              disabled={loading === "transcript"}
            >
              {loading === "transcript" ? "Analyzing..." : "Analyze Content"}
            </Button>
            {analysisResults.transcript && (
              <ContentAnalysisResults
                type="transcript"
                analysis={analysisResults.transcript}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="sentiment">
          <div className="space-y-4">
            <Button
              onClick={() => analyzeContent("sentiment")}
              disabled={loading === "sentiment"}
            >
              {loading === "sentiment" ? "Analyzing..." : "Analyze Sentiment"}
            </Button>
            {analysisResults.sentiment && (
              <ContentAnalysisResults
                type="sentiment"
                analysis={analysisResults.sentiment}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="space-y-4">
            <Button
              onClick={() => analyzeContent("trends")}
              disabled={loading === "trends"}
            >
              {loading === "trends" ? "Analyzing..." : "Analyze Trends"}
            </Button>
            {analysisResults.trends && (
              <ContentAnalysisResults
                type="trends"
                analysis={analysisResults.trends}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
