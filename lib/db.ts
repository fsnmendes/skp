import { put } from '@vercel/blob'

interface Session {
  id: string
  evidence: string | null
  filePaths: string[]
  created_at: string
}

// In-memory storage for sessions (you might want to use a proper database in production)
let sessions: Session[] = []

export const db = {
  async run(query: string, params: any[]) {
    if (query.startsWith('INSERT INTO sessions')) {
      const [id, evidence, filePaths, created_at] = params
      sessions.push({ id, evidence, filePaths: JSON.parse(filePaths), created_at })
    }
  },

  async get(query: string, params: any[]) {
    if (query.startsWith('SELECT')) {
      const [id] = params
      return sessions.find(session => session.id === id)
    }
    return null
  },

  async saveImage(image: File, sessionId: string): Promise<string> {
    try {
      const blob = await put(
        `${sessionId}/${image.name}`,
        image,
        {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN
        }
      )
      return blob.url
    } catch (error) {
      console.error('Error saving image:', error)
      throw error
    }
  }
} 