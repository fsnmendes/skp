import { EvidenceForm } from "@/app/components/forms/EvidenceForm"
import Header from "@/app/components/Header"
import { db } from "@/lib/db"

async function getSession(sessionId: string) {
  try {
    const session = await db.getSession(sessionId)
    return { session, error: null }
  } catch (error) {
    console.error("Error fetching session:", error)
    return { 
      session: null, 
      error: error instanceof Error ? error.message : "Failed to load session" 
    }
  }
}

export default async function SubmitPage({
  params,
}: {
  params: { sessionId: string }
}) {


  return (
    <div className="max-w-2xl mx-auto p-4">
      <Header />
      <h1 className="text-4xl font-bold text-center mb-8">
        Share Content
      </h1>
    
      <EvidenceForm sessionId={params.sessionId} />
    </div>
  )
} 