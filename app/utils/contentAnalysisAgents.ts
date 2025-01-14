import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Prompt templates for different agents
const TRANSCRIPT_ANALYSIS_PROMPT = ChatPromptTemplate.fromTemplate(`
You are an expert content analyzer. Analyze the following video transcript and provide:
1. A concise summary
2. Key points and takeaways
3. Main topics and categories

Transcript: {transcript}

Provide your analysis in a clear, structured format.
`);

const SENTIMENT_ANALYSIS_PROMPT = ChatPromptTemplate.fromTemplate(`
You are a sentiment analysis expert. Analyze the following video comments and engagement metrics to determine:
1. Overall sentiment (positive, negative, neutral)
2. Key themes in comments
3. Engagement quality analysis

Comments: {comments}
Engagement Metrics: {metrics}

Provide your analysis with specific insights and patterns.
`);

const TREND_ANALYSIS_PROMPT = ChatPromptTemplate.fromTemplate(`
You are a trend detection specialist. Analyze the following collection of video data to identify:
1. Emerging topics and patterns
2. Content trends
3. Audience interest patterns

Video Collection Data: {videoData}

Provide your analysis with specific trend insights and recommendations.
`);

interface VideoMetrics {
  likes: number;
  views: number;
  commentCount: number;
}

interface VideoData {
  transcript: string;
  comments: string[];
  metrics: VideoMetrics;
}

// Create the content analyzer agent
export const createContentAnalyzer = async (transcript: string) => {
  const model = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0,
  });

  const chain = RunnableSequence.from([
    TRANSCRIPT_ANALYSIS_PROMPT,
    model,
    new StringOutputParser(),
  ]);

  const response = await chain.invoke({
    transcript,
  });

  return {
    analysis: response,
  };
};

// Create the sentiment analysis agent
export const createSentimentAnalyzer = async (
  comments: string[],
  metrics: VideoMetrics
) => {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
  });

  const chain = RunnableSequence.from([
    SENTIMENT_ANALYSIS_PROMPT,
    model,
    new StringOutputParser(),
  ]);

  const response = await chain.invoke({
    comments: comments.join("\n"),
    metrics: JSON.stringify(metrics),
  });

  return {
    analysis: response,
  };
};

// Create the trend detection agent
export const createTrendAnalyzer = async (videoData: VideoData) => {
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0,
  });

  const chain = RunnableSequence.from([
    TREND_ANALYSIS_PROMPT,
    model,
    new StringOutputParser(),
  ]);

  const response = await chain.invoke({
    videoData: JSON.stringify(videoData),
  });

  return {
    analysis: response,
  };
};
