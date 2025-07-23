import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: openai("gpt-4o"),
      messages,
      system:
        "You are a helpful e-commerce shopping assistant for ModernShop. Your goal is to assist users in finding products, answering questions about products, and guiding them through the shopping experience. Be concise and helpful. Do not provide information outside of e-commerce or ModernShop products?.",
    })

    return result.to
  } catch (error) {
    console.error("Error in AI chat API:", error)
    return NextResponse.json({ error: "Failed to generate response from AI" }, { status: 500 })
  }
}
