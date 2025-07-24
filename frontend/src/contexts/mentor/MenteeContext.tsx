import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface MenteeContextType {
  menteeCount: number;
  setMenteeCount: (count: number) => void;
  maxMentees: number;
  setMaxMentees: (max: number) => void;
  isAccepting: boolean;
  setIsAccepting: (accepting: boolean) => void;
  availabilityAutoToggled: boolean;
  setAvailabilityAutoToggled: (toggled: boolean) => void;
}

const MenteeContext = createContext<MenteeContextType | undefined>(undefined);

export const useMentee = () => {
  const context = useContext(MenteeContext);
  if (context === undefined) {
    throw new Error('useMentee must be used within a MenteeProvider');
  }
  return context;
};

interface MenteeProviderProps {
  children: ReactNode;
}

export const MenteeProvider: React.FC<MenteeProviderProps> = ({ children }) => {
  const [menteeCount, setMenteeCount] = useState(0);
  const [maxMentees, setMaxMentees] = useState(10);
  const [isAccepting, setIsAccepting] = useState(true);
  const [availabilityAutoToggled, setAvailabilityAutoToggled] = useState(false);

  // Auto-toggle availability when mentee count reaches maximum

  const acceptingToggle = () => {
    setAvailabilityAutoToggled(true);
    setTimeout(() => {
      setAvailabilityAutoToggled(false);
    }, 3000)
  }

  useEffect(() => {
    if (menteeCount >= maxMentees) {
      acceptingToggle();
      setIsAccepting(false);
    } else {
      acceptingToggle();
      setIsAccepting(true);
    }
  }, [menteeCount, maxMentees, isAccepting, availabilityAutoToggled]);

  return (
    <MenteeContext.Provider value={{
      menteeCount,
      setMenteeCount,
      maxMentees,
      setMaxMentees,
      isAccepting,
      setIsAccepting,
      availabilityAutoToggled,
      setAvailabilityAutoToggled
    }}>
      {children}
    </MenteeContext.Provider>
  );
}; 