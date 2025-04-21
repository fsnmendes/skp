"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { PRIVACY_LEVEL_DESCRIPTIONS, PRIVACY_LEVELS, PrivacyLevel } from "@/app/api/utils"

interface FilePreview {
  type: 'image' | 'document' | 'audio' | 'video'
  name: string
  url: string
}

interface EvidenceFormProps {
  sessionId: string
}

export function EvidenceForm({ sessionId}: EvidenceFormProps) {
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(PRIVACY_LEVELS.HIGH_PRIVACY)
  const [evidence, setEvidence] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileType = (file: File): FilePreview['type'] => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('audio/')) return 'audio'
    if (file.type.startsWith('video/')) return 'video'
    return 'document'
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...newFiles])

    // Create previews for the new files
    newFiles.forEach(file => {
      const fileType = getFileType(file)
      if (fileType === 'image') {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreviews(prev => [...prev, {
            type: 'image',
            name: file.name,
            url: reader.result as string
          }])
        }
        reader.readAsDataURL(file)
      } else {
        setFilePreviews(prev => [...prev, {
          type: fileType,
          name: file.name,
          url: URL.createObjectURL(file)
        }])
      }
    })
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("sessionId", sessionId)
      if (evidence) formData.append("evidence", evidence)
      files.forEach(file => {
        formData.append("files", file)
      })
      formData.append("privacyLevel", privacyLevel)

      formData.append("privacyLevel", "HIGH_PRIVACY")

      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit evidence")
      }
      setSubmissionSuccess(true)
    } catch (error) {
      console.error("Error submitting evidence:", error)
      alert("Failed to submit evidence. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setFilePreviews(prev => prev.filter((_, i) => i !== index))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (submissionSuccess) {
    const reviewUrl = `${window.location.origin}/review/${sessionId}`
    return (
      <div className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
            Content Submitted Successfully!
            </h3>
          <p className="text-green-700 mb-4">
            You can now view the review session or share the link with others.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={reviewUrl}
                readOnly
                className="flex-1 p-2 border border-gray-300 rounded-lg bg-white"
              />
              <button
                onClick={() => navigator.clipboard.writeText(reviewUrl)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
        <button
              onClick={() => router.push(reviewUrl)}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
            >
              View Review Session
            </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label
          htmlFor="evidence"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Additional Evidence (Optional)
        </label>
        <textarea
          id="evidence"
          value={evidence}
          onChange={(e) => setEvidence(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Enter any additional evidence here..."
        />
      </div>

      <div>
        <label
          htmlFor="files"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Add Files (Optional)
        </label>
        <input
          type="file"
          id="files"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.txt"
          multiple
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-white
            hover:file:bg-primary/90"
        />
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: Images, PDFs, Documents, Audio, Video
        </p>
      </div>

      {filePreviews.length > 0 && (
        <div className="space-y-4">
          {filePreviews.map((preview, index) => (
            <div key={index} className="relative p-4 bg-gray-50 rounded-lg">
              {preview.type === 'image' && (
                <img
                  src={preview.url}
                  alt="Preview"
                  className="max-h-64 rounded-lg"
                />
              )}
              {preview.type === 'document' && (
                <div className="flex items-center space-x-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>{preview.name}</span>
                </div>
              )}
              {preview.type === 'audio' && (
                <div className="flex items-center space-x-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span>{preview.name}</span>
                </div>
              )}
              {preview.type === 'video' && (
                <div className="flex items-center space-x-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{preview.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <label
          htmlFor="privacyLevel"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Privacy Level
        </label>
        <div className="relative pt-1">
          <input
            type="range"
            id="privacyLevel"
            min="1"
            max="4"
            step="1"
            value={privacyLevel === PRIVACY_LEVELS.NO_PRIVACY ? 1 : 
            privacyLevel === PRIVACY_LEVELS.LOW_PRIVACY ? 2 :
            privacyLevel === PRIVACY_LEVELS.MEDIUM_PRIVACY ? 3 : 4}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value == 1) setPrivacyLevel(PRIVACY_LEVELS.NO_PRIVACY);
              else if (value === 2) setPrivacyLevel(PRIVACY_LEVELS.LOW_PRIVACY);
              else if (value === 3) setPrivacyLevel(PRIVACY_LEVELS.MEDIUM_PRIVACY);
              else setPrivacyLevel(PRIVACY_LEVELS.HIGH_PRIVACY);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>No Privacy</span>
            <span>Low Privacy</span>
            <span>Medium Privacy</span>
            <span>High Privacy</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {privacyLevel === PRIVACY_LEVELS.NO_PRIVACY ? PRIVACY_LEVEL_DESCRIPTIONS.NO_PRIVACY
            :
          privacyLevel === PRIVACY_LEVELS.LOW_PRIVACY 
            ? PRIVACY_LEVEL_DESCRIPTIONS.LOW_PRIVACY
            : privacyLevel === PRIVACY_LEVELS.MEDIUM_PRIVACY 
              ? PRIVACY_LEVEL_DESCRIPTIONS.MEDIUM_PRIVACY
              : PRIVACY_LEVEL_DESCRIPTIONS.HIGH_PRIVACY}
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : "Submit Evidence"}
      </button>
    </form>
  )
} 