import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
  throw new Error("Missing required Google API credentials");
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Get video details
    const { data } = await youtube.videos.list({
      part: ["snippet", "contentDetails"],
      id: [videoId],
    });

    if (!data.items?.length) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // For now, return a message that downloading is not yet implemented
    return NextResponse.json(
      {
        error:
          "Direct video download is not available. Please use youtube-dl or similar tools.",
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error processing video:", error);
    return NextResponse.json(
      { error: "Failed to process video" },
      { status: 500 }
    );
  }
}
