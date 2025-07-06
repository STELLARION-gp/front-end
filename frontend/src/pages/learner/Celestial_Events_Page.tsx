import React, { useState } from "react";
import SpaceEventCard from "../../components/Learner/SpaceEvent";
import Button from "../../components/Button";
import CelestialEventModel from "./CelestialEventModel";
import { eventLocations, eventComments } from "./celestialEventMockData";
import "../../styles/pages/learner/Celestial_Events_Page.scss";
import "../../styles/pages/enthusiast/NightCamps.scss";

// Define a type for celestial events
export type CelestialEvent = {
  id: number;
  event: string;
  date: string;
  category: string;
};

const upcomingEvents: CelestialEvent[] = [
  { id: 1, event: "Perseid Meteor Shower Peak", date: "2025-08-12", category: "meteor" },
  { id: 2, event: "Partial Lunar Eclipse", date: "2025-09-07", category: "eclipse" },
  { id: 3, event: "Supermoon", date: "2025-10-17", category: "moon" },
  { id: 4, event: "Orionids Meteor Shower", date: "2025-10-22", category: "meteor" },
  { id: 5, event: "Astronomy Club Meetup", date: "2025-11-05", category: "meetup" },
];

const previousEvents: CelestialEvent[] = [
  { id: 6, event: "Total Solar Eclipse", date: "2024-04-08", category: "eclipse" },
  { id: 7, event: "Eta Aquarids Meteor Shower", date: "2025-05-06", category: "meteor" },
  { id: 8, event: "Blue Moon", date: "2025-07-21", category: "moon" },
  { id: 9, event: "Stargazing Night", date: "2025-06-15", category: "meetup" },
];

const CelestialEventsPage: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    dateFrom: '',
    dateTo: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CelestialEvent | null>(null);
  const [favoriteEvents, setFavoriteEvents] = useState<number[]>([]);
  const [comments, setComments] = useState(eventComments);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  const handleClearFilters = () => {
    setFilters({ location: '', dateFrom: '', dateTo: '' });
  };

  const filterEvents = (events: typeof upcomingEvents) => {
    return events.filter(ev => {
      if (filters.location && !ev.event.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.dateFrom && new Date(ev.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(ev.date) > new Date(filters.dateTo)) return false;
      return true;
    });
  };

  const filteredUpcoming = filterEvents(upcomingEvents);
  const filteredPrevious = filterEvents(previousEvents);

  const handleOpenModal = (ev: CelestialEvent) => {
    setSelectedEvent(ev);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };
  const handleAddComment = (comment: { rating: number; text: string }) => {
    if (!selectedEvent) return;
    setComments(prev => ({
      ...prev,
      [selectedEvent.id]: [
        ...(prev[selectedEvent.id] || []),
        { id: Date.now(), user: "You", ...comment }
      ]
    }));
  };
  const handleToggleFavorite = () => {
    if (!selectedEvent) return;
    setFavoriteEvents(favs => favs.includes(selectedEvent.id)
      ? favs.filter(id => id !== selectedEvent.id)
      : [...favs, selectedEvent.id]);
  };

  return (
    <div className="celestial-events-page">
      <div className="celestial-events-filter-bar">
        <Button variant="secondary" size="small" onClick={() => setShowFilters(f => !f)}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
      {showFilters && (
        <div className="celestial-events-filters">
          <div className="celestial-events-filters__row">
            <div className="celestial-events-filters__group">
              <label htmlFor="locationFilter">Location/Name</label>
              <input
                type="text"
                id="locationFilter"
                value={filters.location}
                onChange={e => handleFilterChange('location', e.target.value)}
                placeholder="Search by event name..."
              />
            </div>
            <div className="celestial-events-filters__group">
              <label htmlFor="dateFromFilter">From Date</label>
              <input
                type="date"
                id="dateFromFilter"
                value={filters.dateFrom}
                onChange={e => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            <div className="celestial-events-filters__group">
              <label htmlFor="dateToFilter">To Date</label>
              <input
                type="date"
                id="dateToFilter"
                value={filters.dateTo}
                onChange={e => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
            <div className="celestial-events-filters__actions">
              <Button variant="secondary" size="small" onClick={handleClearFilters}>Clear</Button>
            </div>
          </div>
        </div>
      )}
      <h2>Upcoming Celestial Events</h2>
      <p>Stay up to date with the most exciting astronomical happenings visible from Earth.</p>
      <div className="celestial-events-list upcoming">
        {filteredUpcoming.map(ev => (
          <SpaceEventCard key={ev.id} event={ev} onClick={() => handleOpenModal(ev)} />
        ))}
      </div>
      <h2>Previous Celestial Events</h2>
      <p>A look back at recent celestial events and gatherings you may have missed.</p>
      <div className="celestial-events-list">
        {filteredPrevious.map(ev => (
          <SpaceEventCard key={ev.id} event={ev} onClick={() => handleOpenModal(ev)} />
        ))}
      </div>
      <CelestialEventModel
        open={modalOpen}
        onClose={handleCloseModal}
        event={selectedEvent ? {
          title: selectedEvent.event,
          date: selectedEvent.date,
          category: selectedEvent.category,
          description: `Details about ${selectedEvent.event}.`,
          locations: eventLocations[selectedEvent.id] || ["Worldwide"]
        } : {
          title: "",
          date: "",
          category: "",
          description: "",
          locations: []
        }}
        comments={selectedEvent ? comments[selectedEvent.id] || [] : []}
        onAddComment={handleAddComment}
        isFavorite={selectedEvent ? favoriteEvents.includes(selectedEvent.id) : false}
        onToggleFavorite={handleToggleFavorite}
        modalClassName="join-modal"
        contentClassName="join-modal__content"
        headerClassName="join-modal__header"
        titleClassName="join-modal__title"
        closeClassName="join-modal__close"
        infoClassName="join-modal__camp-info"
        detailsClassName="join-modal__camp-details"
      />
    </div>
  );
};

export default CelestialEventsPage;
