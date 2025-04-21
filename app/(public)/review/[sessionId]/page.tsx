import Header from '@/app/components/ui/Header'
import { db } from '@/lib/db'
import { ShareLink } from '@/app/components/ui/ShareLink'
import { headers } from 'next/headers'
import { ChatInterface } from '@/app/components/ui/ChatInterface'
import { PRIVACY_LEVEL_DESCRIPTIONS } from '@/app/api/utils'

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
          Answers will be generated based on the submitted content and shared with you. 
          The submitted content will remain private and will not be shared with you.
        </p> 
        <div className="space-y-8">
            <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                session.privacyLevel === 'NO_PRIVACY' ? 'bg-red-500' : 
                session.privacyLevel === 'LOW_PRIVACY' ? 'bg-orange-500' : 
                session.privacyLevel === 'MEDIUM_PRIVACY' ? 'bg-yellow-500' :
                session.privacyLevel === 'HIGH_PRIVACY' ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
                <div className="ml-2 flex flex-col"></div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Privacy Level:</span>
                  <span className="capitalize">
                  {session.privacyLevel?.replace('_', ' ').toLowerCase()}
                  </span>
                </div>
            </div>
                <p className="text-sm text-gray-600 mt-1">
                  {session.privacyLevel === 'NO_PRIVACY' ? PRIVACY_LEVEL_DESCRIPTIONS.NO_PRIVACY :
                  session.privacyLevel === 'LOW_PRIVACY' ? PRIVACY_LEVEL_DESCRIPTIONS.LOW_PRIVACY :
                  session.privacyLevel === 'MEDIUM_PRIVACY' ? PRIVACY_LEVEL_DESCRIPTIONS.MEDIUM_PRIVACY :
                  session.privacyLevel === 'HIGH_PRIVACY' ? PRIVACY_LEVEL_DESCRIPTIONS.HIGH_PRIVACY :
                  'Unknown privacy level'}
                </p>
            </div>
           
            
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