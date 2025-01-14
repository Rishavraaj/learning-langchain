import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Function to chunk text into smaller pieces
function chunkText(text: string, maxLength: number = 3000): string[] {
  if (!text) return [""];

  // If the text is short enough, return it as a single chunk
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = "";
  const words = text.split(" ");

  for (const word of words) {
    if ((currentChunk + " " + word).length <= maxLength) {
      currentChunk += (currentChunk ? " " : "") + word;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = word;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    if (!data) {
      return NextResponse.json(
        { error: "No data provided for analysis" },
        { status: 400 }
      );
    }

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo-16k",
      temperature: 0,
    });

    let content = "";
    let prompt = "";

    switch (type) {
      case "transcript":
        content = data.transcript || "";
        prompt = `Analyze the following video transcript and provide:
1. A concise summary (2-3 sentences)
2. Key points (bullet points)
3. Main topics covered

Content: {content}

Provide your analysis in a clear, structured format.`;
        break;

      case "sentiment":
        content = Array.isArray(data.comments) ? data.comments.join("\n") : "";
        prompt = `Analyze these YouTube comments and provide:
1. Overall sentiment (positive/negative/neutral)
2. Key themes in comments
3. Most discussed aspects

Comments: {content}

Provide your analysis in a clear, structured format.`;
        break;

      case "trends":
        content =
          typeof data.metrics === "object"
            ? `Views: ${data.metrics.views || 0}
Likes: ${data.metrics.likes || 0}
Comments: ${data.metrics.commentCount || 0}`
            : "";
        prompt = `Analyze these video metrics and provide insights:
1. Engagement analysis
2. Performance indicators
3. Areas of success/improvement

Metrics: {content}

Provide your analysis in a clear, structured format.`;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid analysis type" },
          { status: 400 }
        );
    }

    if (!content) {
      return NextResponse.json(
        { error: "No content available for analysis" },
        { status: 400 }
      );
    }

    // Chunk the content if it's too large
    const chunks = chunkText(content);
    let finalAnalysis = "";

    // Process each chunk
    for (const chunk of chunks) {
      const promptTemplate = ChatPromptTemplate.fromTemplate(prompt);
      const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

      const response = await chain.invoke({
        content: chunk,
      });

      finalAnalysis += response + "\n\n";
    }

    // If there were multiple chunks, summarize them
    if (chunks.length > 1) {
      const summaryPrompt = ChatPromptTemplate.fromTemplate(`
        Summarize the following analyses into a single coherent analysis:

        {content}

        Provide a clear, structured summary that combines all the key points.
      `);

      const summaryChain = summaryPrompt
        .pipe(model)
        .pipe(new StringOutputParser());
      finalAnalysis = await summaryChain.invoke({
        content: finalAnalysis,
      });
    }

    return NextResponse.json({ analysis: finalAnalysis });
  } catch (error) {
    console.error("Content analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze content" },
      { status: 500 }
    );
  }
}
