"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentResponse } from "@/types/youtube";
import { Bot, MessageSquare } from "lucide-react";

interface YouTubeAgentResponseProps {
  response: AgentResponse;
}

export function YouTubeAgentResponse({ response }: YouTubeAgentResponseProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-lg">Agent Response</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{response.response}</p>
        </CardContent>
      </Card>

      {response.scratchpad.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <CardTitle className="text-lg">Agent Thoughts</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {response.scratchpad.map((thought, index) => (
                <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                  {thought}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
