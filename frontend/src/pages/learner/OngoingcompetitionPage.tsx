import React from "react";
import "../../styles/pages/learner/OngoingCompetitionPage.scss";
import Button from "../../components/Button";

const ongoingCompetition = {
  coverImage:
    "https://cdn.pixabay.com/photo/2016/04/15/11/46/stars-1330570_1280.jpg",
  name: "Cosmic Capture: Astrophotography Showdown",
  date: "2025-07-01 to 2025-08-10",
  description:
    "Capture and submit your most stunning views of the cosmos. Showcase your creativity, technique, and passion for astronomy through astrophotography.",
  organizer: "AstroVision Society",
  contactEmail: "contact@astrovision.org",
  submissionDeadline: "2025-08-10T23:59:00Z",
  deliverables: [
    "📷 High-res Image (JPG/PNG, Max 20MB)",
    "📝 Image Description (Location, Equipment, Story)",
    "✅ Consent Form",
  ],
  participants: [
    { name: "Alex Starborn", avatar: "https://randomuser.me/api/portraits/men/71.jpg" },
    { name: "Nina Cosmos", avatar: "https://randomuser.me/api/portraits/women/56.jpg" },
    { name: "Leo Nebula", avatar: "https://randomuser.me/api/portraits/men/53.jpg" },
  ],
};

const OngoingCompetitionPage: React.FC = () => {
  const remainingDays = Math.max(
    0,
    Math.ceil(
      (new Date(ongoingCompetition.submissionDeadline).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="ongoing-competition-page">
      <div className="competition-header">
        <img
          src={ongoingCompetition.coverImage}
          alt={ongoingCompetition.name}
          className="competition-cover"
        />
        <div className="competition-header-info">
          <div className="competition-title">
            {ongoingCompetition.name}
            <span className="ongoing-badge">Ongoing</span>
          </div>
          <div className="competition-date">{ongoingCompetition.date}</div>
          <div className="competition-desc">{ongoingCompetition.description}</div>
          <div className="competition-organizer">
            <strong>Organized by:</strong> {ongoingCompetition.organizer}
          </div>
        </div>
      </div>

      <div className="competition-section">
        <h3>Registered Participants</h3>
        <div className="competition-participants">
          {ongoingCompetition.participants.map((p, i) => (
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
        <h3>Required Documents</h3>
        <ul className="deliverable-list">
          {ongoingCompetition.deliverables.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="competition-section upload-section">
        <h3>Submit Your Documents</h3>
        <p>Make sure all your documents are ready and valid before submitting.</p>
        <input type="file" multiple className="upload-input" />
        <Button className="submit-doc-btn">Upload</Button>
      </div>

      <div className="competition-section">
        <h3>Submission Deadline</h3>
        <p>
          You have <strong>{remainingDays}</strong> day{remainingDays !== 1 ? "s" : ""} remaining to submit your work.
        </p>
      </div>

      <div className="competition-section">
        <h3>Contact</h3>
        <p>
          For any inquiries, contact us at{" "}
          <a href={`mailto:${ongoingCompetition.contactEmail}`}>
            {ongoingCompetition.contactEmail}
          </a>
        </p>
      </div>
    </div>
  );
};

export default OngoingCompetitionPage;
