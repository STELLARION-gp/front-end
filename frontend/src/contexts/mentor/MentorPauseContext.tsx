import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface MentorPauseContextType {
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

const MentorPauseContext = createContext<MentorPauseContextType | undefined>(undefined);

export const useMentorPause = () => {
  const context = useContext(MentorPauseContext);
  if (context === undefined) {
    throw new Error('useMentorPause must be used within a MentorPauseProvider');
  }
  return context;
};

interface MentorPauseProviderProps {
  children: ReactNode;
}

export const MentorPauseProvider: React.FC<MentorPauseProviderProps> = ({ children }) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <MentorPauseContext.Provider value={{ isPaused, setIsPaused }}>
      {children}
    </MentorPauseContext.Provider>
  );
}; 