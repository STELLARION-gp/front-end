import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Chat from "../../components/Learner/Chat";
import "../../styles/pages/learner/AstronomyServiceDetails.scss";
import { services } from "./AstronomyServices";
import Button from "../../components/Button";

const AstronomyServiceDetails: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showChat, setShowChat] = useState(false);

  // Try to get service from navigation state, else from static array
  let service = location.state?.service;
  if (!service && id) {
    service = services.find((s: any) => String(s.id) === id);
  }

  if (!service) {
    return <div className="service-details-container">Service not found.</div>;
  }

  const handleGuideClick = () => {
    navigate("/dashboard/guide-profile");
  };
const handleBookNow = () => {
    setShowChat(true); // Show chat when Book Now is clicked
  };

  return (
    <div className="service-details-container">
      <div className="service-details-card service-details-card--vertical">
        <img
          src={service.image}
          alt={service.title}
          className="service-details-image"
        />
        <div className="service-details-info">
          <h2>{service.title}</h2>
          <p className="service-details-desc">{service.description}</p>
          <div className="service-details-meta">
            {/* <span>
              <strong>Guide:</strong>{" "}
              <span
                className="guide-name-link"
                onClick={handleGuideClick}
                style={{
                  color: "#4f8cff",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {service.guideName}
              </span>
            </span> */}
            <span>
              <strong>Location:</strong> {service.location}
            </span>
            <span>
              <strong>Duration:</strong> {service.duration}
            </span>
            <span>
              <strong>Price:</strong> ${service.price}
            </span>
            <span>
              <strong>Rating:</strong> {service.rating} ⭐
            </span>
            <div className="service-details-tags">
              {service.tags?.map((tag: string) => (
                <span key={tag} className="service-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div
            className="guide-details"
            onClick={handleGuideClick}
            style={{ cursor: "pointer" }}
            tabIndex={0}
            role="button"
            aria-label={`View profile of ${service.guideName}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleGuideClick();
            }}
          >
            <img
              src={service.guideImage}
              alt={service.guideName}
              className="guide-avatar"
            />
            <div>
              <div className="guide-name">{service.guideName}</div>
              <div className="guide-role">Astronomy Guide</div>
            </div>
          </div>
          <Button disabled className="booked-btn">Booked</Button>
        </div>
      </div>
      <div className="service-details-chat">
        <Chat guideName={service.guideName} />
      </div>
    </div>
  );
};

export default AstronomyServiceDetails;
