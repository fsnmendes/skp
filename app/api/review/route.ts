import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

const questionSchema = z.object({
  questions: z.array(z.string().min(1)).min(1)
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { questions } = questionSchema.parse(body)
    const questionMap = questions.reduce<Record<string, null>>((acc, question) => {
      acc[question] = null
      return acc
    }, {})

    const sessionId = uuidv4()
    
    const session = await db.createSession({
      id: sessionId,
      filePaths: [],
      questionMap
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating review session:', error)
    return NextResponse.json(
      { error: 'Failed to create review session' },
      { status: 500 }
    )
  }
}


