import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getChatModel, getChatResponseForQuestion, getMimeType, PrivacyLevel } from "../utils"


export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const textContent = formData.get("evidence") as string | null
    const files = formData.getAll("files") as File[]
    const sessionId = formData.get("sessionId") as string
    const privacyLevel = formData.get("privacyLevel") as PrivacyLevel


    // Validate that at least one of evidence or files is provided
    if (!textContent && files.length === 0) {
      return NextResponse.json(
        { error: "Please provide either text evidence or files" },
        { status: 400 }
      )
    }

    const fileUrls: string[] = []

    // Save text evidence as a file if provided
    if (textContent) {
      const textFile = new File([textContent], "evidence.txt", { type: "text/plain" })
      files.push(textFile) // Add the text file to the files array
    }

    const model = getChatModel()
    const messageParts: (string | { text: string } | { inlineData: { mimeType: string; data: string } })[] = [
      { text: "" }
    ]

    // Save other files if provided
    for (const file of files) {
      try {
        const fileUrl = await db.saveFile(file, sessionId)
        fileUrls.push(fileUrl)
        console.log(`Successfully uploaded file to: ${fileUrl} to ${fileUrls}`)

        const arrayBuffer = await file.arrayBuffer()
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
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error)
        throw error
      }
    }

    // Get existing session to check for questions
    const session = await db.getSession(sessionId)
    if (session == null) {
      console.log("No existing session found or no questions to answer, creating new session")
      await db.createSession({
        id: sessionId,
        filePaths: fileUrls,
        questionMap: {},
        privacyLevel: privacyLevel,
      })
    } else {
      session.filePaths = [...(session.filePaths || []), ...fileUrls]
      session.privacyLevel = privacyLevel
      for (const [question, value] of Object.entries(session.questionMap)) {
        if (value) {
          console.log("Question already answered:", question)
          continue
        }
        try {
          console.log("Sending question to API:", question)
          const response = await getChatResponseForQuestion(
            model,
            messageParts,
            question
          )
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to get response")
          }
          const { answer } = await response.json()
          console.log("Received answer:", answer)
          session.questionMap[question] = answer
        } catch (error) {
          console.error("Error getting response:", error)
        } 
      }
      await db.updateSession(session)
    }
    console.log("Evidence submitted successfully to new session", sessionId)
    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error("Error submitting evidence:", error)
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { error: "Failed to submit evidence", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 400 }
    )
  }
} 