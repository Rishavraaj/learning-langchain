"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Wand2 } from "lucide-react";
import { YouTubeSearchResults } from "./youtube-search-results";
import { YouTubeAgentResponse } from "./youtube-agent-response";
import { AgentResponse, VideoResult } from "@/types/youtube";
import { toast } from "sonner";

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
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.results) {
        setResults(data.results);
        setAgentResponse(null);
      }
    } catch (error) {
      toast.error("Search Error", {
        description:
          error instanceof Error ? error.message : "Failed to search videos",
      });
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
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.response) {
        setAgentResponse({
          response: data.response,
          scratchpad: data.scratchpad || [],
        });
        setResults([]);
      }
    } catch (error) {
      toast.error("Agent Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to get agent response",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search videos or ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          disabled={loading}
        />
        <Button onClick={handleSearch} disabled={loading} variant="secondary">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
        <Button onClick={askAgent} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Ask Agent
            </>
          )}
        </Button>
      </div>

      {agentResponse && <YouTubeAgentResponse response={agentResponse} />}
      <YouTubeSearchResults results={results} />
    </div>
  );
}
