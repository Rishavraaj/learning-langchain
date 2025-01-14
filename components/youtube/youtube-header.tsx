import { Youtube } from "lucide-react";

export function YouTubeHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center gap-2">
          <Youtube className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-2xl font-bold">YouTube Agent</h1>
            <p className="text-sm text-muted-foreground">
              Powered by LangGraph and LangChain
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
