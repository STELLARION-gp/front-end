import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Event {
  id: number;
  title: string;
  description: string;
}

interface RecommendedEventsContextType {
  recommendedEvents: Event[];
  addEvent: (event: Event) => void;
  removeEvent: (id: number) => void;
}

const RecommendedEventsContext = createContext<RecommendedEventsContextType | undefined>(undefined);

export const useRecommendedEvents = () => {
  const ctx = useContext(RecommendedEventsContext);
  if (!ctx) throw new Error('useRecommendedEvents must be used within RecommendedEventsProvider');
  return ctx;
};

export const RecommendedEventsProvider = ({ children }: { children: ReactNode }) => {
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);

  const addEvent = (event: Event) => {
    setRecommendedEvents((prev) => prev.some(e => e.id === event.id) ? prev : [...prev, event]);
  };

  const removeEvent = (id: number) => {
    setRecommendedEvents((prev) => prev.filter(e => e.id !== id));
  };

  return (
    <RecommendedEventsContext.Provider value={{ recommendedEvents, addEvent, removeEvent }}>
      {children}
    </RecommendedEventsContext.Provider>
  );
}; 