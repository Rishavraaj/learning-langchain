"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ContentAnalysis } from "@/components/youtube/content-analysis";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoData {
  transcript: string;
  comments: string[];
  metrics: {
    likes: number;
    views: number;
    commentCount: number;
  };
}

export default function VideoAnalysisPage() {
  const params = useParams();
  const videoId = params.videoId as string;
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await fetch(
          `/api/youtube/video-data?videoId=${videoId}`
        );
        const data = await response.json();
        setVideoData(data);
      } catch (error) {
        console.error("Failed to fetch video data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-red-500">
          Failed to load video data
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Video Analysis</h1>

      {/* Raw Data Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[75vh] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">
              {videoData.transcript}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments & Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Metrics</h3>
              <ul className="list-disc list-inside">
                <li>Likes: {videoData.metrics.likes.toLocaleString()}</li>
                <li>Views: {videoData.metrics.views.toLocaleString()}</li>
                <li>
                  Comments: {videoData.metrics.commentCount.toLocaleString()}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recent Comments</h3>
              <div className="max-h-[70vh] overflow-y-auto space-y-2">
                {videoData.comments.map((comment, index) => (
                  <p key={index} className="text-sm border-b pb-2">
                    {comment}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Section */}
      <ContentAnalysis videoData={videoData} />
    </div>
  );
}
