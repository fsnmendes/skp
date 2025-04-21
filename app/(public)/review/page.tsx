import { ReviewQuestionsForm } from '@/app/components/forms/ReviewQuestionsForm'
import Header from '@/app/components/ui/Header'

export default function ReviewPage() {
  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Header />
        </div>
        <h1 className="text-4xl font-bold text-center mb-8">
          Create Review Session
        </h1>
        <p className="text-lg text-gray-600 mb-8 px-4 text-justify leading-relaxed">
          Submit a list of questions that will be answered once the submitter has provided their content.
          Answers will be generated based on the submitted content and shared with you. 
          The submitted content will remain private and will not be shared with you.
        </p>
        <ReviewQuestionsForm />
      </div>
    </>
  )
} 