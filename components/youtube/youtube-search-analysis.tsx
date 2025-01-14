"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

export function YouTubeSearchAnalysis() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/youtube/search?query=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeVideo = (videoId: string) => {
    router.push(`/youtube/${videoId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Search YouTube videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {searchResults.map((result) => (
          <Card key={result.id.videoId} className="p-4">
            <div className="flex gap-4">
              <Image
                src={result.snippet.thumbnails.default.url}
                alt={result.snippet.title}
                width={120}
                height={90}
                className="rounded"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold">{result.snippet.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {result.snippet.description}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => analyzeVideo(result.id.videoId)}
                >
                  Analyze Video
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
