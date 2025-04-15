import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json')
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')

interface Session {
  id: string
  evidence: string | null
  filePaths: string[]
  created_at: string
}

let sessions: Session[] = []

// Initialize the data directory and load sessions
async function initialize() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.mkdir(UPLOADS_DIR, { recursive: true })
    try {
      const data = await fs.readFile(SESSIONS_FILE, 'utf-8')
      sessions = JSON.parse(data)
    } catch (error) {
      // File doesn't exist yet, start with empty array
      sessions = []
    }
  } catch (error) {
    console.error('Error initializing data:', error)
    sessions = []
  }
}

// Save sessions to file
async function saveSessions() {
  try {
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessions, null, 2))
  } catch (error) {
    console.error('Error saving sessions:', error)
  }
}

// Save image file
async function saveImage(image: File, sessionId: string): Promise<string> {
  const imagePath = path.join(UPLOADS_DIR, `${sessionId}.${image.type.split('/')[1]}`)
  const buffer = await image.arrayBuffer()
  await fs.writeFile(imagePath, Buffer.from(buffer))
  return imagePath
}

// Initialize on module load
initialize()

export const db = {
  async run(query: string, params: any[]) {
    // This is a simplified version that only handles INSERT
    if (query.startsWith('INSERT INTO sessions')) {
      const [id, evidence, filePaths, created_at] = params
      sessions.push({ id, evidence, filePaths: JSON.parse(filePaths), created_at })
      await saveSessions()
    }
  },

  async get(query: string, params: any[]) {
    // This is a simplified version that only handles SELECT
    if (query.startsWith('SELECT')) {
      const [id] = params
      return sessions.find(session => session.id === id)
    }
    return null
  },

  async saveImage(image: File, sessionId: string): Promise<string> {
    return saveImage(image, sessionId)
  }
} 