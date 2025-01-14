"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoResult } from "@/types/youtube";
import { ExternalLink } from "lucide-react";

interface YouTubeSearchResultsProps {
  results: VideoResult[];
}

export function YouTubeSearchResults({ results }: YouTubeSearchResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {results.map((video) => (
        <Card key={video.id.videoId} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video">
              <img
                src={video.snippet.thumbnails.high.url}
                alt={video.snippet.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-2">
                {video.snippet.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {video.snippet.description}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
