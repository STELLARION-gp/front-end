2. **With API Integration**:
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Add your API configuration
   REACT_APP_CHATBOT_PROVIDER=openai
   REACT_APP_CHATBOT_API_KEY=your_api_key_here
   ```

## API Integration Options

### Option 1: OpenAI (Recommended - Most Advanced)
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Get your API key from the API Keys section
3. Configure environment:
   ```env
   REACT_APP_CHATBOT_PROVIDER=openai
   REACT_APP_CHATBOT_API_KEY=your_openai_api_key
   ```
   - **Model**: Uses GPT-3.5-turbo for fast, high-quality responses
   - **Cost**: ~$0.002 per 1K tokens (very affordable for most use cases)
   - **Features**: Advanced reasoning, context awareness, space knowledge

### Option 2: Cohere (Free Tier Available)
1. Sign up at [cohere.ai](https://cohere.ai)
2. Get your free API key
3. Configure environment:
   ```env
   REACT_APP_CHATBOT_PROVIDER=cohere
   REACT_APP_CHATBOT_API_KEY=your_cohere_api_key
   ```

### Option 3: Hugging Face (Free Tier Available)
1. Sign up at [huggingface.co](https://huggingface.co)
2. Get your API token
3. Configure environment:
   ```env
   REACT_APP_CHATBOT_PROVIDER=huggingface
   REACT_APP_CHATBOT_API_KEY=your_hf_token
   ```

### Option 4: Custom Backend API
If you want to implement your own backend API, here's what you need:

#### Backend API Requirements
Create an endpoint that accepts POST requests with this format:

**Request:**
```json
{
  "message": "user message text",
  "context": "space_exploration_assistant",
  "model": "stellarion-assistant"
}
```

**Response:**
```json
{
  "response": "bot response text"
}
```

#### Example Backend Implementation (Node.js/Express)
```javascript
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    // Your AI processing logic here
    // This could call OpenAI, Anthropic, or any other AI service
    const aiResponse = await callYourAIService(message, context);
    
    res.json({
      response: aiResponse
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process message'
    });
  }
});
```

#### Backend Environment Configuration
```env
REACT_APP_CHATBOT_PROVIDER=custom
REACT_APP_CHATBOT_API_KEY=optional_api_key
```

Update the API endpoint in `chatbotConfig.ts`:
```typescript
custom: {
  provider: 'custom',
  apiEndpoint: 'http://localhost:3001/api/chatbot', // Your backend URL
  model: 'stellarion-assistant',
}
```

## Customization

### Adding New Rule-based Responses
Edit the `getRuleBasedResponse` function in `useChatbot.ts`:

```typescript
if (lowerMessage.includes('your_keyword')) {
  return 'Your custom response here';
}
```

### Styling Customization
Modify `_chatbot.scss` to match your theme:
- Update color variables
- Modify animations and transitions
- Adjust layout and spacing

### API Provider Integration
Add new providers in `chatbotConfig.ts`:

```typescript
yourProvider: {
  provider: 'yourProvider',
  apiEndpoint: 'https://api.yourprovider.com/chat',
  model: 'your-model',
}
```

## Built-in Knowledge Base

The chatbot comes with pre-programmed responses for:
- **Mars**: Information about the Red Planet
- **Moon**: Lunar facts and exploration
- **Sun**: Solar system's star details
- **Satellites**: Orbital mechanics and tracking
- **STELLARION**: Platform features and capabilities
- **General Space**: Astronomy and space exploration

## Browser Compatibility
- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## Dependencies
- React 18+
- TypeScript
- Lucide React (for icons)
- SCSS support

## Performance Considerations
- Messages are stored in localStorage (10MB limit)
- API calls are debounced and have fallback mechanisms
- Component is optimized for re-renders
- Large message histories are handled efficiently

## Security Notes
- API keys are stored in environment variables
- No sensitive data is logged to console in production
- CORS considerations for API endpoints
- Input validation and sanitization

## Troubleshooting

### Common Issues
1. **API calls failing**: Check network connectivity and API key validity
2. **Styles not loading**: Ensure SCSS compilation is configured
3. **Messages not persisting**: Check localStorage availability
4. **TypeScript errors**: Ensure all dependencies are properly typed

### Debug Mode
Enable detailed logging by setting:
```env
REACT_APP_DEBUG_CHATBOT=true
```

## Contributing
When contributing to the chatbot:
1. Follow TypeScript best practices
2. Add proper error handling
3. Update tests for new features
4. Maintain backward compatibility
5. Update documentation

## License
This chatbot implementation is part of the STELLARION project and follows the same licensing terms.
