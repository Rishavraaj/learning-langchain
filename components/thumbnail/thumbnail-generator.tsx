"use client";

import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";

export function ThumbnailGenerator() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    image?: string;
    prompt?: string;
  } | null>(null);

  const generateThumbnail = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/thumbnail-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate thumbnail");
      }

      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate thumbnail. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">YouTube Thumbnail Generator</h2>

        {/* Input Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter your video title:
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your video title..."
              className="w-full"
            />
          </div>

          <Button
            onClick={generateThumbnail}
            disabled={loading || !title.trim()}
            className="w-full"
          >
            {loading ? "Generating..." : "Generate Thumbnail"}
          </Button>
        </div>

        {/* Preview Section */}
        {result && (
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">
                Generated Thumbnail
              </h3>

              {/* Thumbnail Preview */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={result.image || ""}
                  alt="Generated thumbnail"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Download Button */}
              <Button
                onClick={() => {
                  if (result.image) {
                    const a = document.createElement("a");
                    a.href = result.image;
                    a.download = "youtube-thumbnail.png";
                    a.click();
                  }
                }}
                className="mt-4"
                variant="outline"
              >
                Download Thumbnail
              </Button>
            </div>

            {/* Prompt Preview */}
            {result.prompt && (
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium mb-2">Generation Prompt:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {result.prompt}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Preview of YouTube Layout */}
      {result && (
        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold mb-4">YouTube Preview</h3>
          <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
            {/* Thumbnail Preview in YouTube Style */}
            <div className="relative aspect-video w-full">
              <Image
                src={result.image || ""}
                alt="YouTube preview"
                fill
                className="object-cover"
              />
            </div>
            {/* Video Title */}
            <div className="p-4">
              <h4 className="font-medium text-base line-clamp-2">{title}</h4>
              <p className="text-sm text-gray-500 mt-1">Your Channel</p>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <span>0 views</span>
                <span className="mx-1">•</span>
                <span>Just now</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
