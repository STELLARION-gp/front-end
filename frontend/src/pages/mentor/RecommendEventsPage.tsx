import React from "react";
import { useRecommendedEvents } from "../../contexts/mentor/RecommendedEventsContext";
import type { Event } from "../../contexts/mentor/RecommendedEventsContext";
import "../../styles/pages/mentor/recommendedEvents.scss";

const allEvents: Event[] = [
  {
    id: 1,
    title: "Night Camp: Astronomy 101",
    description:
      "A fun night under the stars learning about constellations and planets.",
  },
  {
    id: 2,
    title: "Robotics Bootcamp",
    description: "Hands-on robotics building and programming for all levels.",
  },
  {
    id: 3,
    title: "Leadership Workshop",
    description:
      "Develop leadership skills with group activities and expert talks.",
  },
  {
    id: 4,
    title: "Solar System Exploration",
    description:
      "Journey through our solar system with interactive models and simulations.",
  },
  {
    id: 5,
    title: "Deep Space Photography",
    description:
      "Learn astrophotography techniques to capture stunning celestial images.",
  },
  {
    id: 6,
    title: "Telescope Building Workshop",
    description: "Build your own telescope from scratch with expert guidance.",
  },
];

const RecommendEventsPage: React.FC = () => {
  const { recommendedEvents, addEvent } = useRecommendedEvents();

  return (
    <div
      className="dashboard-page mentor-dashboard mentor-dashboard-large recommend-events-page"
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "rgba(59,130,246,0.07)",
        borderRadius: 16,
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div className="page-header">
        <h2 className="page-title">Recommend Events to Mentees</h2>
        <p className="page-description">
          Choose from available events to recommend to your mentees based on
          their interests and learning goals.
        </p>
      </div>

      <div className="events-grid">
        {allEvents.map((event) => {
          const isRecommended = recommendedEvents.some(
            (e) => e.id === event.id
          );
          return (
            <div key={event.id} className="event-card">
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
              </div>

              <div className="event-actions">
                <button
                  className={`recommend-btn ${
                    isRecommended ? "recommended" : ""
                  }`}
                  onClick={() => addEvent(event)}
                  disabled={isRecommended}
                >
                  {isRecommended ? "Already Recommended" : "Recommend Event"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendEventsPage;
