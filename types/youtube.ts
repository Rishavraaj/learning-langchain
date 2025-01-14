export interface VideoResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
      };
      high: {
        url: string;
      };
    };
  };
}

export interface AgentResponse {
  response: string;
  scratchpad: string[];
}
