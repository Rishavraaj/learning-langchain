import { NextResponse } from "next/server";
import { oauth2Client } from "@/app/utils/googleCalendar";

export async function GET() {
  const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  return NextResponse.redirect(authUrl);
}
