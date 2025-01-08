import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "@langchain/core/tools";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./googleCalendar";

// Configure Day.js plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Get system timezone
const systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export async function createCalendarAgent() {
  const model = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0,
  });

  const tools = [
    new DynamicTool({
      name: "list_calendar_events",
      description:
        "Lists upcoming calendar events. Returns events with their details including title, time, and attendees.",
      func: async () => {
        const events = await listEvents();
        return JSON.stringify(events, null, 2);
      },
    }),
    new DynamicTool({
      name: "create_calendar_event",
      description: `Creates a new calendar event. You must format the input as a JSON string with the following structure:
      {
        "summary": "Meeting title",
        "description": "Meeting description",
        "startTime": "2025-01-08T14:00:00", // Local time
        "endTime": "2025-01-08T15:00:00",   // Local time
        "attendees": ["email1@example.com"]   // Optional
      }
      Always use the current year for dates. Parse the natural language input to extract these details.`,
      func: async (input: string) => {
        try {
          console.log("Raw input to create_calendar_event:", input);

          if (!input) {
            throw new Error("No input provided to create_calendar_event");
          }

          const parsed = JSON.parse(input);
          console.log("Parsed input:", parsed);

          const { summary, description, startTime, endTime, attendees } =
            parsed;

          // Validate required fields
          if (!summary || !startTime || !endTime) {
            throw new Error(
              "Missing required fields: summary, startTime, or endTime"
            );
          }

          // Convert times to current year and proper timezone
          const now = dayjs();
          const startDate = dayjs(startTime)
            .year(now.year())
            .tz(systemTimezone);
          const endDate = dayjs(endTime).year(now.year()).tz(systemTimezone);

          console.log("Creating event with dates:", {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            timezone: systemTimezone,
          });

          const event = await createEvent(
            summary,
            description || "",
            startDate.toDate(),
            endDate.toDate(),
            attendees
          );

          console.log("Event created successfully:", event);
          return JSON.stringify(event, null, 2);
        } catch (error) {
          console.error("Error in create_calendar_event:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          throw new Error(`Failed to create calendar event: ${errorMessage}`);
        }
      },
    }),
    new DynamicTool({
      name: "update_calendar_event",
      description: `Updates an existing calendar event. Format the input as a JSON string:
      {
        "eventId": "event123",
        "summary": "Updated title",      // Optional
        "description": "New desc",       // Optional
        "startTime": "2025-01-08T14:00:00", // Optional, local time
        "endTime": "2025-01-08T15:00:00",   // Optional, local time
        "attendees": ["email@example.com"]    // Optional
      }
      Always use the current year for dates.`,
      func: async (input: string) => {
        try {
          const { eventId, ...updates } = JSON.parse(input);
          const now = dayjs();

          if (updates.startTime) {
            updates.startTime = dayjs(updates.startTime)
              .year(now.year())
              .tz(systemTimezone)
              .toDate();
          }
          if (updates.endTime) {
            updates.endTime = dayjs(updates.endTime)
              .year(now.year())
              .tz(systemTimezone)
              .toDate();
          }

          const event = await updateEvent(eventId, updates);
          return JSON.stringify(event, null, 2);
        } catch (error) {
          console.error("Error in update_calendar_event:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          throw new Error(`Failed to update calendar event: ${errorMessage}`);
        }
      },
    }),
    new DynamicTool({
      name: "delete_calendar_event",
      description: `Deletes a calendar event. Format the input as a JSON string:
      {
        "eventId": "event123"
      }`,
      func: async (input: string) => {
        try {
          const { eventId } = JSON.parse(input);
          await deleteEvent(eventId);
          return "Event deleted successfully";
        } catch (error) {
          console.error("Error in delete_calendar_event:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error occurred";
          throw new Error(`Failed to delete calendar event: ${errorMessage}`);
        }
      },
    }),
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "openai-functions",
    verbose: true,
    agentArgs: {
      prefix: `You are a helpful assistant that manages Google Calendar events. When creating or updating events:
      1. Always use the current year for dates
      2. Convert user's natural language time to local time format (YYYY-MM-DDTHH:mm:ss)
      3. Format the input as proper JSON before calling tools
      4. Include all necessary fields as specified in the tool descriptions
      5. Handle time zones appropriately using the user's local timezone
      6. For time durations, calculate the end time based on the start time and duration`,
    },
  });

  return executor;
}
