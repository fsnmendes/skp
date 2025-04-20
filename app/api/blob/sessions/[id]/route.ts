import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`https://blob.vercel-storage.com/sessions/${params.id}`, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
      }
    })
    if (!response.ok) throw new Error('Not found')
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching blob:', error)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
} 