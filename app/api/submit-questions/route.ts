import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"
import { db } from "@/lib/db"

const questionsSchema = z.object({
  questions: z.array(z.string().min(1)).min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { questions } = questionsSchema.parse(body)

    const sessionId = uuidv4()
    const createdAt = new Date().toISOString()

    await db.run(
      "INSERT INTO sessions (id, questions, created_at) VALUES (?, ?, ?)",
      [sessionId, JSON.stringify(questions), createdAt]
    )

    return NextResponse.json({ sessionId })
  } catch (error) {
    console.error("Error submitting questions:", error)
    return NextResponse.json(
      { error: "Failed to submit questions" },
      { status: 400 }
    )
  }
} 