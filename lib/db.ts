import { del, list, put } from '@vercel/blob'

export interface Session {
  id: string
  filePaths: string[]
  questionMap: Record<string, string | null>
  created_at: string
}

const BLOB_BASE_URL = 'https://nm17sg3daqzv9cef.public.blob.vercel-storage.com'

export const db = {
  async createSession(session: Omit<Session, 'created_at'>): Promise<Session> {
    const sessionWithTimestamp = {
      ...session,
      created_at: new Date().toISOString()
    }

    await put(
      `sessions/${session.id}/data.json`,
      JSON.stringify(sessionWithTimestamp),
      {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false // Prevent adding random suffix
      }
    )

    return sessionWithTimestamp
  },
  
  async updateSession(session: Session): Promise<Session> {
    await put(
      `sessions/${session.id}/data.json`,
      JSON.stringify(session),
      {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false
      }
    )

    return session
  },

  async getSession(id: string): Promise<Session | null> {
    try {
      // Add timestamp query parameter to prevent caching
      const url = `${BLOB_BASE_URL}/sessions/${id}/data.json?t=${Date.now()}`
      console.log('Fetching session from:', url)
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      console.log('Response status:', response.status)
      if (!response.ok) {
        console.log('Response not OK:', response.statusText)
        return null
      }
      const data = await response.json()
      console.log('Session data:', data)
      return data
    } catch (error) {
      console.error('Error fetching session:', error)
      return null
    }
  },


  async deleteSession(id: string): Promise<void> {
    try {
      await del(`sessions/${id}`, {
        token: process.env.BLOB_READ_WRITE_TOKEN
      })
    } catch (error) {
      console.error('Error deleting session:', error)
      throw error
    }
  },

  async listSessions(): Promise<Session[]> {
    try {
      const { blobs } = await list({
        prefix: 'sessions/',
        token: process.env.BLOB_READ_WRITE_TOKEN
      })

      const sessions = await Promise.all(
        blobs
          .filter(blob => blob.pathname.endsWith('/data.json'))
          .map(async (blob) => {
            const response = await fetch(blob.url)
            return response.json() as Promise<Session>
          })
      )

      return sessions
    } catch (error) {
      console.error('Error listing sessions:', error)
      return []
    }
  },

  async saveFile(file: File, sessionId: string): Promise<string> {
    try {
      const blob = await put(
        `sessions/${sessionId}/files/${file.name}`,
        file,
        {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN
        }
      )
      return blob.url
    } catch (error) {
      console.error('Error saving file:', error)
      throw error
    }
  }
} 