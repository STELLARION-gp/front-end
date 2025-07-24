import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import SubscriptionUpgradeModal from './SubscriptionUpgradeModal';

interface SubscriptionGuardProps {
    children: React.ReactNode;
    requiredPlan: 'galaxy_explorer' | 'cosmic_voyager';
    feature: string;
    fallbackComponent?: React.ReactNode;
}

interface UserSubscription {
    subscription_plan: string;
    subscription_status: string;
    subscription_end_date?: string;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
    children, 
    requiredPlan, 
    feature,
    fallbackComponent 
}) => {
    const { user } = useAuth();
    const location = useLocation();
    const [subscription, setSubscription] = useState<UserSubscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    useEffect(() => {
        if (user) {
            checkUserSubscription();
        } else {
            setLoading(false);
        }
    }, [user]);

    const checkUserSubscription = async () => {
        try {
            const token = await user?.getIdToken();
            const response = await fetch(`http://localhost:5000/api/subscriptions/user/${user?.uid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                setSubscription(data.data);
            }
        } catch (error) {
            console.error('Failed to check subscription:', error);
        } finally {
            setLoading(false);
        }
    };

    const hasAccess = () => {
        if (!subscription) return false;

        // Check if user has the required plan or higher
        const planHierarchy = {
            'starseeker': 0,
            'galaxy_explorer': 1,
            'cosmic_voyager': 2
        };

        const userPlanLevel = planHierarchy[subscription.subscription_plan as keyof typeof planHierarchy] || 0;
        const requiredPlanLevel = planHierarchy[requiredPlan];

        // Check if user meets the plan requirement
        if (userPlanLevel < requiredPlanLevel) return false;

        // Check if subscription is active (for paid plans)
        if (subscription.subscription_plan !== 'starseeker') {
            if (subscription.subscription_status !== 'active') return false;

            // Check if subscription has expired
            if (subscription.subscription_end_date && 
                new Date(subscription.subscription_end_date) < new Date()) {
                return false;
            }
        }

        return true;
    };

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!hasAccess()) {
        if (fallbackComponent) {
            return <>{fallbackComponent}</>;
        }

        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Upgrade Required
                        </h2>
                        
                        <p className="text-gray-400 mb-6">
                            This {feature} is available for {requiredPlan === 'galaxy_explorer' ? 'Galaxy Explorer' : 'Cosmic Voyager'} members and above.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => setShowUpgradeModal(true)}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                            >
                                View Plans
                            </button>
                            
                            <button
                                onClick={() => window.history.back()}
                                className="w-full bg-gray-700 text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                            >
                                Go Back
                            </button>
                        </div>

                        {subscription && (
                            <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                                <p className="text-sm text-gray-400">
                                    Current plan: <span className="text-blue-400 font-medium">
                                        {subscription.subscription_plan.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {showUpgradeModal && (
                    <SubscriptionUpgradeModal
                        currentPlan={subscription?.subscription_plan || 'starseeker'}
                        requiredPlan={requiredPlan}
                        feature={feature}
                        onClose={() => setShowUpgradeModal(false)}
                        onUpgrade={() => {
                            setShowUpgradeModal(false);
                            // Navigate to subscription plans
                            window.location.href = '/subscription/plans';
                        }}
                    />
                )}
            </div>
        );
    }

    return <>{children}</>;
};

export default SubscriptionGuard;
