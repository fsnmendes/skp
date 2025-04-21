"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ShareLink } from "@/app/components/ui/ShareLink"

export function ReviewQuestionsForm() {
  const [questions, setQuestions] = useState<string[]>([''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const router = useRouter()

  const addQuestion = () => {
    setQuestions([...questions, ''])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = value
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions: questions.filter(q => q.trim()) }),
      })

      if (!response.ok) {
        throw new Error('Failed to create review')
      }

      const { sessionId: newSessionId } = await response.json()
      setSessionId(newSessionId)
    } catch (error) {
      console.error('Error creating review:', error)
      alert('Failed to create review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sessionId) {
    const shareUrl = `${window.location.origin}/submit/${sessionId}`
    return (
      <>
        <ShareLink 
          url={shareUrl}
          title="Review Session Created!"
          description="Share this link with the content submitter:"
          variant="info"
        />
        <div className="h-4"></div>
        <button
          onClick={() => router.push(`/review/${sessionId}`)}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
        >
          Open Review Session
        </button>
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => updateQuestion(index, e.target.value)}
              placeholder={`Question ${index + 1}`}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="p-3 text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={addQuestion}
          className="text-blue-500 hover:text-blue-600"
        >
          + Add Question
        </button>

        <button
          type="submit"
          disabled={isSubmitting || questions.every(q => !q.trim())}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Review'}
        </button>
      </div>
    </form>
  )
} 