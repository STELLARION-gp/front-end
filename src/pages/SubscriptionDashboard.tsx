import React from "react";
import SubscriptionManager from "../components/subscription/SubscriptionManager";
import { useNavigate } from "react-router-dom";
import { CreditCard, Sparkles, Zap, Crown } from "lucide-react";

const SubscriptionDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <CreditCard className="text-blue-400 mr-3" size={24} />
          <h1 className="text-2xl font-bold text-white">
            Subscription Management
          </h1>
        </div>
        <button
          onClick={() => navigate("/subscription/plans")}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition flex items-center gap-2"
        >
          <Sparkles size={18} />
          View All Plans
        </button>
      </div>

      {/* Benefits Banner */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6 mb-8 border border-blue-500/30">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Crown className="text-yellow-400" size={24} />
          Unlock Premium Features
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Zap className="text-blue-400 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-white font-medium mb-1">
                Unlimited AI Chatbot
              </h3>
              <p className="text-gray-300 text-sm">
                Ask unlimited questions to our astronomy AI assistant
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="text-purple-400 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-white font-medium mb-1">Advanced Lessons</h3>
              <p className="text-gray-300 text-sm">
                Access intermediate and advanced astronomy courses
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Crown className="text-yellow-400 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-white font-medium mb-1">Exclusive Events</h3>
              <p className="text-gray-300 text-sm">
                Priority access to night camps and 1-on-1 tutoring
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-300">
          Choose the perfect plan for your astronomical journey. Upgrade to
          unlock advanced features, unlimited resources, and exclusive content.
        </p>
      </div>

      <SubscriptionManager />
    </div>
  );
};

export default SubscriptionDashboard;
