import YouTubeAgent from "@/components/youtube/youtube-agent";
import { YouTubeHeader } from "@/components/youtube/youtube-header";

export default function YouTubePage() {
  return (
    <div className="min-h-screen bg-background">
      <YouTubeHeader />
      <main className="container mx-auto py-6 px-4">
        <YouTubeAgent />
      </main>
    </div>
  );
}
