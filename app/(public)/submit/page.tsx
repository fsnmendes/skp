import { EvidenceForm } from '@/app/components/forms/EvidenceForm'
import Header from '@/app/components/Header'
import { v4 as uuidv4 } from 'uuid'

export default function SubmitPage() {
  const sessionId = uuidv4()
  
  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Header />
        </div>
        <h1 className="text-4xl font-bold text-center mb-8">
          Submit Content
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your content and generate a shareable link
        </p>
        <EvidenceForm sessionId={sessionId} />
      </div>
    </>
  )
} 