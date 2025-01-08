import { NextRequest, NextResponse } from "next/server";
import { createCalendarAgent } from "@/app/utils/calendarAgent";
import { oauth2Client } from "@/app/utils/googleCalendar";

export async function POST(req: NextRequest) {
  try {
    // Get tokens from cookies
    const access_token = req.cookies.get("google_access_token")?.value;
    const refresh_token = req.cookies.get("google_refresh_token")?.value;

    // Check if we have valid credentials
    if (!access_token) {
      return NextResponse.json(
        { error: "Not authenticated", authUrl: "/api/auth/google" },
        { status: 401 }
      );
    }

    // Set credentials from cookies
    oauth2Client.setCredentials({
      access_token,
      refresh_token,
      token_type: "Bearer",
    });

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const agent = await createCalendarAgent();
    const result = await agent.invoke({ input: prompt });

    return NextResponse.json({ result: result.output });
  } catch (error: Error | unknown) {
    console.error("Calendar agent error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    // If token is expired or invalid, redirect to auth
    if (
      errorMessage.includes("invalid_grant") ||
      errorMessage.includes("Invalid Credentials")
    ) {
      return NextResponse.json(
        { error: "Authentication expired", authUrl: "/api/auth/google" },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
