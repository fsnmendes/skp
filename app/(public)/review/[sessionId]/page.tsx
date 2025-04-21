import Header from '@/app/components/Header'
import { db } from '@/lib/db'
import { ShareLink } from '@/app/components/ui/ShareLink'
import { headers } from 'next/headers'
import { ChatInterface } from '@/app/components/ui/ChatInterface'

export default async function ReviewPage({
  params
}: {
  params: { sessionId: string }
}) {
  const session = await db.getSession(params.sessionId)
  const headersList = headers()
  const host = headersList.get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const shareUrl = `${protocol}://${host}/submit/${params.sessionId}`

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

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Header />
        </div>
        <h1 className="text-4xl font-bold text-center mb-8">
          Review Content
        </h1>
        <p className="text-lg text-gray-600 mb-8 px-4 text-justify leading-relaxed">
          Ask questions about the content submitted by the submitter.
          Answers will be AI-generated based on the submitted content and shared with you. 
          The submitted content will remain private and will not be shared with you.
        </p> 
        <div className="space-y-8">
          <div className="space-y-4">
              {/* // TODO: Add a button to add more questions
              // If Submitter created session, should we say 'No questions provided'? */}
            {session.questionMap != null && 
              <>
                <h2 className="text-2xl font-semibold">Questions</h2>
                {Object.entries(session.questionMap).map(([question, answer], index) => (
                  <div key={index} className="flex items-baseline space-x-3">
                    <span className="text-blue-500 font-bold">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{question}</p>
                      <p className="mt-1 text-gray-700 italic">{answer ? answer : "[No answer provided]"}</p>
                    </div>
                  </div>
                ))}
              </>
            }
          </div>
          {session.filePaths && session.filePaths.length > 0 ? (
            <>
            <ChatInterface sessionId={params.sessionId} />
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  No content has been submitted yet. Please wait for the submitter to provide their evidence.
                </p>
              </div>
              <ShareLink 
                url={shareUrl}
                title="Share with Content Submitter"
                description="Share this link with the person who needs to submit content:"
                variant="info"
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
} 