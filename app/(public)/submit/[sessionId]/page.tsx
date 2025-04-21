import { EvidenceForm } from '@/app/components/forms/EvidenceForm'
import Header from '@/app/components/Header'
import { db } from '@/lib/db'

export default async function SubmitPage({
  params
}: {
  params: { sessionId: string }
}) {
  const session = await db.getSession(params.sessionId)

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Header />
        </div>
        <h1 className="text-4xl font-bold text-center mb-8">
          Session Not Found
        </h1>
        <p className="text-center text-gray-600 mb-8">
          The review session you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
      </div>
    )
  }

  const questions = session.questionMap ? Object.keys(session.questionMap) : undefined
  console.log("Questions:", questions)

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
          Submit your content to answer the questions asked by the reviewer.
          Answers will be AI-generated based on the content you provide and shared with the reviewer.
          The submitted content will remain private and will not be shared with the reviewer.
        </p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Reviewer Questions</h2>
          <div className="space-y-4">
            {questions?.map((question, index) => (
              <div key={index} className="flex items-baseline space-x-3">
                <span className="text-blue-500 font-bold">{index + 1}.</span>
                <p className="text-gray-800 italic">{question}</p>
              </div>
            ))}
          </div>
        </div>
        <EvidenceForm sessionId={params.sessionId} />
      </div>
    </>
  )
}