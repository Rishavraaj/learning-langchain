import { YouTubeSearchAnalysis } from "@/components/youtube/youtube-search-analysis";

export default function YouTubePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">YouTube Video Analysis</h1>
      <YouTubeSearchAnalysis />
    </div>
  );
}
