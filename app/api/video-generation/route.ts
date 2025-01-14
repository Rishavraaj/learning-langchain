import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { script } = await req.json();

    if (!script) {
      return NextResponse.json(
        { error: "Script is required" },
        { status: 400 }
      );
    }

    // Generate a video using OpenAI's text-to-video API (when available)
    // For now, we'll use text-to-speech and image generation as a placeholder
    const speechResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: script,
    });

    const speechBuffer = Buffer.from(await speechResponse.arrayBuffer());
    const speechBase64 = speechBuffer.toString("base64");

    // Generate an image for the video
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a visually appealing scene for a YouTube Short with the following script: ${script}`,
      n: 1,
      size: "1024x1024",
    });

    return NextResponse.json({
      success: true,
      audio: speechBase64,
      image: imageResponse.data[0].url,
    });
  } catch (error) {
    console.error("Error generating video:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
}
