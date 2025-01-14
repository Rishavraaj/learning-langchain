import { NextResponse } from "next/server";
import { google } from "googleapis";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
  },
  scopes: ["https://www.googleapis.com/auth/youtube.force-ssl"],
  projectId: process.env.GOOGLE_PROJECT_ID,
});

const youtube = google.youtube({
  version: "v3",
  auth,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Fetch video details
    const videoResponse = await youtube.videos.list({
      part: ["statistics", "snippet"],
      id: [videoId],
    });

    const video = videoResponse.data.items?.[0];
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Fetch video comments
    const commentsResponse = await youtube.commentThreads.list({
      part: ["snippet"],
      videoId: videoId,
      maxResults: 100,
    });

    const comments =
      commentsResponse.data.items?.map(
        (item) => item.snippet?.topLevelComment?.snippet?.textDisplay
      ) || [];

    // Get transcript using YoutubeLoader
    let transcript = "";
    try {
      const loader = YoutubeLoader.createFromUrl(
        `https://youtu.be/${videoId}`,
        {
          language: "en",
          addVideoInfo: true,
        }
      );
      const docs = await loader.load();
      transcript =
        docs[0].pageContent ||
        video.snippet?.description ||
        "No content available";
    } catch (transcriptError) {
      console.error("Error fetching transcript:", transcriptError);
      // Fallback to video description if transcript fails
      transcript = video.snippet?.description || "No content available";
    }

    return NextResponse.json({
      transcript,
      comments,
      metrics: {
        likes: parseInt(video.statistics?.likeCount || "0"),
        views: parseInt(video.statistics?.viewCount || "0"),
        commentCount: parseInt(video.statistics?.commentCount || "0"),
      },
    });
  } catch (error) {
    console.error("Error fetching video data:", error);
    return NextResponse.json(
      { error: "Failed to fetch video data" },
      { status: 500 }
    );
  }
}
