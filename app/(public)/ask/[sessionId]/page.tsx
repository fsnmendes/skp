import Header from "@/app/components/Header"
import { ChatInterface } from "@/app/components/ui/ChatInterface"

export default function AskPage({
  params,
}: {
  params: { sessionId: string }
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
      <Header /> 
      </div>
      <h1 className="text-4xl font-bold text-center mb-8">
        Review Content 
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Ask questions about the content
      </p>
      <ChatInterface sessionId={params.sessionId} />
    </div>
  )
} 