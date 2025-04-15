import { EvidenceForm } from "@/components/EvidenceForm"
import { HomeButton } from "@/components/HomeButton"

export default function SubmitPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <HomeButton />
      </div>
      <h1 className="text-4xl font-bold text-center mb-8">
        Submit Evidence
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Enter your confidential evidence and generate a shareable link
      </p>
      <EvidenceForm />
    </div>
  )
} 