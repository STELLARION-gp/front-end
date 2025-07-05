import { useState, useEffect, useCallback } from 'react';
import type { ChatbotAPIConfig } from './chatbotConfig';
import { getChatbotConfig, formatAPIRequest, parseAPIResponse } from './chatbotConfig';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isTyping?: boolean;
}

export const useChatbot = (config?: ChatbotAPIConfig) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            text: '👋 Hello! I\'m AstroBot, your space exploration assistant. How can I help you today?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // Use provided config or get from environment
    const chatbotConfig = config || getChatbotConfig();

    // Load messages from localStorage on hook initialization
    useEffect(() => {
        const savedMessages = localStorage.getItem('chatbot_messages');
        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages).map((msg: ChatMessage & { timestamp: string }) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                }));
                setMessages(parsedMessages);
            } catch (error) {
                console.error('Error loading saved messages:', error);
            }
        }
    }, []);

    // Save messages to localStorage whenever messages change
    useEffect(() => {
        if (messages.length > 1) {
            localStorage.setItem('chatbot_messages', JSON.stringify(messages));
        }
    }, [messages]);

    const generateMessageId = useCallback(() => {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }, []);

    const clearMessages = useCallback(() => {
        const welcomeMessage: ChatMessage = {
            id: '1',
            text: '👋 Hello! I\'m AstroBot, your space exploration assistant. How can I help you today?',
            sender: 'bot',
            timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
        localStorage.removeItem('chatbot_messages');
    }, []);

    // Rule-based response system (can be replaced with API calls)
    const getRuleBasedResponse = useCallback((userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        // Space-related responses
        if (lowerMessage.includes('mars') || lowerMessage.includes('red planet')) {
            return '🔴 Mars is the fourth planet from the Sun and is often called the "Red Planet" due to its reddish appearance. It has the largest volcano in the solar system, Olympus Mons, and evidence suggests it once had liquid water on its surface!';
        }

        if (lowerMessage.includes('moon') || lowerMessage.includes('lunar')) {
            return '🌙 The Moon is Earth\'s only natural satellite and plays a crucial role in our planet\'s tides. It\'s moving away from Earth at about 3.8 cm per year. Did you know the Moon always shows the same face to Earth due to tidal locking?';
        }

        if (lowerMessage.includes('sun') || lowerMessage.includes('solar')) {
            return '☀️ The Sun is a massive ball of hot plasma that provides energy for life on Earth. It\'s about 4.6 billion years old and will continue shining for another 5 billion years. Every second, it converts 600 million tons of hydrogen into helium!';
        }

        if (lowerMessage.includes('satellite') || lowerMessage.includes('orbit')) {
            return '🛰️ Satellites are objects that orbit around larger celestial bodies. Earth has thousands of artificial satellites that help us with communication, navigation, weather monitoring, and space exploration. STELLARION helps track and manage these important space assets!';
        }

        if (lowerMessage.includes('stellarion') || lowerMessage.includes('platform')) {
            return '🚀 STELLARION is your comprehensive space exploration platform! We provide satellite tracking, space mission management, and educational resources about our universe. How can I help you explore the cosmos today?';
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return '👋 Hello there, space explorer! I\'m here to help you learn about space, satellites, and our amazing universe. What would you like to know?';
        }

        if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return '🤖 I can help you with:\n• Information about planets, moons, and stars\n• Satellite tracking and space missions\n• Space exploration facts and trivia\n• STELLARION platform features\n• General astronomy questions\n\nWhat interests you most?';
        }

        // Default responses
        const defaultResponses = [
            '🌌 That\'s an interesting question about space! While I specialize in astronomy and space exploration, I\'d love to help you learn more about the universe. Could you ask me something about planets, satellites, or space missions?',
            '✨ Great question! I\'m focused on helping with space-related topics. Feel free to ask me about the solar system, satellites, or how STELLARION can help with space exploration!',
            '🔭 I\'m your space exploration assistant! While I might not have all the answers, I can definitely help with astronomy, satellite information, and space science. What cosmic topic interests you?'
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }, []);

    // API-based response (for production use)
    const getAPIResponse = useCallback(async (userMessage: string): Promise<string> => {
        if (!chatbotConfig?.apiEndpoint) {
            throw new Error('API endpoint not configured');
        }

        const requestBody = formatAPIRequest(chatbotConfig, userMessage, 'space_exploration_assistant');

        const response = await fetch(chatbotConfig.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(chatbotConfig.apiKey && { 'Authorization': `Bearer ${chatbotConfig.apiKey}` }),
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return parseAPIResponse(chatbotConfig, data);
    }, [chatbotConfig]);

    const sendMessage = useCallback(async (userMessage: string) => {
        if (!userMessage.trim() || isLoading) return;

        const newUserMessage: ChatMessage = {
            id: generateMessageId(),
            text: userMessage.trim(),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        // Add typing indicator
        const typingMessage: ChatMessage = {
            id: 'typing',
            text: 'AstroBot is thinking...',
            sender: 'bot',
            timestamp: new Date(),
            isTyping: true,
        };
        setMessages(prev => [...prev, typingMessage]);

        try {
            let botResponse: string;

            // Try API response first, fall back to rule-based
            if (chatbotConfig?.apiEndpoint) {
                try {
                    botResponse = await getAPIResponse(userMessage);
                } catch (apiError) {
                    console.warn('API request failed, falling back to rule-based response:', apiError);
                    botResponse = getRuleBasedResponse(userMessage);
                }
            } else {
                botResponse = getRuleBasedResponse(userMessage);
            }

            // Remove typing indicator and add actual response
            setMessages(prev => {
                const filtered = prev.filter(msg => msg.id !== 'typing');
                return [...filtered, {
                    id: generateMessageId(),
                    text: botResponse,
                    sender: 'bot',
                    timestamp: new Date(),
                }];
            });
        } catch (error) {
            console.error('Error getting bot response:', error);
            setMessages(prev => {
                const filtered = prev.filter(msg => msg.id !== 'typing');
                return [...filtered, {
                    id: generateMessageId(),
                    text: 'Sorry, I encountered an error. Please try again later.',
                    sender: 'bot',
                    timestamp: new Date(),
                }];
            });
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, generateMessageId, chatbotConfig, getAPIResponse, getRuleBasedResponse]);

    return {
        messages,
        isLoading,
        sendMessage,
        clearMessages,
    };
};
