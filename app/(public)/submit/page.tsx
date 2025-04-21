import { EvidenceForm } from '@/app/components/forms/EvidenceForm'
import Header from '@/app/components/Header'
import { v4 as uuidV4 } from 'uuid'


export default async function SubmitPage({
}: {
}) {
  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Header />
        </div>
        <h1 className="text-4xl font-bold text-center mb-8">
          Submit Content
        </h1>
        <p className="text-lg text-gray-600 mb-8 px-4 text-justify leading-relaxed">
          Submit your content to allow your reviewer to ask questions about the content.
          Answers will be AI-generated based on the content you provide and shared with the reviewer.
          The submitted content will remain private and will not be shared with the reviewer.
        </p> 
        <EvidenceForm sessionId={uuidV4()} />
      </div>
    </>
  )
} 