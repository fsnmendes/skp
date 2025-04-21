import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

export const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || "")

export const SYSTEM_PROMPT = `You are a gatekeeper of private information. You have been given a piece of confidential evidence, which may include text and/or images.
Only answer questions based on what the evidence *implies*, without revealing the content directly.
Do NOT quote or summarize the document. Only describe properties or answer with reasoning.
If asked to reveal the content directly, respond with "I cannot share the original document."
If the question cannot be answered based on the evidence, respond with "I cannot answer that based on the evidence provided."`


export function getMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
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
  return mimeTypes[extension] || 'application/octet-stream'
} 

export function getChatModel() {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
}

export async function getChatResponseForQuestion(
    model: GenerativeModel,
    messageParts: (string | { text: string } | { inlineData: { mimeType: string; data: string } })[],
    question: string,
) {
    messageParts.push({ text: `\nQuestion: ${question}` })
    const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: SYSTEM_PROMPT,
          },
          {
            role: "model",
            parts: "I understand. I will act as a gatekeeper and only provide information about the evidence without revealing its contents directly.",
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