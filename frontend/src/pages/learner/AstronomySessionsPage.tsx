import React, { useState, useEffect } from "react";
import "../../styles/pages/learner/AstronomySessionsPage.scss";
import SessionIdeasPolls from "../../components/Learner/SessionIdeasPolls";
import UpcomingSessions from "../../components/Learner/UpcomingSessions";
import RecordedSessions from "../../components/Learner/RecordedSessions";
import MySessions from "../../components/Learner/MySessions";
import SuccessMessage from '../../components/SuccessMessage';

const AstronomySessionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ideas' | 'upcoming' | 'recorded' | 'my-sessions'>('ideas');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState('');
  const [successType, setSuccessType] = useState<'success' | 'error' | 'warning'>('success');

  useEffect(() => {
    // expose a helper so other windows/components (e.g. payment popup) can trigger toasts
    (window as any).__showSessionToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
      setSuccessMessageText(message);
      setSuccessType(type);
      setShowSuccessMessage(true);
    };

    const handleMessage = (event: MessageEvent) => {
      // accept messages from same origin only
      if (event.origin !== window.location.origin) return;
      const data = event.data || {};
      if (data && data.type === 'PAYMENT_SUCCESS') {
        (window as any).__showSessionToast('Payment successful! Thank you.', 'success');
      }
      if (data && data.type === 'PAYMENT_FAILED') {
        (window as any).__showSessionToast('Payment failed. Please try again.', 'error');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      delete (window as any).__showSessionToast;
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="astronomy-sessions-page">
      <h2>Astronomy Sessions</h2>
      
      {/* Tabs Navigation */}
      <div className="astronomy-sessions-tabs">
        <button
          className={`tab-button ${activeTab === 'ideas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ideas')}
        >
          Session Ideas & Polls
        </button>
        <button
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Live
        </button>
        <button
          className={`tab-button ${activeTab === 'recorded' ? 'active' : ''}`}
          onClick={() => setActiveTab('recorded')}
        >
          Recorded
        </button>
        <button
          className={`tab-button ${activeTab === 'my-sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-sessions')}
        >
          My Sessions
        </button>
      </div>

      {/* Tab Content */}
      <div className="astronomy-sessions-content">
        {activeTab === 'ideas' && (
          <section className="astronomy-sessions-ideas">
            <SessionIdeasPolls />
          </section>
        )}
        {activeTab === 'upcoming' && (
          <section className="astronomy-sessions-upcoming">
            <UpcomingSessions />
          </section>
        )}
        {activeTab === 'recorded' && (
          <section className="astronomy-sessions-recorded">
            <RecordedSessions />
          </section>
        )}
        {activeTab === 'my-sessions' && (
          <section className="astronomy-sessions-my">
            <MySessions />
          </section>
        )}
      </div>

        <SuccessMessage
          isOpen={showSuccessMessage}
          title={successType === 'success' ? 'Success' : successType === 'error' ? 'Error' : 'Notice'}
          message={successMessageText}
          type={successType}
          autoClose={true}
          autoCloseDelay={4000}
          onClose={() => setShowSuccessMessage(false)}
        />
    </div>
  );
};

export default AstronomySessionsPage;
