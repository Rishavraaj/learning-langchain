"use client";

import React from "react";
import { createEvent } from "@/app/utils/googleCalendar";

const CreateEvent = () => {
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await createEvent(
      "Test Event",
      "This is a test event",
      new Date(),
      new Date(),
      ["test@test.com"]
    );
  };

  return (
    <div>
      <h1>Create Event</h1>
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Create Event
      </button>
    </div>
  );
};

export default CreateEvent;
