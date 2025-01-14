import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { google } from "googleapis";

// Initialize the YouTube client
const initializeYouTube = () => {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("Missing required Google API credentials");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
    },
    scopes: ["https://www.googleapis.com/auth/youtube.force-ssl"],
    projectId: process.env.GOOGLE_PROJECT_ID,
  });

  const youtube = google.youtube({
    version: "v3",
    auth,
  });

  return youtube;
};

// Function to search YouTube videos
const searchYouTubeVideos = async (query: string) => {
  const youtubeClient = initializeYouTube();

  try {
    const response = await youtubeClient.search.list({
      part: ["snippet"],
      q: query,
      maxResults: 5,
      type: ["video"],
    });

    return response.data.items;
  } catch (error) {
    console.error("Error searching YouTube:", error);
    throw error;
  }
};

// Define the agent prompt
const YOUTUBE_AGENT_PROMPT = ChatPromptTemplate.fromTemplate(`
You are a helpful YouTube assistant that can search and analyze YouTube content.
Given the following question, help formulate a response using the available YouTube data.

Question: {question}

Previous actions and observations:
{scratchpad}

Based on this, what should I do next? Respond with your analysis and next steps.
`);

// Create the agent function
const createYouTubeAgent = async (question: string) => {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
  });

  // Create the chain
  const chain = RunnableSequence.from([
    YOUTUBE_AGENT_PROMPT,
    model,
    new StringOutputParser(),
  ]);

  // Run the chain
  const response = await chain.invoke({
    question,
    scratchpad: [],
  });

  return {
    response,
    scratchpad: [response],
  };
};

export { createYouTubeAgent, searchYouTubeVideos };
