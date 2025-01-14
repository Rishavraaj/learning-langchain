import { NextResponse } from "next/server";
import { DallEAPIWrapper } from "@langchain/openai";

// Initialize DALL-E wrapper
const dalle = new DallEAPIWrapper({
  n: 1,
  model: "dall-e-3",
  apiKey: process.env.OPENAI_API_KEY,
  size: "1792x1024", // 16:9 ratio for YouTube thumbnails
  quality: "hd",
  style: "natural",
});

function generateThumbnailPrompt(title: string) {
  return `Create a visually striking YouTube thumbnail for a video titled "${title}".
  The thumbnail should be:
  - Professional and eye-catching design
  - Clear visual hierarchy with focal point
  - Vibrant, contrasting colors
  - Relevant imagery that matches the title
  - Modern and clean composition
  - Minimal text elements
  - High production value look
  - Optimized for YouTube (16:9 ratio)
  - Photorealistic style
  
  Important: Make it visually appealing and instantly engaging to maximize click-through rate. Do not include any text in the image.`;
}

async function generateImageWithDalle(prompt: string) {
  try {
    const imageUrl = await dalle.invoke(prompt);

    if (!imageUrl) {
      throw new Error("No image was generated in the response");
    }

    return imageUrl;
  } catch (error) {
    console.error("Error generating image with DALL-E:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Generate the thumbnail prompt
    const prompt = generateThumbnailPrompt(title);

    // Generate the image using DALL-E 3
    const imageUrl = await generateImageWithDalle(prompt);

    return NextResponse.json({
      success: true,
      image: imageUrl,
      prompt: prompt,
    });
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to generate thumbnail",
        details: errorMessage,
        technicalDetails: JSON.stringify(error, null, 2),
      },
      { status: 500 }
    );
  }
}
