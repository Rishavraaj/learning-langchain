"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Loader2 } from "lucide-react";
import { MarkdownContent } from "./markdown-content";

const formSchema = z.object({
  prompt: z.string().min(3, {
    message: "Prompt must be at least 3 characters.",
  }),
});

export function CalendarPrompt() {
  const [result, setResult] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: values.prompt }),
      });

      const data = await response.json();

      if (response.status === 401 && data.authUrl) {
        window.location.href = data.authUrl;
        return;
      }

      setResult(data.result || data.error);

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error,
        });
      } else if (data.result) {
        toast({
          title: "Success",
          description: "Calendar request processed successfully",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
      setResult("Error: Something went wrong");
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          Google Calendar Assistant
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Ask anything about your calendar events and schedules
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="e.g., Show my meetings for today"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              variant="default"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>

        {result && (
          <Card className="mt-6 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-xl">Response</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <MarkdownContent
                content={
                  typeof result === "string"
                    ? result
                    : JSON.stringify(result, null, 2)
                }
              />
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
