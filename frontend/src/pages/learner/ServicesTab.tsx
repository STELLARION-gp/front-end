import React, { useState } from "react";
import "../../styles/pages/learner/ServicesTab.scss";
import GuideLearnerChat from "../../components/Learner/GuideLearnerChat";

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
    console.log("Chat with guide from service ID:", id);
    setActiveChatServiceId(id);
  };

  const handleReview = (id: number) => {
    console.log("Give review for service ID:", id);
  };

  const handleCloseChat = () => {
    setActiveChatServiceId(null);
  };

  return (
    <div className="services-tab-container">
      <h2>Your Astronomy Services</h2>
      <table className="services-table">
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
                <span className={`status-badge ${service.status.toLowerCase()}`}>
                  {service.status}
                </span>
              </td>
              <td>
                {service.status === "Booked" && (
                  <button
                    className="action-button chat-button"
                    onClick={() => handleChat(service.id)}
                  >
                    Chat
                  </button>
                )}
                {service.status === "Previous" && (
                  <button
                    className="action-button review-button"
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
  );
};

export default ServicesTab;
