import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/pages/learner/ApplyMentor.scss";
import Button from "../../components/Button";

const mentors = [
  {
    id: 1,
    name: "Dr. Stella Orion",
    expertise: "Astrophysics, Exoplanets",
    availableSlots: 3,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Renowned astrophysicist with 15+ years of research in exoplanetary systems. Passionate about mentoring young astronomers.",
    email: "stella.orion@astrohub.com"
  },
  {
    id: 2,
    name: "Prof. Neil Cosmos",
    expertise: "Cosmology, Dark Matter",
    availableSlots: 2,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Cosmology professor and dark matter researcher. Loves to inspire curiosity about the universe.",
    email: "neil.cosmos@astrohub.com"
  },
  {
    id: 3,
    name: "Dr. Luna Sky",
    expertise: "Astronomy Education, Outreach",
    availableSlots: 1,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    bio: "Award-winning educator and outreach specialist. Dedicated to making astronomy accessible to all.",
    email: "luna.sky@astrohub.com"
  }
];

const ApplyMentor: React.FC = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const mentor = mentors.find(m => m.id === Number(mentorId));
  const [interest, setInterest] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    if (selected.length + files.length > 2) {
      setError("You can upload a maximum of 2 documents.");
      return;
    }
    setFiles([...files, ...selected].slice(0, 2));
    setError("");
  };
  const handleRemoveFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interest.trim()) {
      setError("Please enter your interest.");
      return;
    }
    // Here you would send the application data to backend
    alert("Application submitted!");
    navigate("/mentors");
  };
  if (!mentor) return <div>Mentor not found.</div>;
  return (
    <div className="apply-mentor-page">
      <div className="mentor-card mentor-card--modern mentor-card--apply">
        <div className="mentor-card__avatar-bg">
          {mentor.image && (
            <img src={mentor.image} alt={mentor.name} className="mentor-card__image" />
          )}
        </div>
        <div className="mentor-card__info__apply">
          <h2 className="mentor-card__name">{mentor.name}</h2>
          <div className="mentor-card__expertise"><b>{mentor.expertise}</b></div>
          <div className="mentor-card__desc">{mentor.bio}</div>
          <div className="mentor-card__slots">Available Slots: {mentor.availableSlots}</div>
          <div className="mentor-card__email">Email: {mentor.email}</div>
        </div>
      </div>
      <form className="apply-form" onSubmit={handleSubmit}>
        <label htmlFor="interest">Why are you interested in this mentorship?</label>
        <textarea
          id="interest"
          value={interest}
          onChange={e => setInterest(e.target.value)}
          rows={4}
          placeholder="Describe your interest..."
        />
        <label htmlFor="cv-upload">Upload CV or supporting documents (max 2):</label>
        <input
          id="cv-upload"
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.png"
          multiple
          onChange={handleFileChange}
          disabled={files.length >= 2}
        />
        <div className="file-list">
          {files.map((file, idx) => (
            <div key={idx} className="file-item">
              <span>{file.name}</span>
              <button type="button" onClick={() => handleRemoveFile(idx)}>&times;</button>
            </div>
          ))}
        </div>
        {error && <div className="error-msg">{error}</div>}
        <Button type="submit">Apply</Button>
      </form>
    </div>
  );
};

export default ApplyMentor;
