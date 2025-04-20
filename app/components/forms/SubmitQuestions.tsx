"use client"

import { useState } from "react"

interface SubmitQuestionsProps {
  onQuestionsSubmitted?: (sessionId: string) => void
}

export function SubmitQuestions({ onQuestionsSubmitted }: SubmitQuestionsProps) {
  const [questions, setQuestions] = useState<string[]>([])
  const [newQuestion, setNewQuestion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions(prev => [...prev, newQuestion.trim()])
      setNewQuestion("")
    }
  }

  const handleSubmit = async () => {
    if (questions.length === 0) return
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit questions")
      }

      const { sessionId: newSessionId } = await response.json()
      setSessionId(newSessionId)
      if (onQuestionsSubmitted) {
        onQuestionsSubmitted(newSessionId)
      }
    } catch (error) {
      console.error("Error submitting questions:", error)
      alert("Failed to submit questions. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index))
  }

  if (sessionId) {
    const shareUrl = `${window.location.origin}/submit/${sessionId}`
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Questions Submitted Successfully!
          </h3>
          <p className="text-green-700 mb-4">
            Share this link with the content sender:
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 p-2 border border-gray-300 rounded-lg bg-white"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Add Questions
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddQuestion()}
            placeholder="Enter a question..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Add
          </button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Your Questions:</h3>
          {questions.map((question, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span>{question}</span>
              <button
                onClick={() => removeQuestion(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {questions.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Questions"}
        </button>
      )}
    </div>
  )
} 