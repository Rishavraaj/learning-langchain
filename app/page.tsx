"use client";

import { CalendarPrompt } from "../components/calendar-prompt";
import { Toaster } from "../components/ui/toaster";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-background">
      <CalendarPrompt />
      <Toaster />
    </main>
  );
}
