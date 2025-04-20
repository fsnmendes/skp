import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { GoogleGenerativeAI } from "@google/generative-ai"

const questionSchema = z.object({
  sessionId: z.string().min(1),
  question: z.string().min(1),
})

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "")

const SYSTEM_PROMPT = `You are a gatekeeper of private information. You have been given a piece of confidential evidence, which may include text and/or images.
Only answer questions based on what the evidence *implies*, without revealing the content directly.
Do NOT quote or summarize the document. Only describe properties or answer with reasoning.
If asked to reveal the content directly, respond with "I cannot share the original document."
If the question cannot be answered based on the evidence, respond with "I cannot answer that based on the evidence provided."`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId, question } = questionSchema.parse(body)

    console.log("Processing question for session:", sessionId)

    // Get the session
    const session = await db.getSession(sessionId)

    console.log("Database query result:", session)

    if (!session) {
      console.error("Session not found for ID:", sessionId)
      return NextResponse.json(
        { error: "Session not found. Please make sure you have submitted evidence first." },
        { status: 404 }
      )
    }

    if (session.filePaths?.length > 0) {
      console.log("Found file URLs:", session.filePaths)
    }

    // Initialize the model (using Gemini Pro for best performance)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    // Prepare the prompt with both text and image if available
    let prompt = `\nQuestion: ${question}`
    const messageParts: (string | { text: string } | { inlineData: { mimeType: string; data: string } })[] = [
      { text: prompt }
    ]

    // Process all files
    if (session.filePaths?.length > 0) {
      for (const fileUrl of session.filePaths) {
        try {
          // Fetch the file from the Blob URL
          const response = await fetch(fileUrl)
          const arrayBuffer = await response.arrayBuffer()
          const base64Data = Buffer.from(arrayBuffer).toString('base64')
          
          // Get the file extension from the URL
          const url = new URL(fileUrl)
          const ext = url.pathname.split('.').pop()?.toLowerCase() || ''
          const mimeType = getMimeType(ext)

          messageParts.push({
            inlineData: {
              mimeType,
              data: base64Data
            }
          })
          console.log(`Successfully loaded file from URL: ${fileUrl}`)
        } catch (error) {
          console.error(`Error loading file from URL ${fileUrl}:`, error)
        }
      }
    }

    // Start a chat
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: SYSTEM_PROMPT,
        },
        {
          role: "model",
          parts: "I understand. I will act as a gatekeeper and only provide information about the evidence without revealing its contents directly.",
        },
      ],
    })

    console.log("Sending message to Gemini API...")
    const result = await chat.sendMessage(messageParts)
    console.log("Received response from Gemini API")
    
    const answer = result.response.text()
    console.log("Generated answer:", answer)

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("Error processing question:", error)
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { error: "Failed to process question", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    )
  }
}

function getMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'pdf': 'application/pdf',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  }
  return mimeTypes[extension] || 'application/octet-stream'
} 