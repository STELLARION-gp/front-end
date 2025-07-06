import React from "react";
import { useNavigate } from "react-router-dom";
import MentorCard from "../../components/Learner/MentorCard";

const mentors = [
  {
    id: 1,
    name: "Dr. Stella Orion",
    expertise: "Astrophysics, Exoplanets",
    availableSlots: 3,
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Prof. Neil Cosmos",
    expertise: "Cosmology, Dark Matter",
    availableSlots: 2,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Dr. Luna Sky",
    expertise: "Astronomy Education, Outreach",
    availableSlots: 1,
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const Mentors: React.FC = () => {
  const navigate = useNavigate();
  const handleApply = (mentorId: number) => {
    navigate(`/dashboard/apply-mentor/${mentorId}`);
  };
  return (
    <div className="mentors-page">
      <h1>Mentors</h1>
      <div className="mentors-list">
        {mentors.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} onApply={handleApply} />
        ))}
      </div>
    </div>
  );
};

export default Mentors;