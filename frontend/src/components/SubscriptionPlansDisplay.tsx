import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalizedPlans, type LocalizedSubscriptionPlan } from '../services/planTranslationService';
import subscriptionService from '../services/subscriptionService';
import PaymentModal from './payment/PaymentModal';
import { auth } from '../firebase';

const SubscriptionPlansDisplay: React.FC = () => {
    const { t } = useTranslation();
    const { getLocalizedPlan } = useLocalizedPlans();
    const [plans, setPlans] = useState<LocalizedSubscriptionPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<LocalizedSubscriptionPlan | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const fetchedPlans = await subscriptionService.getSubscriptionPlans();
            
            // Convert to localized plans
            const localizedPlans = fetchedPlans.map((plan: any) => getLocalizedPlan(plan));
            setPlans(localizedPlans);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (plan: LocalizedSubscriptionPlan) => {
        if (plan.plan_type === 'starseeker') {
            // Free plan - handle differently or show info
            return;
        }
        setSelectedPlan(plan);
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        setSelectedPlan(null);
        // Refresh user subscription or show success message
    };

    const getPlanGradient = (planType: string) => {
        switch (planType) {
            case 'galaxy_explorer':
                return 'from-purple-600 to-pink-600';
            case 'cosmic_voyager':
                return 'from-pink-600 to-orange-500';
            default:
                return 'from-blue-600 to-purple-600';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <p className="text-red-400">{error}</p>
                <button 
                    onClick={fetchPlans}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                    {t('subscription.payment.closeButton')}
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                    Choose Your Plan
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Select the perfect plan for your astronomical journey
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 ${
                            plan.plan_type === 'galaxy_explorer' ? 'scale-105 border-purple-500' : ''
                        }`}
                    >
                        {plan.plan_type === 'galaxy_explorer' && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {plan.localizedName}
                            </h3>
                            <p className="text-gray-400 mb-6">
                                {plan.localizedDescription}
                            </p>

                            <div className="mb-8">
                                <div className="text-4xl font-bold text-white mb-2">
                                    {plan.localizedPrice}
                                </div>
                                {plan.localizedPriceUsd && (
                                    <div className="text-gray-400 text-sm">
                                        {plan.localizedPriceUsd}
                                    </div>
                                )}
                            </div>

                            <ul className="space-y-3 mb-8 text-left">
                                {plan.localizedFeatures.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className={`w-2 h-2 bg-gradient-to-r ${getPlanGradient(plan.plan_type)} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan)}
                                disabled={plan.plan_type === 'starseeker'}
                                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                                    plan.plan_type === 'starseeker'
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : `bg-gradient-to-r ${getPlanGradient(plan.plan_type)} text-white hover:opacity-90`
                                }`}
                            >
                                {plan.plan_type === 'starseeker' 
                                    ? 'Current Plan'
                                    : t('subscription.modal.upgradeButton')
                                }
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedPlan && (
                <PaymentModal
                    plan={selectedPlan}
                    user={auth.currentUser}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedPlan(null);
                    }}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default SubscriptionPlansDisplay;
