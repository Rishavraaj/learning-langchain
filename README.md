# Learning LangChain

A modern Next.js application showcasing LangChain integration with OpenAI and Google Calendar API integration. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 🤖 LangChain integration with OpenAI
- 📅 Google Calendar API integration
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 🌙 Dark mode support
- 📱 Fully responsive design
- ⚡ Built with Next.js 15 and TypeScript

## Prerequisites

- Node.js 18+ or Bun runtime
- OpenAI API key
- Google OAuth credentials

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd learning-langchain
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your OpenAI API key
   - Configure Google OAuth credentials
```bash
cp .env.example .env.local
```

Required environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `REDIRECT_URI`: OAuth redirect URI (default: http://localhost:3000/api/auth/callback)

## Development

Run the development server:

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Radix UI primitives
  - Custom shadcn/ui components
- **AI Integration**: LangChain with OpenAI
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Charts**: Recharts
- **Markdown**: React Markdown with GFM support

## Project Structure

- `app/` - Next.js app router pages and layouts
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and configurations
- `public/` - Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT license.
