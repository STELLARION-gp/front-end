// Chatbot API service
import type { ChatbotAPIConfig } from '../hooks/chatbot/chatbotConfig';
import { formatAPIRequest, parseAPIResponse } from '../hooks/chatbot/chatbotConfig';

export class ChatbotService {
    private config: ChatbotAPIConfig;

    constructor(config: ChatbotAPIConfig) {
        this.config = config;
    }

    async sendMessage(message: string, context?: string): Promise<string> {
        try {
            const requestBody = formatAPIRequest(this.config, message, context);

            const response = await fetch(this.config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.config.apiKey && {
                        'Authorization': `Bearer ${this.config.apiKey}`
                    }),
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return parseAPIResponse(this.config, data);
        } catch (error) {
            console.error('ChatbotService: API call failed', error);
            throw error;
        }
    }

    // Health check for the API endpoint
    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(this.config.apiEndpoint, {
                method: 'HEAD',
                headers: {
                    ...(this.config.apiKey && {
                        'Authorization': `Bearer ${this.config.apiKey}`
                    }),
                },
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Get service configuration (without sensitive data)
    getConfig() {
        return {
            provider: this.config.provider,
            endpoint: this.config.apiEndpoint,
            model: this.config.model,
            hasApiKey: !!this.config.apiKey,
        };
    }
}
