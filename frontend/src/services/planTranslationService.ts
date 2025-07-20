import { useTranslation } from 'react-i18next';

export interface LocalizedSubscriptionPlan {
    id: number;
    plan_type: string;
    name: string;
    description: string;
    price_lkr: number;
    price_usd?: number;
    features: string[];
    chatbot_questions_limit: number;
    // Localized fields
    localizedName: string;
    localizedDescription: string;
    localizedFeatures: string[];
    localizedPrice: string;
    localizedPriceUsd?: string;
}

export interface SubscriptionPlan {
    id: number;
    plan_type: string;
    name: string;
    description: string;
    price_lkr: number;
    price_usd?: number;
    features: string[];
    chatbot_questions_limit: number;
}

// Hook to get localized plan details
export const useLocalizedPlans = () => {
    const { t } = useTranslation();

    const getLocalizedPlan = (plan: SubscriptionPlan): LocalizedSubscriptionPlan => {
        const planKey = plan.plan_type;
        
        return {
            ...plan,
            localizedName: t(`subscription.plans.${planKey}.name`),
            localizedDescription: t(`subscription.plans.${planKey}.description`),
            localizedFeatures: t(`subscription.plans.${planKey}.features`, { returnObjects: true }) as string[],
            localizedPrice: planKey === 'starseeker' 
                ? t(`subscription.plans.${planKey}.price`)
                : t(`subscription.plans.${planKey}.price`),
            localizedPriceUsd: planKey !== 'starseeker' 
                ? t(`subscription.plans.${planKey}.priceUsd`)
                : undefined,
        };
    };

    return { getLocalizedPlan };
};

// Helper function to get plan info for modals and components
export const getPlanDisplayInfo = (planType: string, t: any) => {
    switch (planType) {
        case 'galaxy_explorer':
            return {
                name: t('subscription.plans.galaxy_explorer.name'),
                price: t('subscription.plans.galaxy_explorer.price'),
                gradient: 'from-purple-600 to-pink-600'
            };
        case 'cosmic_voyager':
            return {
                name: t('subscription.plans.cosmic_voyager.name'),
                price: t('subscription.plans.cosmic_voyager.price'),
                gradient: 'from-pink-600 to-orange-500'
            };
        default:
            return {
                name: t('subscription.plans.starseeker.name'),
                price: t('subscription.plans.starseeker.price'),
                gradient: 'from-blue-600 to-purple-600'
            };
    }
};
