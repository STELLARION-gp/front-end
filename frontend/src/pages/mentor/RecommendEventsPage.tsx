import React from 'react';
import { useRecommendedEvents } from '../../contexts/mentor/RecommendedEventsContext';
import type { Event } from '../../contexts/mentor/RecommendedEventsContext';

const allEvents: Event[] = [
  {
    id: 1,
    title: 'Night Camp: Astronomy 101',
    description: 'A fun night under the stars learning about constellations and planets.',
  },
  {
    id: 2,
    title: 'Robotics Bootcamp',
    description: 'Hands-on robotics building and programming for all levels.',
  },
  {
    id: 3,
    title: 'Leadership Workshop',
    description: 'Develop leadership skills with group activities and expert talks.',
  },
];

const RecommendEventsPage: React.FC = () => {
  const { recommendedEvents, addEvent } = useRecommendedEvents();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">All Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allEvents.map(event => {
          const isRecommended = recommendedEvents.some(e => e.id === event.id);
          return (
            <div key={event.id} className="bg-white rounded-lg shadow p-6 flex flex-col justify-between border border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-2">{event.title}</h3>
                <p className="text-gray-700">{event.description}</p>
              </div>
              <button
                className={`mt-4 px-4 py-2 rounded font-medium self-end transition
                  ${isRecommended
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                  }`}
                onClick={() => addEvent(event)}
                disabled={isRecommended}
              >
                {isRecommended ? 'Recommended' : 'Recommend'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendEventsPage; 