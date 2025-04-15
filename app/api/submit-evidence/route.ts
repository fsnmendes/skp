import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import { db } from "@/lib/db"
import { promises as fs } from 'fs'
import path from 'path'

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
    const filePaths: string[] = []

    // Save files if provided
    for (const file of files) {
      const filePath = path.join(process.cwd(), 'data', 'uploads', sessionId, file.name)
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      const buffer = await file.arrayBuffer()
      await fs.writeFile(filePath, Buffer.from(buffer))
      filePaths.push(filePath)
    }

    await db.run(
      "INSERT INTO sessions (id, evidence, filePaths, created_at) VALUES (?, ?, ?, ?)",
      [sessionId, evidence || null, JSON.stringify(filePaths), createdAt]
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