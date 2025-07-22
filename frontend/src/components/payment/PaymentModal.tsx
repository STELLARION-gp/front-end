import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useLocalizedPlans } from '../../services/planTranslationService';

interface SubscriptionPlan {
    id: number;
    plan_type: string;
    name: string;
    description: string;
    price_lkr: number;
    price_usd?: number;
    features: string[];
    chatbot_questions_limit: number;
}

interface PaymentModalProps {
    plan: SubscriptionPlan;
    user: any;
    onClose: () => void;
    onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, user, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const { getLocalizedPlan } = useLocalizedPlans();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get localized plan details
    const localizedPlan = getLocalizedPlan(plan);

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = await user?.getIdToken();
            
            // Create payment order
            const response = await fetch('http://localhost:5000/api/payments/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    planId: plan.id,
                    amount: plan.price_lkr,
                    currency: 'LKR'
                }),
            });

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || t('subscription.payment.orderError'));
            }

            // Initialize PayHere payment
            const payhere = (window as any).payhere;
            
            if (!payhere) {
                throw new Error(t('subscription.payment.loadingError'));
            }

            // Debug: Log the payment data from backend
            console.log('Backend payment response:', data);
            console.log('PayHere data received:', data.data.payhere_data);

            // Payment object
            const payment = {
                ...data.data.payhere_data,
                onCompleted: function(orderId: string) {
                    console.log("Payment completed. OrderID:", orderId);
                    // Reset loading state and call success
                    setLoading(false);
                    onSuccess();
                },
                onDismissed: function() {
                    console.log("Payment dismissed");
                    setLoading(false);
                },
                onError: function(error: any) {
                    console.log("Payment error:", error);
                    setError(t('subscription.payment.paymentFailed'));
                    setLoading(false);
                }
            };

            // Listen for messages from the payment success page
            const handlePaymentMessage = (event: MessageEvent) => {
                if (event.origin !== window.location.origin) return;
                
                if (event.data.type === 'PAYMENT_SUCCESS') {
                    console.log('Payment success message received from redirect');
                    setLoading(false);
                    onSuccess();
                    window.removeEventListener('message', handlePaymentMessage);
                } else if (event.data.type === 'PAYMENT_CANCELLED') {
                    console.log('Payment cancelled message received from redirect');
                    setLoading(false);
                    window.removeEventListener('message', handlePaymentMessage);
                }
            };

            // Add event listener for payment messages
            window.addEventListener('message', handlePaymentMessage);

            // Auto-cleanup after 5 minutes
            setTimeout(() => {
                window.removeEventListener('message', handlePaymentMessage);
                if (loading) {
                    setLoading(false);
                    setError(t('subscription.payment.timeout'));
                }
            }, 300000); // 5 minutes

            // Debug: Log the final payment object being sent to PayHere
            console.log('Final PayHere payment object:', payment);

            // Validate required fields before starting payment
            const requiredFields = ['merchant_id', 'order_id', 'amount', 'currency', 'hash', 'first_name', 'last_name', 'email'];
            const missingFields = requiredFields.filter(field => !payment[field]);
            
            if (missingFields.length > 0) {
                throw new Error(t('subscription.payment.missingFields', { fields: missingFields.join(', ') }));
            }

            // Start payment
            console.log('Starting PayHere payment...');
            payhere.startPayment(payment);

        } catch (err: any) {
            setError(err.message || 'Failed to process payment');
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-gray-700"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCardIcon className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {t('subscription.payment.title', { planName: localizedPlan.localizedName })}
                        </h2>
                        <p className="text-gray-400">{localizedPlan.localizedDescription}</p>
                    </div>

                    {/* Plan Summary */}
                    <div className="bg-gray-900 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">{localizedPlan.localizedName}</span>
                            <span className="text-white font-medium">
                                {localizedPlan.localizedPrice}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Billing cycle</span>
                            <span className="text-gray-400">Monthly</span>
                        </div>
                        {localizedPlan.localizedPriceUsd && (
                            <div className="flex items-center justify-between text-sm mt-1">
                                <span className="text-gray-500">USD equivalent</span>
                                <span className="text-gray-400">{localizedPlan.localizedPriceUsd}</span>
                            </div>
                        )}
                    </div>

                    {/* Plan Features */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-white mb-3">{t('subscription.payment.includedFeatures')}</h3>
                        <div className="space-y-2">
                            {localizedPlan.localizedFeatures.map((feature: string, index: number) => (
                                <div key={index} className="flex items-start text-sm text-gray-400">
                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-400 text-center">
                            {t('subscription.payment.securePayment')}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                            <div className="text-red-400 text-sm font-medium mb-1">{t('subscription.payment.errorTitle')}</div>
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    {t('subscription.payment.processing')}
                                </div>
                            ) : (
                                t('subscription.payment.payButton', { amount: localizedPlan.localizedPrice })
                            )}
                        </button>
                        
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="w-full bg-gray-700 text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                            {t('subscription.payment.closeButton')}
                        </button>
                    </div>

                    {/* Security Notice */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                        Your payment information is secure and encrypted. We never store your payment details.
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
