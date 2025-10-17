import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface ConnectionStatusProps {
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      await apiService.healthCheck();
      setStatus('connected');
      setLastCheck(new Date());
    } catch (error) {
      console.error('Backend connection failed:', error);
      setStatus('disconnected');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'checking': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'Backend Connected';
      case 'disconnected': return 'Backend Disconnected';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {getStatusText()}
      </span>
      {lastCheck && (
        <span className="text-xs text-gray-500">
          (Last: {lastCheck.toLocaleTimeString()})
        </span>
      )}
      <button
        onClick={checkConnection}
        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        disabled={status === 'checking'}
      >
        Refresh
      </button>
    </div>
  );
};

export default ConnectionStatus;
