import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "")

export const PRIVACY_LEVELS = {
  NO_PRIVACY: "NO_PRIVACY",
  LOW_PRIVACY: "LOW_PRIVACY",
  MEDIUM_PRIVACY: "MEDIUM_PRIVACY",
  HIGH_PRIVACY: "HIGH_PRIVACY",
} as const;

export type PrivacyLevel = keyof typeof PRIVACY_LEVELS;

export const SYSTEM_PROMPTS: Record<PrivacyLevel, string> = {
  NO_PRIVACY: `You are analyzing information that is not private or sensitive. 
You can freely share all content directly, quote from it, and provide complete details.
Answer questions comprehensively using all available information.
If the question cannot be answered based on the evidence, respond with "I cannot answer that based on the evidence provided.`,

  LOW_PRIVACY: `You are analyzing information with minimal sensitivity.
You can share general content and summaries, but avoid direct quotes of personal details.
When answering questions, you can reference most information but use discretion with personally identifiable information.
If asked to reveal the content directly, respond with "I cannot share the original document.
If the question cannot be answered based on the evidence, respond with "I cannot answer that based on the evidence provided.`,

  MEDIUM_PRIVACY: `You are analyzing information with moderate sensitivity.
You can describe general themes and conclusions without direct quotes or specific details.
When answering, focus on high-level insights and avoid mentioning specific names, dates, or identifiable information.
If asked to reveal the content directly, respond with "I cannot share the original document.
If the question cannot be answered based on the evidence, respond with "I cannot answer that based on the evidence provided.`,

  HIGH_PRIVACY: `You are a gatekeeper of private information. You have been given a piece of confidential evidence, which may include text and/or images.
Only answer questions based on what the evidence *implies*, without revealing the content directly.
Do NOT quote or summarize the document. Only describe properties or answer with reasoning.
If asked to reveal the content directly, respond with "I cannot share the original document.
If the question cannot be answered based on the evidence, respond with "I cannot answer that based on the evidence provided."`,
};

// Privacy Level Explanations for Reviewers/Submitters
export const PRIVACY_LEVEL_DESCRIPTIONS = {
  NO_PRIVACY: "Suitable for public information. Responses may reference content directly, including quotes and complete details.",
  
  LOW_PRIVACY: "For minimally sensitive content. Responses may provide summaries and general information while avoiding direct quotes of personal details.",
  
  MEDIUM_PRIVACY: "For moderately sensitive information. Responses may only discuss themes and conclusions without revealing specific details or direct quotes.",
  
  HIGH_PRIVACY: "Maximum protection for confidential content. Responses may only answer about what the evidence implies without revealing actual content."
};

const MODEL_RESPONSES = {
      NO_PRIVACY: "I understand. I will analyze the information completely and share all relevant content to answer your questions.",
      LOW_PRIVACY: "I understand. I will share general content and summaries while using discretion with personal details.",
      MEDIUM_PRIVACY: "I understand. I will focus on themes and conclusions without sharing specific details or direct quotes.",
      HIGH_PRIVACY: "I understand. I will act as a gatekeeper and only provide information about the evidence without revealing its contents directly."
    }

export function getMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'heic': 'image/heic',
    'pdf': 'application/pdf',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  }
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
} 

export function getChatModel() {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
}

export async function getChatResponseForQuestion(
    model: GenerativeModel,
    messageParts: (string | { text: string } | { inlineData: { mimeType: string; data: string } })[],
    question: string,
    privacyLevel: PrivacyLevel = PRIVACY_LEVELS.HIGH_PRIVACY
) {
    messageParts.push({ text: `\nQuestion: ${question}` })

    const chat = model.startChat({
      history: [
        {
        role: "user",
        parts: SYSTEM_PROMPTS[privacyLevel],
        },
        {
        role: "model",
        parts: MODEL_RESPONSES[privacyLevel],
        },
      ],
      })


    console.log("Sending message to Gemini API...")
    const result = await chat.sendMessage(messageParts)
    console.log("Received response from Gemini API")

    const answer = result.response.text()
    console.log("Generated answer:", answer)

    return NextResponse.json({ answer })

}