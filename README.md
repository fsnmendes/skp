# SKP: SomeKnowledgeProof

An insecure platform for evidence verification where Party A can submit evidence and Party B can verify it without ever seeing the actual content. Built with Next.js, TypeScript, and Google's Gemini AI.

## Features

- 🔒 Secure evidence submission and verification
- 🖼️ Support for multiple file types:
  - Images (JPG, PNG, GIF)
  - Documents (PDF, DOC, DOCX, TXT)
  - Audio (MP3, WAV)
  - Video (MP4, MOV)
- 🤖 AI-powered verification using Google's Gemini
- 📱 Modern, responsive UI with Tailwind CSS
- 🔐 Secure session management
- 🎯 Focused verification process

## Security Considerations

- Evidence is never revealed to Party B
- All file uploads are validated and sanitized
- Sessions are managed securely
- Prompt injection detection
- File size limits and type validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fsnmendes/skp.git
   cd skp 
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_AI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Submit Evidence (Party A)**
   - Click "Submit Evidence"
   - Upload your evidence file
   - Optionally add text evidence
   - Get your session ID

2. **Verify Evidence (Party B)**
   - Click "Verify Evidence"
   - Enter the session ID
   - Ask questions about the evidence
   - Get AI-powered responses

## File Size Limits

- Images: 5MB
- Documents: 10MB
- Audio: 20MB
- Video: 50MB

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 

## TODO
- ~~After submitting content, add option to go to 'Review Content' link~~
- Give Content Submitter options to restrict types of questions asked by reviewer (show this to reviewer)
- Allow reviewer to generate questions to submit, send link to content submitter to provide evidence, and get answers from llm
- Let content submitter strike down reviewer questions (notify review in review session)
- Give content submitter option to enable/disable chat interface
- Add ability to resubmite/revise submitted content
- Allow reviewers to add more questions, adjust questions
   - Make question/answer in json format with flag for submitter removing questions
- In both cases, make version/content history explicit
- Get new session ID from API not frontend, update frontend state accordingly
- Change default text when question not yet answered
- Add 'loading state' when content submitted but llm stil answering questions
- Play around with system prompts
- Let content submitter select different levels of secrecy on slider
