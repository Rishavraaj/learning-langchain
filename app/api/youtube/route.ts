import { NextRequest, NextResponse } from "next/server";
import {
  createYouTubeAgent,
  searchYouTubeVideos,
} from "@/app/utils/youtubeAgent";

export async function POST(req: NextRequest) {
  try {
    const { query, action } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    switch (action) {
      case "search":
        const searchResults = await searchYouTubeVideos(query);
        return NextResponse.json({ results: searchResults });

      case "details":
        if (!query.match(/^[a-zA-Z0-9_-]{11}$/)) {
          return NextResponse.json(
            { error: "Invalid video ID" },
            { status: 400 }
          );
        }

      case "agent":
        const result = await createYouTubeAgent(query);
        return NextResponse.json({
          response: result.response,
          scratchpad: result.scratchpad,
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
