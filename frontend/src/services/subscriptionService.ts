import { auth } from "../firebase";
import { API_CONFIG } from "../config/api.config";

const API_BASE_URL = API_CONFIG.API_BASE_URL;

export interface SubscriptionPlan {
  id: number;
  plan_type: string;
  name: string;
  description: string;
  price_lkr: number;
  price_usd: number;
  features: string[];
  chatbot_questions_limit: number;
  is_active: boolean;
}

// Import the UserSubscription type from the shared types
import type { UserSubscription as UserSubscriptionType } from "../types/subscription";
export type UserSubscription = UserSubscriptionType;

export interface PaymentOrder {
  planId: number;
  amount: number;
  currency: string;
}

export interface ChatbotAccess {
  hasAccess: boolean;
  questionsUsed: number;
  questionsLimit: number;
  resetDate?: string;
}

class SubscriptionService {
  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Get all available subscription plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        data: SubscriptionPlan[];
      }>("/subscriptions/plans");
      return response.data;
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      throw error;
    }
  }

  // Get user's current subscription
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        data: UserSubscription;
      }>(`/subscriptions/user/${userId}`);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes("404")) {
        return null; // User has no subscription
      }
      console.error("Error fetching user subscription:", error);
      throw error;
    }
  }

  // Update user's subscription plan
  async updateSubscription(
    userId: string,
    planType: string
  ): Promise<UserSubscription> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        data: UserSubscription;
      }>(`/subscriptions/user/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ plan_type: planType }),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  }

  // Cancel user's subscription
  async cancelSubscription(userId: string): Promise<void> {
    try {
      await this.makeRequest<{ success: boolean; message: string }>(
        `/subscriptions/user/${userId}`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  }

  // Check chatbot access for user
  async checkChatbotAccess(userId: string): Promise<ChatbotAccess> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        data: ChatbotAccess;
      }>(`/subscriptions/user/${userId}/chatbot-access`);
      return response.data;
    } catch (error) {
      console.error("Error checking chatbot access:", error);
      throw error;
    }
  }

  // Increment chatbot usage
  async incrementChatbotUsage(userId: string): Promise<void> {
    try {
      await this.makeRequest<{ success: boolean; message: string }>(
        `/subscriptions/user/${userId}/chatbot-usage`,
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error("Error incrementing chatbot usage:", error);
      throw error;
    }
  }

  // Get subscription history
  async getSubscriptionHistory(userId: string): Promise<UserSubscription[]> {
    try {
      const response = await this.makeRequest<{
        success: boolean;
        data: UserSubscription[];
      }>(`/subscriptions/user/${userId}/history`);
      return response.data;
    } catch (error) {
      console.error("Error fetching subscription history:", error);
      throw error;
    }
  }
}

export default new SubscriptionService();
