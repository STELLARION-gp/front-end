// Chatbot API Configuration
// This file contains configuration for different AI API providers

export interface ChatbotAPIConfig {
    provider: 'openai' | 'cohere' | 'huggingface' | 'custom';
    apiKey?: string;
    apiEndpoint: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
}

// Configuration for different providers
export const API_CONFIGS: Record<string, ChatbotAPIConfig> = {
    // OpenAI (paid service)
    openai: {
        provider: 'openai',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        maxTokens: 150,
        temperature: 0.7,
    },

    // Cohere (Free tier available)
    cohere: {
        provider: 'cohere',
        apiEndpoint: 'https://api.cohere.ai/v1/generate',
        model: 'command-light', // Free tier model
        maxTokens: 100,
        temperature: 0.7,
    },

    // Hugging Face (Free tier available)
    huggingface: {
        provider: 'huggingface',
        apiEndpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        maxTokens: 100,
        temperature: 0.7,
    },

    // Custom backend endpoint (your own API)
    custom: {
        provider: 'custom',
        apiEndpoint: '/api/chatbot', // Your backend endpoint
        model: 'stellarion-assistant',
    },
};

// Environment-based configuration
export const getChatbotConfig = (): ChatbotAPIConfig | null => {
    // Check if environment variables are set (Vite environment variables)
    const provider = import.meta.env.VITE_CHATBOT_PROVIDER as keyof typeof API_CONFIGS;
    const apiKey = import.meta.env.VITE_CHATBOT_API_KEY;

    if (provider && API_CONFIGS[provider]) {
        return {
            ...API_CONFIGS[provider],
            apiKey,
        };
    }

    // Return null to use rule-based responses
    return null;
};

// API call helpers for different providers
export const formatAPIRequest = (config: ChatbotAPIConfig, message: string, context?: string) => {
    switch (config.provider) {
        case 'openai':
            return {
                model: config.model || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are AstroBot, a helpful space exploration assistant for the STELLARION platform. ${context ? `Context: ${context}` : ''} Keep responses concise, informative, and space-themed.`
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: config.maxTokens,
                temperature: config.temperature,
            };

        case 'cohere':
            return {
                prompt: `${context ? `Context: ${context}\n\n` : ''}Human: ${message}\nAssistant:`,
                max_tokens: config.maxTokens,
                temperature: config.temperature,
                model: config.model,
                stop_sequences: ['Human:'],
            };

        case 'huggingface':
            return {
                inputs: message,
                parameters: {
                    max_length: config.maxTokens,
                    temperature: config.temperature,
                },
            };

        case 'custom':
            return {
                message,
                context: context || 'space_exploration_assistant',
                model: config.model,
            };

        default:
            return { message };
    }
};

// API Response types
interface OpenAIResponse {
    choices?: Array<{ message: { content: string } }>;
}

interface CohereResponse {
    generations?: Array<{ text: string }>;
}

interface HuggingFaceResponse {
    generated_text?: string;
    0?: { generated_text: string };
}

interface CustomResponse {
    response?: string;
    message?: string;
}

type APIResponse = OpenAIResponse | CohereResponse | HuggingFaceResponse | CustomResponse;

export const parseAPIResponse = (config: ChatbotAPIConfig, response: APIResponse): string => {
    switch (config.provider) {
        case 'openai': {
            const openaiResponse = response as OpenAIResponse;
            return openaiResponse.choices?.[0]?.message?.content?.trim() || 'Sorry, I couldn\'t generate a response.';
        }

        case 'cohere': {
            const cohereResponse = response as CohereResponse;
            return cohereResponse.generations?.[0]?.text?.trim() || 'Sorry, I couldn\'t generate a response.';
        }

        case 'huggingface': {
            const hfResponse = response as HuggingFaceResponse;
            return hfResponse.generated_text || hfResponse[0]?.generated_text || 'Sorry, I couldn\'t generate a response.';
        }

        case 'custom': {
            const customResponse = response as CustomResponse;
            return customResponse.response || customResponse.message || 'Sorry, I couldn\'t generate a response.';
        }

        default: {
            const defaultResponse = response as CustomResponse;
            return defaultResponse.message || 'Sorry, I couldn\'t generate a response.';
        }
    }
};
