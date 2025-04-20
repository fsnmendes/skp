import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import { db } from "@/lib/db"
import { put } from '@vercel/blob'


export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const textContent = formData.get("evidence") as string | null
    const files = formData.getAll("files") as File[]

    // Validate that at least one of evidence or files is provided
    if (!textContent && files.length === 0) {
      return NextResponse.json(
        { error: "Please provide either text evidence or files" },
        { status: 400 }
      )
    }

    const sessionId = uuidv4()
    const fileUrls: string[] = []

    // Save text evidence as a file if provided
    if (textContent) {
      const textFile = new File([textContent], "evidence.txt", { type: "text/plain" })
      const textFileUrl = await db.saveFile(textFile, sessionId)
      fileUrls.push(textFileUrl)
      console.log(`Successfully saved text evidence to: ${textFileUrl}`)
    }

    // Save other files if provided
    for (const file of files) {
      try {
        const fileUrl = await db.saveFile(file, sessionId)
        fileUrls.push(fileUrl)
        console.log(`Successfully uploaded file to: ${fileUrl}`)
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error)
        throw error
      }
    }

    // Create the session
    const session = await db.createSession({
      id: sessionId,
      filePaths: fileUrls
    })

    console.log("Evidence submitted successfully to session", sessionId)

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