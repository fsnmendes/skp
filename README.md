# SomeKnowledgeProof

A secure platform for verifying confidential evidence using LLMs as trusted intermediaries.

## Features

- Party A can submit confidential evidence
- Party B can verify evidence properties through an LLM
- Evidence is never directly revealed to Party B
- Secure session-based communication
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- OpenAI API key

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/some-knowledge-proof.git
   cd some-knowledge-proof
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Submit Evidence (Party A)**
   - Navigate to the home page
   - Paste your confidential evidence in the text area
   - Click "Submit Evidence"
   - Share the generated session link with Party B

2. **Verify Evidence (Party B)**
   - Open the session link provided by Party A
   - Ask questions about the evidence
   - The LLM will respond based on the evidence without revealing it directly

## Security Considerations

- Evidence is stored in a local SQLite database
- Sessions are identified by UUIDs
- The LLM is instructed to never reveal the original evidence
- No authentication is required for this MVP version

## License

MIT 