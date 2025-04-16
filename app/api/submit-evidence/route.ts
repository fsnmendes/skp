import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import { db } from "@/lib/db"
import { put } from '@vercel/blob'

const evidenceSchema = z.object({
  evidence: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const evidence = formData.get("evidence") as string | null
    const files = formData.getAll("files") as File[]

    // Validate that at least one of evidence or files is provided
    if (!evidence && files.length === 0) {
      return NextResponse.json(
        { error: "Please provide either text evidence or files" },
        { status: 400 }
      )
    }

    // Validate evidence if provided
    if (evidence) {
      evidenceSchema.parse({ evidence })
    }

    const sessionId = uuidv4()
    const createdAt = new Date().toISOString()
    const fileUrls: string[] = []

    // Save files if provided
    for (const file of files) {
      try {
        const blob = await put(
          `${sessionId}/${file.name}`,
          file,
          {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN
          }
        )
        fileUrls.push(blob.url)
        console.log(`Successfully uploaded file to: ${blob.url}`)
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error)
        throw error
      }
    }

    await db.run(
      "INSERT INTO sessions (id, evidence, filePaths, created_at) VALUES (?, ?, ?, ?)",
      [sessionId, evidence || null, JSON.stringify(fileUrls), createdAt]
    )

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error("Error submitting evidence:", error)
    return NextResponse.json(
      { error: "Failed to submit evidence" },
      { status: 400 }
    )
  }
} 