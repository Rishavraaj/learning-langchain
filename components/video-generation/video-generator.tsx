"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export function VideoGenerator() {
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    audio?: string;
    image?: string;
  } | null>(null);

  const generateVideo = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/video-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ script }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate video");
      }

      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        AI Video Generator for YouTube Shorts
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Enter your video script:
          </label>
          <Textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Enter your script here..."
            className="w-full h-32"
          />
        </div>

        <Button
          onClick={generateVideo}
          disabled={loading || !script.trim()}
          className="w-full"
        >
          {loading ? "Generating..." : "Generate Video"}
        </Button>

        {result && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Preview</h3>
            {result.image && (
              <div>
                <h4 className="text-sm font-medium mb-2">Generated Image:</h4>
                <img
                  src={result.image}
                  alt="Generated scene"
                  className="w-full rounded-lg"
                />
              </div>
            )}
            {result.audio && (
              <div>
                <h4 className="text-sm font-medium mb-2">Generated Audio:</h4>
                <audio
                  controls
                  src={`data:audio/mp3;base64,${result.audio}`}
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
