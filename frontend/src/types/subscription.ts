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
    subscription_start_date: string;
    subscription_end_date?: string;
    plan_name: string;
    plan_description: string;
    features: string[];
    chatbot_questions_used: number;
    chatbot_questions_limit: number;
}
