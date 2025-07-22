import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { getPlanDisplayInfo } from '../services/planTranslationService';

interface SubscriptionUpgradeModalProps {
    currentPlan: string;
    requiredPlan: string;
    feature: string;
    onClose: () => void;
    onUpgrade: () => void;
}

const SubscriptionUpgradeModal: React.FC<SubscriptionUpgradeModalProps> = ({
    currentPlan,
    requiredPlan,
    feature,
    onClose,
    onUpgrade
}) => {
    const { t } = useTranslation();

    const getPlanInfo = (plan: string) => {
        const planInfo = getPlanDisplayInfo(plan, t);
        
        return {
            ...planInfo,
            icon: plan === 'cosmic_voyager' ? 
                <SparklesIcon className="w-8 h-8" /> : 
                <GlobeAltIcon className="w-8 h-8" />
        };
    };

    const planInfo = getPlanInfo(requiredPlan);
    const currentPlanInfo = getPlanDisplayInfo(currentPlan, t);

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
                    className="relative bg-gray-800 rounded-2xl p-8 max-w-lg w-full border border-gray-700"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    {/* Content */}
                    <div className="text-center">
                        {/* Icon */}
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${planInfo.gradient} mb-6`}>
                            <div className="text-white">
                                {planInfo.icon}
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {t('subscription.modal.upgradeRequired')}
                        </h2>

                        {/* Description */}
                        <p className="text-gray-400 mb-6">
                            {t('subscription.modal.upgradeMessage', {
                                feature,
                                currentPlan: currentPlanInfo.name,
                                requiredPlan: planInfo.name
                            })}
                        </p>

                        {/* Pricing */}
                        <div className="bg-gray-900 rounded-lg p-4 mb-6">
                            <div className="text-3xl font-bold text-white mb-2">
                                {planInfo.price}
                            </div>
                            <p className="text-gray-400 text-sm">
                                Unlock premium features and accelerate your cosmic journey
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="text-left mb-8">
                            <h3 className="text-lg font-medium text-white mb-3">{t('subscription.payment.includedFeatures')}:</h3>
                            <div className="space-y-2">
                                {(t(`subscription.plans.${requiredPlan}.features`, { returnObjects: true }) as string[]).map((feature: string, index: number) => (
                                    <div key={index} className="flex items-center text-gray-300">
                                        <div className={`w-2 h-2 ${requiredPlan === 'galaxy_explorer' ? 'bg-purple-500' : 'bg-orange-500'} rounded-full mr-3`}></div>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={onUpgrade}
                                className={`w-full bg-gradient-to-r ${planInfo.gradient} text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity`}
                            >
                                {t('subscription.modal.upgradeButton')}
                            </button>
                            
                            <button
                                onClick={onClose}
                                className="w-full bg-gray-700 text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                            >
                                {t('subscription.modal.cancelButton')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SubscriptionUpgradeModal;
