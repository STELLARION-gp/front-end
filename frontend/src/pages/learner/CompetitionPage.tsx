import React from "react";
import "../../styles/pages/learner/CompetitionPage.scss";
import Button from "../../components/Button";

// Mock data for competition
const competition = {
  coverImage:
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=600&h=400&fit=crop",
  name: "Stellar Astrophotography Challenge 2025",
  date: "2025-08-15",
  description:
    "Showcase your astrophotography skills! Capture the wonders of the night sky and compete with fellow astronomy enthusiasts for top honors and exciting prizes.",
  rules: [
    "Open to all students registered on the platform.",
    "Each participant may submit up to 3 original astrophotography images.",
    "Images must be taken between July 1 and August 10, 2025.",
    "Basic editing (contrast, color correction) allowed. No composites or AI-generated images.",
    "Submission deadline: August 12, 2025, 11:59 PM UTC.",
    "Winners will be announced on August 20, 2025.",
  ],
  deliverables: [
    "High-resolution image(s) in JPG or PNG format (max 20MB each)",
    "Short description for each image (location, equipment, date, story)",
    "Consent form for public display and judging",
  ],
  participants: [
    {
      name: "Alice Sky",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Neil Cosmos",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Luna Rivera",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "John Galaxy",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      name: "Stella Observer",
      avatar: "https://randomuser.me/api/portraits/women/50.jpg",
    },
    {
      name: "Cosmo Reader",
      avatar: "https://randomuser.me/api/portraits/men/31.jpg",
    },
  ],
};

const CompetitionPage: React.FC = () => {
  return (
    <div className="competition-page">
      <div className="competition-header">
        <img
          src={competition.coverImage}
          alt={competition.name}
          className="competition-cover"
        />
        <div className="competition-header-info">
          <div className="competition-title">{competition.name}</div>
          <div className="competition-date">{competition.date}</div>
          <div className="competition-desc">{competition.description}</div>
          <Button className="competition-register-btn">Register</Button>
        </div>
      </div>

      <div className="competition-section">
        <div className="competition-section-title">Registered Participants</div>
        <div className="competition-participants">
          {competition.participants.map((p, i) => (
            <img
              key={i}
              src={p.avatar}
              alt={p.name}
              className="competition-avatar"
              title={p.name}
            />
          ))}
        </div>
      </div>

      <div className="competition-section">
        <div className="competition-section-title">Deliverables</div>
        <ul className="competition-deliverables-list">
          {competition.deliverables.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>

      <div className="competition-section">
        <div className="competition-section-title">Competition Rules</div>
        <div className="competition-rules">
          <ul>
            {competition.rules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompetitionPage;