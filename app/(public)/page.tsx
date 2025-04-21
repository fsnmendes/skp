"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import Header from "../components/Header"
import { SessionIdForm } from "../components/home/SessionIdForm"
import { SectionHeader } from "../components/home/SectionHeader"
import { ProcessSteps } from "../components/home/ProcessSteps"
import { Card } from "../components/home/Card"

export default function Home() {
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

  const handleVerify = (input: string) => {
    const extractedId = extractSessionId(input)
    if (extractedId) {
      router.push(`/ask?sessionId=${extractedId}`)
    } else {
      alert("Please enter a valid session ID or link")
    }
  }

  const submitterSteps = [
    "Upload your content (text, images, documents)",
    "Get a unique session ID",
    "Share the ID with reviewers"
  ]

  const reviewerSteps = [
    "Enter the session ID provided by the submitter",
    "Ask questions about the content",
    "Get answers about the content without seeing it directly"
  ]

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-center text-gray-600 mb-6">
          Share content with reviewers who can ask questions about it without seeing it directly. 
          Perfect for sensitive information that needs to be verified while maintaining privacy.
        </p>
        
        <div className="space-y-10">
          {/* Submitters Section */}
          <section className="space-y-6">
            <SectionHeader title="For Submitters" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Submit Content" hoverEffect>
                <p className="text-gray-600 mb-6">
                  Share your content and get a unique session ID. Reviewers will only be able to ask questions about it, not see it directly.
                </p>
                <Link
                  href="/submit"
                  className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Submit Content
                </Link>
              </Card>
              
              <Card title="How It Works">
                <ProcessSteps steps={submitterSteps} />
              </Card>
            </div>
          </section>

          {/* Reviewers Section */}
          <section className="space-y-6">
            <SectionHeader title="For Reviewers" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Review Content">
                <p className="text-gray-600 mb-6">
                  Enter a session ID to review content indirectly. You'll be able to ask questions about the content without seeing it directly.
                </p>
                <SessionIdForm onSubmit={handleVerify} />
              </Card>

              <Card title="Review Process">
                <ProcessSteps steps={reviewerSteps} />
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Create Review Session" hoverEffect>
                <p className="text-gray-600 mb-6">
                  Create a new review session with specific questions for submitters to answer.
                </p>
                <Link
                  href="/review"
                  className="block w-full text-center bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Session
                </Link>
              </Card>
              <Card title="Review Creation Process">
                <ProcessSteps steps={[
                  "Create a list of questions for submitters",
                  "Get a unique session ID",
                  "Share the ID with submitters to answer your questions"
                ]} />
              </Card>
            </div>
          </section>
        </div>
      </div>
    </>
  )
} 