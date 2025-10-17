import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [paymentInfo, setPaymentInfo] = useState<any>(null);

    useEffect(() => {
        const orderId = searchParams.get('order_id');
        const paymentId = searchParams.get('payment_id');
        
        // Notify parent window about payment success
        if (window.opener) {
            window.opener.postMessage({
                type: 'PAYMENT_SUCCESS',
                orderId,
                paymentId
            }, window.location.origin);
        }
        
        if (orderId || paymentId) {
            // Optionally fetch payment details
            setTimeout(() => {
                setLoading(false);
                setPaymentInfo({
                    orderId,
                    paymentId,
                    status: 'completed'
                });
            }, 1000);
        } else {
            setLoading(false);
        }
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full text-center"
            >
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircleIcon className="w-12 h-12 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Payment Successful!
                    </h1>

                    {/* Description */}
                    <p className="text-gray-400 mb-6">
                        Your subscription has been activated successfully. Welcome to your cosmic journey!
                    </p>

                    {/* Payment Details */}
                    {paymentInfo && (
                        <div className="bg-gray-900 rounded-lg p-4 mb-6 text-left">
                            <h3 className="text-sm font-medium text-gray-300 mb-2">Payment Details</h3>
                            {paymentInfo.orderId && (
                                <p className="text-xs text-gray-500 mb-1">
                                    Order ID: {paymentInfo.orderId}
                                </p>
                            )}
                            <p className="text-xs text-gray-500">
                                Status: <span className="text-green-400">Completed</span>
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            to="/dashboard"
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center group"
                        >
                            Go to Dashboard
                            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <Link
                            to="/subscription/plans"
                            className="w-full bg-gray-700 text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors block text-center"
                        >
                            View Subscription
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <p className="text-xs text-gray-500">
                            You will receive a confirmation email shortly. If you have any questions, please contact our support team.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
