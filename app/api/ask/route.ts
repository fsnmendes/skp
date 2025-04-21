import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getChatModel, getChatResponseForQuestion, getMimeType } from "../utils"

const questionSchema = z.object({
  sessionId: z.string().min(1),
  question: z.string().min(1),
})

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
    const model = getChatModel()

    const messageParts: (string | { text: string } | { inlineData: { mimeType: string; data: string } })[] = [
      { text: "" }
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
          console.log(`Added file URL to message: ${fileUrl}`)
        } catch (error) {
          console.error(`Error loading file from URL ${fileUrl}:`, error)
        }
      }
    }

    return await getChatResponseForQuestion(
      model,
      messageParts,
      question,
    );

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

