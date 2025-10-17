import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircleIcon, ArrowLeftIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const PaymentCancel: React.FC = () => {
    useEffect(() => {
        // Notify parent window about payment cancellation
        if (window.opener) {
            window.opener.postMessage({
                type: 'PAYMENT_CANCELLED'
            }, window.location.origin);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full text-center"
            >
                <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                    {/* Cancel Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <XCircleIcon className="w-12 h-12 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Payment Cancelled
                    </h1>

                    {/* Description */}
                    <p className="text-gray-400 mb-6">
                        Your payment was cancelled. No charges were made to your account.
                    </p>

                    {/* Info Box */}
                    <div className="bg-gray-900 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center mb-2">
                            <CreditCardIcon className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-400">No payment processed</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            Your subscription remains unchanged. You can try again or choose a different plan.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            to="/subscription/plans"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center group"
                        >
                            Try Again
                            <CreditCardIcon className="w-5 h-5 ml-2" />
                        </Link>
                        
                        <Link
                            to="/dashboard"
                            className="w-full bg-gray-700 text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors flex items-center justify-center group"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <p className="text-xs text-gray-500">
                            Need help? Contact our support team or try a different payment method.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentCancel;
