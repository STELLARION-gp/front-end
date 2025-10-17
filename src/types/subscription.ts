// Subscription-related interfaces for use across the app

export interface SubscriptionPlan {
  id: number;
  plan_type: string;
  name: string;
  description: string;
  price_lkr: number;
  price_usd?: number;
  features: string[];
  chatbot_questions_limit: number;
  is_active: boolean;
}

export interface UserSubscription {
  subscription_plan: string;
  subscription_status: string;
  subscription_level: number;
  subscription_start_date: string;
  subscription_end_date?: string;
  auto_renew?: boolean;
  plan_name?: string;
  plan_description?: string;
  price_lkr?: number;
  features?: string[];
  chatbot_questions_used: number;
  chatbot_questions_reset_date?: Date;
  chatbot_questions_limit: number;
}

// Helper function to get plan level from plan type
export const getPlanLevel = (planType: string): number => {
  switch (planType) {
    case "starseeker":
      return 1;
    case "galaxy_explorer":
      return 2;
    case "cosmic_voyager":
      return 3;
    default:
      return 1;
  }
};
