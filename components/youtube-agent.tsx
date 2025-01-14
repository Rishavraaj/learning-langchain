"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface VideoResult {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: { url: string };
    };
  };
}

interface AgentResponse {
  response: string;
  scratchpad: string[];
}

export default function YouTubeAgent() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<VideoResult[]>([]);
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(
    null
  );

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          action: "search",
        }),
      });

      const data = await response.json();
      if (data.results) {
        setResults(data.results);
      }
    } catch (error) {
      console.error("Error searching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const askAgent = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          action: "agent",
        }),
      });

      const data = await response.json();
      if (data.response) {
        setAgentResponse({
          response: data.response,
          scratchpad: data.scratchpad || [],
        });
      }
    } catch (error) {
      console.error("Error asking agent:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter your YouTube query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Search"}
        </Button>
        <Button onClick={askAgent} disabled={loading} variant="secondary">
          Ask Agent
        </Button>
      </div>

      {agentResponse && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Agent Response:</h3>
            <p className="whitespace-pre-wrap mb-4">{agentResponse.response}</p>
            {agentResponse.scratchpad.length > 0 && (
              <>
                <h4 className="font-semibold mb-2">Agent Thoughts:</h4>
                <div className="bg-muted p-4 rounded-md">
                  {agentResponse.scratchpad.map((thought, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {thought}
                    </p>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((video) => (
            <Card key={video.id.videoId}>
              <CardContent className="pt-6">
                <div className="aspect-video mb-4">
                  <Image
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <h3 className="font-semibold mb-2">{video.snippet.title}</h3>
                <p className="text-sm text-gray-600">
                  {video.snippet.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
