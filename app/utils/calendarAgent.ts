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
    modelName: "gpt-3.5-turbo",
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
        "startTime": "YYYY-MM-DDTHH:mm:ss", // Local time, use actual date, not placeholder
        "endTime": "YYYY-MM-DDTHH:mm:ss",   // Local time, use actual date, not placeholder
        "attendees": ["email1@example.com"]   // Optional
      }
      For dates:
      - Use dayjs().add(1, 'day') for tomorrow
      - Use dayjs() for today
      - Always include the actual year, month, and day in the date
      - Do not use placeholder dates`,
      func: async (input: string) => {
        try {
          if (!input) {
            throw new Error("No input provided to create_calendar_event");
          }

          const parsed = JSON.parse(input);

          const { summary, description, startTime, endTime, attendees } =
            parsed;

          // Validate required fields
          if (!summary || !startTime || !endTime) {
            throw new Error(
              "Missing required fields: summary, startTime, or endTime"
            );
          }

          // Parse dates with the correct timezone
          const startDate = dayjs(startTime).tz(systemTimezone);
          const endDate = dayjs(endTime).tz(systemTimezone);

          const event = await createEvent(
            summary,
            description || "",
            startDate.toDate(),
            endDate.toDate(),
            attendees
          );

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
        "startTime": "YYYY-MM-DDTHH:mm:ss", // Optional, use actual date
        "endTime": "YYYY-MM-DDTHH:mm:ss",   // Optional, use actual date
        "attendees": ["email@example.com"]    // Optional
      }
      Always use actual dates, not placeholders.`,
      func: async (input: string) => {
        try {
          const { eventId, ...updates } = JSON.parse(input);

          if (updates.startTime) {
            updates.startTime = dayjs(updates.startTime)
              .tz(systemTimezone)
              .toDate();
          }
          if (updates.endTime) {
            updates.endTime = dayjs(updates.endTime)
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
      1. For tomorrow's events, use dayjs().add(1, 'day') to get the correct date
      2. For today's events, use dayjs() to get the current date
      3. Always use the actual date and year, not placeholders
      4. Convert user's natural language time to proper format (YYYY-MM-DDTHH:mm:ss)
      5. Format the input as proper JSON before calling tools
      6. Include all necessary fields as specified in the tool descriptions
      7. Handle time zones appropriately using the user's local timezone
      8. For time durations, calculate the end time based on the start time and duration
      9. Double-check that dates are correct before creating events`,
    },
  });

  return executor;
}
