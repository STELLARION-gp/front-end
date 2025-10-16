import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface SubscriptionInfo {
  subscription_plan: string;
  subscription_status: string;
  subscription_end_date?: string;
  chatbot_questions_used: number;
  chatbot_questions_limit: number;
}

const SubscriptionNotification: React.FC = () => {
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Auto-dismiss timer
  useEffect(() => {
    if (isVisible && !isDismissed) {
      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsDismissed(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, isDismissed]);

  useEffect(() => {
    if (user) {
      fetchSubscriptionInfo();
    }
  }, [user]);

  const fetchSubscriptionInfo = async () => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch(
        `http://localhost:5000/api/subscriptions/user/${user?.uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setSubscriptionInfo(data.data);
        checkShouldShowNotification(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription info:", error);
    }
  };

  const checkShouldShowNotification = (info: SubscriptionInfo) => {
    // Check if user is on free plan and has used chatbot questions
    if (
      info.subscription_plan === "starseeker" &&
      info.chatbot_questions_used >=
        Math.floor(info.chatbot_questions_limit * 0.8)
    ) {
      setIsVisible(true);
      return;
    }

    // Check if paid subscription is expiring soon (within 3 days)
    if (info.subscription_end_date && info.subscription_plan !== "starseeker") {
      const endDate = new Date(info.subscription_end_date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
        setIsVisible(true);
        return;
      }
    }

    // Check if subscription has expired
    if (
      info.subscription_status === "expired" ||
      info.subscription_status === "cancelled"
    ) {
      setIsVisible(true);
      return;
    }
  };

  const getNotificationContent = () => {
    if (!subscriptionInfo) return null;

    // Free plan with high usage
    if (
      subscriptionInfo.subscription_plan === "starseeker" &&
      subscriptionInfo.chatbot_questions_used >=
        Math.floor(subscriptionInfo.chatbot_questions_limit * 0.8)
    ) {
      return {
        type: "warning",
        title: "ChatBot Limit Reached",
        message: `You've used ${subscriptionInfo.chatbot_questions_used}/${subscriptionInfo.chatbot_questions_limit} daily questions. Upgrade for unlimited access!`,
        actionText: "Upgrade Now",
        actionLink: "/subscription/plans",
        gradient: "from-yellow-500 to-orange-500",
        icon: <ExclamationTriangleIcon className="w-6 h-6" />,
      };
    }

    // Subscription expiring soon
    if (
      subscriptionInfo.subscription_end_date &&
      subscriptionInfo.subscription_plan !== "starseeker"
    ) {
      const endDate = new Date(subscriptionInfo.subscription_end_date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil(
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry <= 3 && daysUntilExpiry > 0) {
        return {
          type: "warning",
          title: "Subscription Expiring Soon",
          message: `Your ${subscriptionInfo.subscription_plan.replace(
            "_",
            " "
          )} plan expires in ${daysUntilExpiry} day${
            daysUntilExpiry !== 1 ? "s" : ""
          }.`,
          actionText: "Renew Now",
          actionLink: "/subscription/plans",
          gradient: "from-orange-500 to-red-500",
          icon: <ExclamationTriangleIcon className="w-6 h-6" />,
        };
      }
    }

    // Expired subscription
    if (
      subscriptionInfo.subscription_status === "expired" ||
      subscriptionInfo.subscription_status === "cancelled"
    ) {
      return {
        type: "error",
        title: "Subscription Expired",
        message:
          "Your subscription has expired. Upgrade to continue enjoying premium features.",
        actionText: "Reactivate",
        actionLink: "/subscription/plans",
        gradient: "from-red-500 to-pink-500",
        icon: <ExclamationTriangleIcon className="w-6 h-6" />,
      };
    }

    return null;
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const notificationContent = getNotificationContent();

  if (!isVisible || isDismissed || !notificationContent) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md w-full mx-4"
      >
        <div
          className={`bg-gradient-to-r ${notificationContent.gradient} p-1 rounded-xl shadow-xl`}
        >
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-start">
              {/* Icon */}
              <div className="flex-shrink-0 mr-3">
                <div className="text-white">{notificationContent.icon}</div>
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-white font-semibold text-sm mb-1">
                  {notificationContent.title}
                </h3>
                <p className="text-gray-300 text-xs mb-3">
                  {notificationContent.message}
                </p>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    to={notificationContent.actionLink}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r ${notificationContent.gradient} text-white hover:opacity-90 transition-opacity`}
                  >
                    <SparklesIcon className="w-3 h-3 mr-1" />
                    {notificationContent.actionText}
                  </Link>
                  <button
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionNotification;
