import { NextResponse } from "next/server";
import { google } from "googleapis";

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
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const response = await youtube.search.list({
      part: ["snippet"],
      q: query,
      maxResults: 10,
      type: ["video"],
    });

    return NextResponse.json({
      items: response.data.items,
    });
  } catch (error) {
    console.error("YouTube search error:", error);
    return NextResponse.json(
      { error: "Failed to search YouTube" },
      { status: 500 }
    );
  }
}
