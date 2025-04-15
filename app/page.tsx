"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [sessionId, setSessionId] = useState("")
  const router = useRouter()

  const extractSessionId = (input: string): string | null => {
    // Try to match UUID pattern
    const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
    const uuidMatch = input.match(uuidPattern)
    if (uuidMatch) return uuidMatch[0]

    // Try to extract from URL
    try {
      const url = new URL(input)
      const pathParts = url.pathname.split('/')
      const idFromPath = pathParts[pathParts.length - 1]
      if (uuidPattern.test(idFromPath)) return idFromPath
    } catch (e) {
      // Not a valid URL, continue
    }

    return null
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = sessionId.trim()
    if (!trimmedInput) return

    const extractedId = extractSessionId(trimmedInput)
    if (extractedId) {
      router.push(`/ask/${extractedId}`)
    } else {
      alert("Please enter a valid session ID or link")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        SomeKnowledgeProof
      </h1>
      <p className="text-center text-gray-600 mb-8">
        An insecure platform for verifying semi-confidential evidence
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/submit"
          className="p-6 bg-surface rounded-lg border border-gray-200 hover:border-primary transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">Submit Evidence</h2>
          <p className="text-gray-600">
            Enter evidence and generate a shareable link
          </p>
        </Link>

        <div className="p-6 bg-surface rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2">Verify Evidence</h2>
          <p className="text-gray-600 mb-4">
            Use a shared link to ask questions about evidence
          </p>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700 mb-2">
                Enter Session Link or ID
              </label>
              <input
                type="text"
                id="sessionId"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Paste the session link or ID here"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
            >
              Verify Evidence
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 