import React from "react";
import SpaceEventCard from "../../components/Learner/SpaceEvent";
import "../../styles/pages/learner/Celestial_Events_Page.scss";

const upcomingEvents = [
  { id: 1, event: "Perseid Meteor Shower Peak", date: "2025-08-12", category: "meteor" },
  { id: 2, event: "Partial Lunar Eclipse", date: "2025-09-07", category: "eclipse" },
  { id: 3, event: "Supermoon", date: "2025-10-17", category: "moon" },
  { id: 4, event: "Orionids Meteor Shower", date: "2025-10-22", category: "meteor" },
  { id: 5, event: "Astronomy Club Meetup", date: "2025-11-05", category: "meetup" },
];

const previousEvents = [
  { id: 6, event: "Total Solar Eclipse", date: "2024-04-08", category: "eclipse" },
  { id: 7, event: "Eta Aquarids Meteor Shower", date: "2025-05-06", category: "meteor" },
  { id: 8, event: "Blue Moon", date: "2025-07-21", category: "moon" },
  { id: 9, event: "Stargazing Night", date: "2025-06-15", category: "meetup" },
];

const CelestialEventsPage: React.FC = () => (
  <div className="celestial-events-page">
    <h2>Upcoming Celestial Events</h2>
    <p>Stay up to date with the most exciting astronomical happenings visible from Earth.</p>
    <div className="celestial-events-list">
      {upcomingEvents.map(ev => (
        <SpaceEventCard key={ev.id} event={ev} />
      ))}
    </div>
    <h2>Previous Celestial Events</h2>
    <p>A look back at recent celestial events and gatherings you may have missed.</p>
    <div className="celestial-events-list">
      {previousEvents.map(ev => (
        <SpaceEventCard key={ev.id} event={ev} />
      ))}
    </div>
  </div>
);

export default CelestialEventsPage;
