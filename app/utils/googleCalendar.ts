import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { calendar_v3 } from "googleapis";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Configure Day.js plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Get system timezone
const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// These will come from your Google Cloud Console
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
    : "http://localhost:3000/api/auth/callback";

export const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

export const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export async function listEvents(timeMin: Date = new Date()) {
  const startTime = dayjs(timeMin).tz(systemTimezone);

  try {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: startTime.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching events:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    throw error;
  }
}

export async function createEvent(
  summary: string,
  description: string,
  startTime: Date,
  endTime: Date,
  attendees?: string[]
) {
  const start = dayjs(startTime).tz(systemTimezone);
  const end = dayjs(endTime).tz(systemTimezone);

  try {
    // Verify OAuth client has credentials
    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
      throw new Error("No OAuth credentials available");
    }

    const event = {
      summary,
      description,
      start: {
        dateTime: start.toISOString(),
        timeZone: systemTimezone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: systemTimezone,
      },
      attendees: attendees?.map((email) => ({ email })),
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      sendUpdates: "all", // Send email notifications to attendees
    });

    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}

export async function updateEvent(
  eventId: string,
  updates: {
    summary?: string;
    description?: string;
    startTime?: Date;
    endTime?: Date;
    attendees?: string[];
  }
) {
  try {
    const event: Partial<calendar_v3.Schema$Event> = {
      ...(updates.summary && { summary: updates.summary }),
      ...(updates.description && { description: updates.description }),
      ...(updates.startTime && {
        start: {
          dateTime: dayjs(updates.startTime).tz(systemTimezone).toISOString(),
          timeZone: systemTimezone,
        },
      }),
      ...(updates.endTime && {
        end: {
          dateTime: dayjs(updates.endTime).tz(systemTimezone).toISOString(),
          timeZone: systemTimezone,
        },
      }),
      ...(updates.attendees && {
        attendees: updates.attendees.map((email) => ({ email })),
      }),
    };

    const response = await calendar.events.patch({
      calendarId: "primary",
      eventId,
      requestBody: event,
      sendUpdates: "all", // Send email notifications to attendees
    });

    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await calendar.events.delete({
      calendarId: "primary",
      eventId,
      sendUpdates: "all", // Send cancellation emails
    });
    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}
