import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../LoadingSpinner";
import subscriptionService from "../../services/subscriptionService";
import type { UserSubscription } from "../../types/subscription";
import {
  CreditCard,
  Info,
  AlertCircle,
  Check,
  X,
  RefreshCw,
} from "lucide-react";

const SubscriptionManager: React.FC = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [userSubscription, setUserSubscription] =
    useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Only show subscription management for learners
  const isLearner = userProfile?.role === "learner";

  useEffect(() => {
    if (user) {
      fetchUserSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Add listener for chatbot usage updates
  useEffect(() => {
    const handleChatbotUsage = () => {
      // Refetch subscription data when chatbot is used
      fetchUserSubscription();
    };

    // Listen for custom event when chatbot sends a message
    window.addEventListener("chatbot-message-sent", handleChatbotUsage);

    return () => {
      window.removeEventListener("chatbot-message-sent", handleChatbotUsage);
    };
  }, [user]);

  const fetchUserSubscription = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const data = await subscriptionService.getUserSubscription(
        user?.uid || ""
      );
      setUserSubscription(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
      setError("Unable to load your subscription information");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await fetchUserSubscription();
  };

  const handleCancelSubscription = async () => {
    if (!user) return;

    try {
      setCancelling(true);
      await subscriptionService.cancelSubscription(user.uid);
      setCancelSuccess(true);
      setShowCancelModal(false);
      // Refresh subscription data
      await fetchUserSubscription();
    } catch (err) {
      console.error("Failed to cancel subscription:", err);
      setError("Failed to cancel subscription. Please try again later.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner size="medium" variant="primary" />
      </div>
    );
  }

  // Non-learner roles get automatic Cosmic Voyager access
  if (!isLearner) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mt-6">
        <div className="flex items-center mb-4">
          <CreditCard className="mr-2 text-purple-400" size={20} />
          <h3 className="text-xl font-semibold text-white">Premium Access</h3>
        </div>
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-6 border border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Check className="text-purple-400" size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">
                Cosmic Voyager Plan
              </h4>
              <p className="text-sm text-purple-300">Premium Access Included</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4">
            As a{" "}
            <span className="text-purple-400 font-medium">
              {userProfile?.role}
            </span>
            , you have full access to all premium features including unlimited
            AI chatbot, advanced lessons, and exclusive events.
          </p>
          <div className="bg-gray-800/50 rounded p-4">
            <h5 className="text-white font-medium mb-2">
              Your Premium Features:
            </h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Check className="text-green-400" size={16} />
                Unlimited AI Chatbot Questions
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-400" size={16} />
                Access to All Astronomy Lessons & Certifications
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-400" size={16} />
                Priority Access to Night Camps & Workshops
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-400" size={16} />
                1-on-1 Tutor Sessions
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-400" size={16} />
                Early Access to New Features
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error && !userSubscription) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mt-6">
        <div className="flex items-center mb-4">
          <CreditCard className="mr-2 text-blue-400" size={20} />
          <h3 className="text-xl font-semibold text-white">Subscription</h3>
        </div>
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-4">
          <div className="flex items-center text-red-400">
            <AlertCircle className="mr-2" size={16} />
            <p>{error}</p>
          </div>
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate("/subscription/plans")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            View Subscription Plans
          </button>
        </div>
      </div>
    );
  }

  // If no subscription data, show default free plan message
  if (!userSubscription) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 mt-6">
        <div className="flex items-center mb-4">
          <CreditCard className="mr-2 text-blue-400" size={20} />
          <h3 className="text-xl font-semibold text-white">Subscription</h3>
        </div>
        <div className="bg-gray-700 rounded p-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-medium text-white mb-2">
              StarSeeker Plan (Free)
            </h4>
            <p className="text-gray-300 mb-4">
              You're currently on the free plan. Upgrade to unlock premium
              features!
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/subscription/plans")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              View Subscription Plans & Upgrade
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CreditCard className="mr-2 text-blue-400" size={20} />
          <h3 className="text-xl font-semibold text-white">Subscription</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh subscription data"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => navigate("/subscription/plans")}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All Plans
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mb-4">
          <div className="flex items-center text-red-400">
            <AlertCircle className="mr-2" size={16} />
            <p>{error}</p>
          </div>
        </div>
      )}

      {cancelSuccess && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-3 mb-4">
          <div className="flex items-center text-green-400">
            <Check className="mr-2" size={16} />
            <p>Your subscription has been cancelled successfully.</p>
          </div>
        </div>
      )}

      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-lg font-medium text-white">
              {userSubscription.plan_name || "StarSeeker Plan"}
            </h4>
            <p className="text-sm text-gray-400">
              {userSubscription.plan_description ||
                "Free tier with basic features"}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              userSubscription.subscription_status === "active"
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {userSubscription.subscription_status || "active"}
          </span>
        </div>

        {/* Show chatbot usage for all users */}
        {userSubscription.chatbot_questions_limit !== undefined && (
          <div className="bg-gray-800 rounded p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">AI Chatbot Usage</span>
              <span className="text-sm text-white">
                {userSubscription.chatbot_questions_used || 0} /{" "}
                {userSubscription.chatbot_questions_limit === -1
                  ? "∞"
                  : userSubscription.chatbot_questions_limit}
              </span>
            </div>
            {userSubscription.chatbot_questions_limit !== -1 && (
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      ((userSubscription.chatbot_questions_used || 0) /
                        userSubscription.chatbot_questions_limit) *
                        100
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div className="border-t border-gray-600 my-3 pt-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-400">Start Date</p>
              <p className="text-white">
                {new Date(
                  userSubscription.subscription_start_date
                ).toLocaleDateString()}
              </p>
            </div>
            {userSubscription.subscription_end_date && (
              <div>
                <p className="text-gray-400">End Date</p>
                <p className="text-white">
                  {new Date(
                    userSubscription.subscription_end_date
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-3">
        {/* Show upgrade button for free plan users */}
        {userSubscription.subscription_plan === "starseeker" && (
          <button
            onClick={() => navigate("/subscription/plans")}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
          >
            🚀 Upgrade to Premium
          </button>
        )}

        {/* Show cancel button for paid subscriptions */}
        {userSubscription.subscription_status === "active" &&
          userSubscription.subscription_plan !== "starseeker" && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 border border-red-600 text-red-400 rounded hover:bg-red-600/10 transition-colors"
            >
              Cancel Subscription
            </button>
          )}
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-3">
              Cancel Subscription
            </h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to cancel your {userSubscription.plan_name}{" "}
              subscription? You'll still have access until the end of your
              current billing period.
            </p>
            <div className="bg-amber-900/20 border border-amber-700 rounded p-3 mb-5">
              <div className="flex">
                <Info className="text-amber-400 mr-2 flex-shrink-0" size={18} />
                <p className="text-sm text-amber-400">
                  After cancellation, your plan will revert to the free
                  StarSeeker plan.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                disabled={cancelling}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center"
                disabled={cancelling}
              >
                {cancelling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <X size={18} className="mr-1" />
                    Confirm Cancellation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
