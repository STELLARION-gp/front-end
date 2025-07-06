# STELLARION Chatbot API Documentation

## Overview
This document outlines the API endpoints required for the STELLARION chatbot backend integration. The frontend chatbot component expects these endpoints to be implemented in your existing backend.

## Required Environment Variables (Frontend)
```env
VITE_CHATBOT_API_URL=http://localhost:3000/api  # Your backend API base URL
VITE_CHATBOT_PROVIDER=openai                     # AI provider (openai, anthropic, etc.)
VITE_CHATBOT_API_KEY=your_openai_api_key        # Only if using direct API calls (not recommended)
```

## API Endpoints

### 1. Chat Completion Endpoint
**Endpoint:** `POST /api/chatbot`

**Purpose:** Process user messages and return AI-generated responses

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer <optional_user_token>  # If you want user authentication
```

**Request Body:**
```json
{
  "message": "What is the distance between Earth and Mars?",
  "context": "space_exploration_assistant",
  "conversationId": "optional_conversation_uuid",
  "userId": "optional_user_id"
}
```

**Request Parameters:**
- `message` (required, string): The user's chat message
- `context` (required, string): Context identifier for the AI assistant. Always "space_exploration_assistant"
- `conversationId` (optional, string): UUID for conversation tracking
- `userId` (optional, string): User identifier for personalization

**Success Response (200 OK):**
```json
{
  "success": true,
  "response": "The distance between Earth and Mars varies greatly depending on their positions in orbit. At their closest approach, they are about 35 million miles apart, while at their farthest, they can be up to 250 million miles apart.",
  "conversationId": "uuid_of_conversation",
  "timestamp": "2025-07-05T10:30:00Z"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Failed to process message",
  "details": "Optional detailed error message"
}
```

### 2. Health Check Endpoint
**Endpoint:** `GET /api/chatbot/health`

**Purpose:** Check if the chatbot service is operational

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-07-05T10:30:00Z",
  "aiProvider": "openai",
  "version": "1.0.0"
}
```

### 3. Optional: Conversation History
**Endpoint:** `GET /api/chatbot/conversations/{conversationId}`

**Purpose:** Retrieve conversation history (if you want to implement conversation persistence)

**Response (200 OK):**
```json
{
  "conversationId": "uuid",
  "messages": [
    {
      "id": "msg_uuid",
      "role": "user",
      "content": "Hello",
      "timestamp": "2025-07-05T10:25:00Z"
    },
    {
      "id": "msg_uuid_2",
      "role": "assistant",
      "content": "Hello! I'm your space exploration assistant. How can I help you today?",
      "timestamp": "2025-07-05T10:25:05Z"
    }
  ]
}
```

## Backend Implementation Requirements

### AI Provider Integration
You'll need to integrate with an AI provider. Here are the most common options:

#### Option 1: OpenAI GPT (Recommended)
```javascript
// Example Node.js implementation
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chatbot', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system", 
          content: "You are STELLARION, an expert space exploration assistant. Provide accurate, engaging information about space, astronomy, space missions, and related topics. Keep responses concise but informative."
        },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    res.json({
      success: true,
      response: completion.choices[0].message.content,
      conversationId: req.body.conversationId || generateUUID(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to process message",
      details: error.message
    });
  }
});
```

#### Option 2: Anthropic Claude
```javascript
const Anthropic = require('@anthropic-ai/sdk');
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Similar implementation with Claude API
```

#### Option 3: Google Gemini
```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Similar implementation with Gemini API
```

### System Prompt Recommendation
Use this system prompt for consistent space-themed responses:

```
You are STELLARION, an expert space exploration assistant and educational companion. You specialize in:

- Space exploration missions and history
- Astronomy and astrophysics concepts
- Spacecraft technology and engineering
- Planetary science and exoplanets
- Space agencies (NASA, ESA, SpaceX, etc.)
- Current space news and developments
- Space career guidance and education

Guidelines:
- Provide accurate, scientifically sound information
- Make complex topics accessible and engaging
- Include relevant examples and analogies
- Encourage curiosity about space exploration
- Keep responses conversational but informative
- If uncertain about facts, acknowledge limitations
- Stay focused on space and astronomy topics
```

## Frontend Integration Details

The frontend chatbot service (`src/services/chatbotService.ts`) will:

1. Make requests to your `/api/chatbot` endpoint
2. Handle loading states and error responses
3. Fall back to rule-based responses if API fails
4. Display typing indicators during API calls

## CORS Configuration

Make sure your backend allows requests from your frontend domain:

```javascript
// Express.js example
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

## Rate Limiting (Recommended)

Implement rate limiting to prevent abuse:

```javascript
// Express.js with express-rate-limit
const rateLimit = require('express-rate-limit');

const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: 'Too many chat requests, please try again later.'
});

app.use('/api/chatbot', chatbotLimiter);
```

## Error Handling

The frontend expects specific error response formats. Make sure to return:

```json
{
  "success": false,
  "error": "Human readable error message",
  "details": "Technical details (optional)"
}
```

## Testing

You can test your endpoints using:

```bash
# Health check
curl http://localhost:3000/api/chatbot/health

# Chat message
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about Mars", "context": "space_exploration_assistant"}'
```

## Security Considerations

1. **API Key Security**: Store AI provider API keys securely in environment variables
2. **Input Validation**: Validate and sanitize user input
3. **Authentication**: Consider requiring user authentication for chat access
4. **Rate Limiting**: Prevent abuse and control API costs
5. **Content Filtering**: Filter inappropriate content if needed
6. **Logging**: Log requests for monitoring and debugging

## Optional Enhancements

1. **Conversation Persistence**: Store chat history in database
2. **User Personalization**: Customize responses based on user profile
3. **Analytics**: Track chat usage and popular topics
4. **Feedback System**: Allow users to rate responses
5. **Multi-language Support**: Support different languages
6. **File Attachments**: Handle image/document uploads in chat

## Support

If you need help implementing these endpoints, refer to:
- OpenAI API Documentation: https://platform.openai.com/docs
- Anthropic API Documentation: https://docs.anthropic.com
- Google Gemini API Documentation: https://ai.google.dev/docs
