import { useState, useEffect, useCallback } from "react";
import type { ChatbotAPIConfig } from "./chatbotConfig";
import { getChatbotConfig } from "./chatbotConfig";
import { apiService } from "../../services/api";
import { auth } from "../../firebase";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isTyping?: boolean;
}

export const useChatbot = (config?: ChatbotAPIConfig) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "👋 Hello! I'm Stella, your space exploration assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Debug: Log initial state
  useEffect(() => {
    console.log("🤖 [INIT] useChatbot initialized, isLoading:", false);
  }, []);

  // Use provided config or get from environment
  const chatbotConfig = config || getChatbotConfig();

  // Load messages from localStorage on hook initialization
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatbot_messages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map(
          (msg: ChatMessage & { timestamp: string }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })
        );
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error loading saved messages:", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("chatbot_messages", JSON.stringify(messages));
    }
  }, [messages]);

  const generateMessageId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }, []);

  const clearMessages = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: "1",
      text: "👋 Hello! I'm AstroBot, your space exploration assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    localStorage.removeItem("chatbot_messages");
  }, []);

  // Rule-based response system (can be replaced with API calls)
  const getRuleBasedResponse = useCallback((userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Space-related responses
    if (lowerMessage.includes("mars") || lowerMessage.includes("red planet")) {
      return '🔴 Mars is the fourth planet from the Sun and is often called the "Red Planet" due to its reddish appearance. It has the largest volcano in the solar system, Olympus Mons, and evidence suggests it once had liquid water on its surface!';
    }

    if (lowerMessage.includes("moon") || lowerMessage.includes("lunar")) {
      return "🌙 The Moon is Earth's only natural satellite and plays a crucial role in our planet's tides. It's moving away from Earth at about 3.8 cm per year. Did you know the Moon always shows the same face to Earth due to tidal locking?";
    }

    if (lowerMessage.includes("sun") || lowerMessage.includes("solar")) {
      return "☀️ The Sun is a massive ball of hot plasma that provides energy for life on Earth. It's about 4.6 billion years old and will continue shining for another 5 billion years. Every second, it converts 600 million tons of hydrogen into helium!";
    }

    if (lowerMessage.includes("satellite") || lowerMessage.includes("orbit")) {
      return "🛰️ Satellites are objects that orbit around larger celestial bodies. Earth has thousands of artificial satellites that help us with communication, navigation, weather monitoring, and space exploration. STELLARION helps track and manage these important space assets!";
    }

    if (
      lowerMessage.includes("stellarion") ||
      lowerMessage.includes("platform")
    ) {
      return "🚀 STELLARION is your comprehensive space exploration platform! We provide satellite tracking, space mission management, and educational resources about our universe. How can I help you explore the cosmos today?";
    }

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey")
    ) {
      return "👋 Hello there, space explorer! I'm here to help you learn about space, satellites, and our amazing universe. What would you like to know?";
    }

    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("what can you do")
    ) {
      return "🤖 I can help you with:\n• Information about planets, moons, and stars\n• Satellite tracking and space missions\n• Space exploration facts and trivia\n• STELLARION platform features\n• General astronomy questions\n\nWhat interests you most?";
    }

    // Default responses
    const defaultResponses = [
      "🌌 That's an interesting question about space! While I specialize in astronomy and space exploration, I'd love to help you learn more about the universe. Could you ask me something about planets, satellites, or space missions?",
      "✨ Great question! I'm focused on helping with space-related topics. Feel free to ask me about the solar system, satellites, or how STELLARION can help with space exploration!",
      "🔭 I'm your space exploration assistant! While I might not have all the answers, I can definitely help with astronomy, satellite information, and space science. What cosmic topic interests you?",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  }, []);

  // API-based response (for production use)
  const getAPIResponse = useCallback(
    async (userMessage: string): Promise<string> => {
      try {
        // Check if user is authenticated
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error(
            "Authentication required. Please sign in to use the chatbot."
          );
        }

        console.log("🤖 Attempting backend request using apiService");
        console.log("🔑 Current user:", currentUser.email);

        // Use apiService which automatically handles Firebase authentication
        const response = await apiService.sendChatMessage(
          userMessage,
          "space_exploration_assistant"
        );

        console.log("🤖 Backend response data:", response);

        // Handle response from apiService
        if ((response as { success?: boolean }).success === false) {
          throw new Error(
            (response as { error?: string; message?: string }).error ||
              (response as { error?: string; message?: string }).message ||
              "Backend returned an error"
          );
        }

        return (
          (response as { response?: string }).response ||
          (response as { message?: string }).message ||
          "Sorry, I couldn't generate a response."
        );
      } catch (backendError) {
        console.warn("🤖 Backend request failed:", backendError);

        // Re-throw the error to be handled by the caller
        throw backendError;
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

      console.log("🤖 [SEND] Starting message send, isLoading:", isLoading);

      const newUserMessage: ChatMessage = {
        id: generateMessageId(),
        text: userMessage.trim(),
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setIsLoading(true);
      console.log("🤖 [SEND] Set isLoading to TRUE");

      // Add typing indicator with dynamic messages
      const typingMessages = [
        "STELLA is analyzing your question...",
        "Searching the cosmos for answers...",
        "Consulting the stellar database...",
        "Processing your space inquiry...",
        "STELLA is thinking...",
      ];
      const randomTypingMessage =
        typingMessages[Math.floor(Math.random() * typingMessages.length)];

      const typingMessage: ChatMessage = {
        id: "typing",
        text: randomTypingMessage,
        sender: "bot",
        timestamp: new Date(),
        isTyping: true,
      };
      setMessages((prev) => [...prev, typingMessage]);

      try {
        let botResponse: string;

        console.log("🤖 Chatbot Config:", {
          hasConfig: !!chatbotConfig,
          hasEndpoint: !!chatbotConfig?.apiEndpoint,
          provider: chatbotConfig?.provider,
        });

        // Always try API response first (through backend)
        console.log("🤖 Attempting API response...");
        try {
          botResponse = await getAPIResponse(userMessage);
          console.log(
            "🤖 API response successful:",
            botResponse.substring(0, 100) + "..."
          );

          // Dispatch event to notify that a chatbot message was sent successfully
          window.dispatchEvent(new CustomEvent("chatbot-message-sent"));
        } catch (apiError: unknown) {
          console.warn(
            "🤖 API request failed, falling back to rule-based response:",
            apiError
          );

          // Check the error type and provide specific feedback
          const errorMessage =
            apiError instanceof Error ? apiError.message : String(apiError);

          if (errorMessage.includes("Authentication required")) {
            botResponse =
              "🔐 Please sign in to access the full AI chatbot features. For now, here's what I can tell you: " +
              getRuleBasedResponse(userMessage);
          } else if (
            errorMessage.includes("unauthorized") ||
            errorMessage.includes("401")
          ) {
            botResponse =
              "🔑 Authentication issue detected. Please try signing out and signing back in. Meanwhile, here's a basic response: " +
              getRuleBasedResponse(userMessage);
          } else if (errorMessage.includes("Rate limit")) {
            botResponse =
              "⏰ I'm experiencing high traffic right now. Here's what I can tell you based on my knowledge: " +
              getRuleBasedResponse(userMessage);
          } else if (
            errorMessage.includes("403") ||
            errorMessage.includes("Daily chatbot question limit reached")
          ) {
            botResponse =
              "📊 **Daily Limit Reached!** 🚀\n\nYou've used all 3 of your daily chatbot questions as a Starseeker member. Your limit will reset tomorrow.\n\n💡 Want unlimited chatbot access? Upgrade to Galaxy Explorer or Cosmic Voyager!\n\n🔗 Visit Subscription Plans to upgrade.";
          } else {
            botResponse = getRuleBasedResponse(userMessage);
          }
          console.log(
            "🤖 Using rule-based response:",
            botResponse.substring(0, 100) + "..."
          );
        }

        // Remove typing indicator and add actual response
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== "typing");
          return [
            ...filtered,
            {
              id: generateMessageId(),
              text: botResponse,
              sender: "bot",
              timestamp: new Date(),
            },
          ];
        });
      } catch (error) {
        console.error("🤖 [ERROR] Error getting bot response:", error);

        // Remove typing indicator
        setMessages((prev) => prev.filter((msg) => msg.id !== "typing"));

        // Add error message
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        let userFriendlyMessage =
          "Sorry, I encountered an error. Please try again later.";

        // Provide specific error messages
        if (errorMessage.includes("Daily chatbot question limit reached")) {
          userFriendlyMessage =
            "📊 **Daily Limit Reached!** 🚀\n\nYou've used all 3 of your daily chatbot questions as a Starseeker member. Your limit will reset tomorrow.\n\n💡 Want unlimited chatbot access? Upgrade to Galaxy Explorer or Cosmic Voyager!";
        } else if (errorMessage.includes("Authentication")) {
          userFriendlyMessage =
            "🔐 Authentication required. Please sign in to use the chatbot.";
        } else if (
          errorMessage.includes("Network") ||
          errorMessage.includes("Failed to fetch")
        ) {
          userFriendlyMessage =
            "🌐 Network error. Please check your connection and try again.";
        }

        setMessages((prev) => [
          ...prev,
          {
            id: generateMessageId(),
            text: userFriendlyMessage,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      } finally {
        console.log("🤖 [SEND] Setting isLoading to FALSE in finally block");
        setIsLoading(false);
        console.log("🤖 [SEND] Message send complete");
      }
    },
    [
      isLoading,
      generateMessageId,
      chatbotConfig,
      getAPIResponse,
      getRuleBasedResponse,
    ]
  );

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
