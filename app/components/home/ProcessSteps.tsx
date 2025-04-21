interface ProcessStepsProps {
  steps: string[]
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <ul className="space-y-3 text-gray-600">
      {steps.map((step, index) => (
        <li key={index} className="flex items-start gap-2">
          <span className="text-blue-500">{index + 1}.</span>
          <span>{step}</span>
        </li>
      ))}
    </ul>
  )
} 