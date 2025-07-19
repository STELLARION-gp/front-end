import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GuideLearnerChat from "../../components/Learner/GuideLearnerChat";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/pages/learner/ServicesTab.scss";
import { Button } from "@headlessui/react";

const ServicesTab: React.FC = () => {
  const services = [
    {
      id: 1,
      service: "Telescope Setup Guidance",
      status: "Pending",
      guide: "Mr. Ruwan",
      date: "2025-07-15",
    },
    {
      id: 2,
      service: "Night Sky Observation",
      status: "Booked",
      guide: "Ms. Dilani",
      date: "2025-07-18",
    },
    {
      id: 3,
      service: "Astrophotography Basics",
      status: "Previous",
      guide: "Mr. Ruwan",
      date: "2025-06-30",
    },
  ];

  const [activeChatServiceId, setActiveChatServiceId] = useState<number | null>(null);

  const handleChat = (id: number) => {
    navigate(`/dashboard/astronomy-services/${id}`);
  };

  const navigate = useNavigate();
  const handleReview = (id: number) => {
    // Find the guide for this service
    const service = services.find(s => s.id === id);
    if (service) {
      // Navigate to guide profile (assuming route is /profile/:guideName)
      navigate(`/profile/${encodeURIComponent(service.guide)}`);
    }
  };

  const handleCloseChat = () => {
    setActiveChatServiceId(null);
  };

  // Get booked dates for calendar
  const bookedDates = services.filter(s => s.status === "Booked").map(s => new Date(s.date));
  // Map date string to service name for tooltip
  const dateServiceMap = Object.fromEntries(
    services.filter(s => s.status === "Booked").map(s => [s.date, s.service])
  );

  // Calendar tile content and tooltip
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateStr = date.toISOString().slice(0, 10);
      if (dateServiceMap[dateStr]) {
        return <div className="calendar-dot" />;
      }
    }
    return null;
  };
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dateStr = date.toISOString().slice(0, 10);
      if (dateServiceMap[dateStr]) {
        return "calendar-booked";
      }
    }
    return "";
  };

  // Tooltip for service name
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const handleDateMouseOver = (date: Date) => {
    const dateStr = date.toISOString().slice(0, 10);
    if (dateServiceMap[dateStr]) {
      setHoveredDate(dateStr);
    } else {
      setHoveredDate(null);
    }
  };
  const handleDateMouseOut = () => setHoveredDate(null);

  return (
    <div className="services-tab-main-layout">
      <div className="services-tab-container">
        <h2>Your Astronomy Services</h2>
        <table className="services-tab-table enhanced">
          <thead>
            <tr>
              <th>Service</th>
              <th>Guide</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.service}</td>
                <td>{service.guide}</td>
                <td>{service.date}</td>
                <td>
                  <span className={`chat-status-badge ${service.status.toLowerCase()}`}>
                    {service.status}
                  </span>
                </td>
                <td>
                  {service.status === "Booked" && (
                    <button
                      className="chat-action-button service-chat-button enhanced-chat"
                      onClick={() => handleChat(service.id)}
                    >
                       Chat
                    </button>
                  )}
                  {service.status === "Previous" && (
                    <button
                      className="action-button review-button enhanced-review"
                      onClick={() => handleReview(service.id)}
                    >
                      Review
                    </button>
                  )}
                  {service.status === "Pending" && <span>Waiting Approval</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {activeChatServiceId !== null && (
          <div className="chat-overlay">
            <div className="chat-container">
              <GuideLearnerChat onClose={handleCloseChat} />
            </div>
          </div>
        )}
      </div>
      <div className="services-tab-calendar">
        <h3>Booking Calendar</h3>
        <Calendar
          tileContent={({ date, view }: { date: Date; view: string }) => {
            if (view === "month") {
              const dateStr = date.toISOString().slice(0, 10);
              if (dateServiceMap[dateStr]) {
                return (
                  <div
                    className="calendar-dot"
                    onMouseEnter={() => handleDateMouseOver(date)}
                    onMouseLeave={handleDateMouseOut}
                  />
                );
              }
            }
            return null;
          }}
          tileClassName={tileClassName}
        />
        {hoveredDate && (
          <div className="calendar-tooltip">
            {dateServiceMap[hoveredDate]}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesTab;
