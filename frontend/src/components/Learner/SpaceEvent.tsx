import React from "react";
import "../../styles/components/learner/UpcomingEventCard.scss";
import {
  SparklesIcon,   // meteor
  SunIcon,        // eclipse
  MoonIcon,       // moon
  StarIcon,       // meetup
  CalendarIcon    // default
} from "@heroicons/react/24/outline";

type SpaceEvent = {
  id: number;
  event: string;
  date: string;
  category: string;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "meteor":
      return <SparklesIcon width={28} height={28} stroke="#3b82f6" />;
    case "eclipse":
      return <SunIcon width={28} height={28} stroke="#2563eb" />;
    case "moon":
      return <MoonIcon width={28} height={28} stroke="#f1f5f9" />;
    case "meetup":
      return <StarIcon width={28} height={28} stroke="#3b82f6" />;
    default:
      return <CalendarIcon width={28} height={28} stroke="#2563eb" />;
  }
};

const UpcomingEventCard: React.FC<{ event: SpaceEvent }> = ({ event }) => (
  <div className="space-event-card modern">
    <div className="space-event-icon modern-icon">
      {getCategoryIcon(event.category)}
    </div>
    <div>
      <div className="space-event-title">{event.event}</div>
      <div className="space-event-date">
        {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
      </div>
    </div>
  </div>
);

export default UpcomingEventCard;