import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
//import { useTranslation } from 'react-i18next';
import { useLocalizedPlans } from "../services/planTranslationService";
import LoadingSpinner from "../components/LoadingSpinner";
import PaymentModal from "../components/payment/PaymentModal";
import { motion } from "framer-motion";
import {
  CheckIcon,
  StarIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "../config/api.config";
import type { SubscriptionPlan, UserSubscription } from "../types/subscription";
import { getPlanLevel } from "../types/subscription";

const SubscriptionPlans: React.FC = () => {
  const { user } = useAuth();
  //const { t } = useTranslation();
  const { getLocalizedPlan } = useLocalizedPlans();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] =
    useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    console.log("📍 SubscriptionPlans page mounted");
    fetchPlans();
    if (user) {
      fetchUserSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchPlans = async () => {
    try {
      console.log("🔄 Fetching subscription plans...");
      const response = await fetch(
        `${API_CONFIG.API_BASE_URL}/subscriptions/plans`
      );
      const data = await response.json();
      console.log("✅ Plans fetched:", data);
      if (data.success) {
        setPlans(data.data);
      } else {
        setError("Failed to fetch subscription plans");
      }
    } catch (err) {
      console.error("❌ Error fetching plans:", err);
      setError("Failed to fetch subscription plans");
      console.error(err);
    } finally {
      setLoading(false); // Always stop loading after fetching plans
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `${API_CONFIG.API_BASE_URL}/subscriptions/user/${user?.uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setUserSubscription(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch user subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Check if user is downgrading or selecting free plan
    const planLevel = getPlanLevel(plan.plan_type);
    const isDowngrade =
      userSubscription && planLevel < userSubscription.subscription_level;
    const isFreePlan = plan.plan_type === "starseeker";

    if (isFreePlan || isDowngrade) {
      // Handle free plan or downgrade directly without payment
      handlePlanChange(plan);
    } else {
      // Handle upgrade with payment
      setSelectedPlan(plan);
      setShowPaymentModal(true);
    }
  };

  const handlePlanChange = async (plan: SubscriptionPlan) => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `${API_CONFIG.API_BASE_URL}/subscriptions/user/${user?.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan_type: plan.plan_type,
            auto_renew: false,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchUserSubscription();
        // Show success message
        const planLevel = getPlanLevel(plan.plan_type);
        alert(
          `Successfully ${
            planLevel < (userSubscription?.subscription_level || 0)
              ? "downgraded"
              : "changed"
          } to ${plan.name}!`
        );
      } else {
        setError(data.message || "Failed to update subscription");
      }
    } catch (err) {
      setError("Failed to update subscription");
      console.error(err);
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case "starseeker":
        return <StarIcon className="w-8 h-8" />;
      case "galaxy_explorer":
        return <GlobeAltIcon className="w-8 h-8" />;
      case "cosmic_voyager":
        return <SparklesIcon className="w-8 h-8" />;
      default:
        return <RocketLaunchIcon className="w-8 h-8" />;
    }
  };

  const getPlanGradient = (planType: string) => {
    switch (planType) {
      case "starseeker":
        return "from-blue-600 to-purple-600";
      case "galaxy_explorer":
        return "from-purple-600 to-pink-600";
      case "cosmic_voyager":
        return "from-pink-600 to-orange-500";
      default:
        return "from-gray-600 to-gray-800";
    }
  };

  const isPlanCurrent = (planType: string) => {
    return userSubscription?.subscription_plan === planType;
  };

  const getButtonText = (plan: SubscriptionPlan) => {
    if (isPlanCurrent(plan.plan_type)) {
      return "Current Plan";
    }
    const planLevel = getPlanLevel(plan.plan_type);
    if (!userSubscription || userSubscription.subscription_level < planLevel) {
      return plan.price_lkr === 0 ? "Start Free Journey" : "Upgrade Now";
    }
    return "Downgrade to this Plan";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" variant="white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cosmic Journey
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Unlock the mysteries of the universe with our carefully crafted
            subscription plans. Every astronaut begins with curiosity, but where
            will your journey take you?
          </p>
        </motion.div>
      </div>

      {/* Current Subscription Status */}
      {userSubscription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">
              Current Subscription
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg text-blue-400 font-medium">
                  {userSubscription.plan_name}
                </p>
                <p className="text-gray-400">
                  {userSubscription.plan_description}
                </p>
                {userSubscription.chatbot_questions_limit > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Chatbot usage: {userSubscription.chatbot_questions_used}/
                    {userSubscription.chatbot_questions_limit} questions today
                  </p>
                )}
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    userSubscription.subscription_status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {userSubscription.subscription_status}
                </span>
                {userSubscription.subscription_end_date && (
                  <p className="text-sm text-gray-500 mt-1">
                    Expires:{" "}
                    {new Date(
                      userSubscription.subscription_end_date
                    ).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Subscription Plans */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative bg-gray-800 rounded-2xl overflow-hidden ${
              plan.plan_type === "galaxy_explorer"
                ? "ring-2 ring-purple-500 scale-105"
                : ""
            } ${isPlanCurrent(plan.plan_type) ? "ring-2 ring-blue-500" : ""}`}
          >
            {/* Popular Badge */}
            {plan.plan_type === "galaxy_explorer" && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 text-sm font-medium">
                Most Popular
              </div>
            )}

            {/* Current Plan Badge */}
            {isPlanCurrent(plan.plan_type) && (
              <div className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium">
                Current Plan
              </div>
            )}

            <div className="p-8">
              {/* Plan Header */}
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${getPlanGradient(
                    plan.plan_type
                  )} mb-4`}
                >
                  <div className="text-white">
                    {getPlanIcon(plan.plan_type)}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {getLocalizedPlan(plan).localizedName}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {getLocalizedPlan(plan).localizedDescription}
                </p>

                {/* Price */}
                <div className="mb-6">
                  {plan.price_lkr === 0 ? (
                    <div className="text-3xl font-bold text-white">
                      Free Forever
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold text-white">
                        LKR {plan.price_lkr.toLocaleString()}
                        <span className="text-lg text-gray-400 font-normal">
                          /month
                        </span>
                      </div>
                      {plan.price_usd && (
                        <div className="text-sm text-gray-500">
                          ~${plan.price_usd}/month
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {getLocalizedPlan(plan).localizedFeatures.map(
                  (feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  )
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePlanSelect(plan)}
                disabled={isPlanCurrent(plan.plan_type)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  isPlanCurrent(plan.plan_type)
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : plan.plan_type === "galaxy_explorer"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105"
                    : "bg-gray-700 text-white hover:bg-gray-600 transform hover:scale-105"
                }`}
              >
                {getButtonText(plan)}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          user={user}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          onSuccess={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
            fetchUserSubscription();
          }}
        />
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="max-w-4xl mx-auto text-center mt-16"
      >
        <p className="text-gray-400 mb-4">
          Questions about our plans? Contact our stellar support team.
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <span>✓ Cancel anytime</span>
          <span>✓ Secure payments</span>
          <span>✓ Instant activation</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionPlans;
