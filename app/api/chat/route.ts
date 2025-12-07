import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import OpenAI from "openai"

// Removed edge runtime since Prisma doesn't support it

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { message, organizationId } = await req.json()

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 })
    }

    // Search for relevant articles
    const articles = await prisma.article.findMany({
      where: {
        ...(organizationId ? { organizationId } : {}),
        organization: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
        isPublished: true,
        OR: [
          {
            title: {
              contains: message,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: message,
              mode: "insensitive",
            },
          },
          {
            excerpt: {
              contains: message,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        slug: true,
      },
      take: 5,
    })

    type Article = (typeof articles)[0]

    // Build context from articles
    const context = articles.map((article: Article) => `Title: ${article.title}\nContent: ${article.content.substring(0, 1000)}...`).join("\n\n---\n\n")

    const systemPrompt = `You are a helpful AI assistant for a knowledge base application called DocuFlow. 
Your role is to help users find information from their documentation.

${context ? `Here is the relevant documentation:\n\n${context}\n\n` : ""}

Instructions:
- Answer questions based on the provided documentation
- If the answer isn't in the documentation, politely say you don't have that information
- Be concise but helpful
- If you reference information from the docs, mention which article it came from
- Format your responses in markdown for better readability`

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    })

    // Create a ReadableStream for the response
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ""
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }

          // Send article sources at the end
          if (articles.length > 0) {
            const sources = `\n\n---\n\n**Sources:**\n${articles.map((a: Article) => `- ${a.title}`).join("\n")}`
            controller.enqueue(encoder.encode(sources))
          }

          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Chat error:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat" }), { status: 500 })
  }
}
