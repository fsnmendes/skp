'use client'

interface ShareLinkProps {
  url: string
  title?: string
  description?: string
  variant?: 'success' | 'info'
}

export function ShareLink({ url, title = 'Share Link', description = 'Share this link:', variant = 'info' }: ShareLinkProps) {
  const bgColor = variant === 'success' ? 'bg-green-50' : 'bg-blue-50'
  const borderColor = variant === 'success' ? 'border-green-200' : 'border-blue-200'
  const textColor = variant === 'success' ? 'text-green-800' : 'text-blue-800'
  const textColorSecondary = variant === 'success' ? 'text-green-700' : 'text-blue-700'

  return (
      <div className={`p-4 ${bgColor} border ${borderColor} rounded-lg`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-2`}>{title}</h3>
        <p className={`${textColorSecondary} mb-4`}>{description}</p>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 p-2 border border-gray-300 rounded-lg bg-white"
          />
          <button
            onClick={() => navigator.clipboard.writeText(url)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Copy Link
          </button>
        </div>
      </div>
  )
} 