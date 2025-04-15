import { ChatInterface } from "@/components/ChatInterface"

export default function VerifyPage({
  params,
}: {
  params: { sessionId: string }
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        Verify Evidence
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Ask questions about the confidential evidence
      </p>
      <ChatInterface sessionId={params.sessionId} />
    </div>
  )
} 