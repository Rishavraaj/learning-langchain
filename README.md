# AI-Powered Content Analysis Platform

This platform provides intelligent content analysis for YouTube videos using LangChain and GPT models.

## Features

### YouTube Content Analysis
- **Video Search**: Search for YouTube videos directly within the platform
- **Transcript Analysis**: Get detailed analysis of video transcripts including:
  - Concise summaries
  - Key points extraction
  - Main topics identification
- **Sentiment Analysis**: Analyze video comments to understand:
  - Overall sentiment (positive/negative/neutral)
  - Key themes in comments
  - Most discussed aspects
- **Trend Analysis**: Get insights from video metrics:
  - Engagement analysis
  - Performance indicators
  - Areas for improvement

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd [repository-name]
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```env
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_EMAIL=your_google_client_email
GOOGLE_PRIVATE_KEY=your_google_private_key
GOOGLE_PROJECT_ID=your_project_id
```

4. Run the development server:
```bash
npm run dev
```

## Usage

1. Navigate to `/youtube` in your browser
2. Search for a YouTube video using the search bar
3. Click "Analyze Video" on any search result
4. View the comprehensive analysis including:
   - Video transcript
   - Comment analysis
   - Engagement metrics
   - AI-powered insights

## Technical Details

- Built with Next.js 13+ and TypeScript
- Uses LangChain for AI processing
- Integrates with YouTube Data API
- GPT-3.5-turbo for content analysis
- Handles large content through intelligent chunking

## API Endpoints

### `/api/youtube/search`
- Search for YouTube videos
- Query params: `query` (search term)

### `/api/youtube/video-data`
- Get detailed video information
- Query params: `videoId`

### `/api/content-analysis`
- Analyze video content
- POST request with:
  ```typescript
  {
    type: "transcript" | "sentiment" | "trends",
    data: {
      transcript?: string,
      comments?: string[],
      metrics?: {
        views: number,
        likes: number,
        commentCount: number
      }
    }
  }
  ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
