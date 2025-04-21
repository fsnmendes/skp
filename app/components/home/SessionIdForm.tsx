"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface SessionIdFormProps {
  onSubmit: (sessionId: string) => void
}

export function SessionIdForm({ onSubmit }: SessionIdFormProps) {
  const [sessionId, setSessionId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = sessionId.trim()
    if (!trimmedInput) return
    onSubmit(trimmedInput)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700 mb-2">
          Session Link or ID
        </label>
        <input
          type="text"
          id="sessionId"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Paste the session link or ID here"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Start Review
      </button>
    </form>
  )
} 