import React from "react";
import { useNavigate } from "react-router-dom";
import MentorCard from "../../components/Learner/MentorCard";

const mentors = [
  {
    id: 1,
    name: "Dr. Stella Orion",
    expertise: "Astrophysics, Exoplanets",
    description: "Exploring the cosmos through the lens of exoplanets and astrophysics.",
    availableSlots: 3,
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Prof. Neil Cosmos",
    expertise: "Cosmology, Dark Matter",
    description: "Passionate about unraveling the mysteries of dark matter and the universe.",
    availableSlots: 2,
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Dr. Luna Sky",
    expertise: "Astronomy Education, Outreach",
    description: "Dedicated to making astronomy accessible and exciting for everyone.",
    availableSlots: 1,
    image: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    id: 4,
    name: "Prof. John Cosmos",
    expertise: "Cosmology, Theoretical Physics",
    description: "Exploring the fundamental laws of the universe and their implications.",
    availableSlots: 2,
    image: "https://randomuser.me/api/portraits/men/31.jpg"
  }
];

const Mentors: React.FC = () => {
  const navigate = useNavigate();
  const handleApply = (mentorId: number) => {
    navigate(`/dashboard/apply-mentor/${mentorId}`);
  };
  return (
    <div className="mentors-page" style={{ padding: "20px",  margin: "0 auto" }}>
      <h1>Mentors & Influences</h1>
      <p>Find the right mentor or follow astronomy influencers for inspiration and updates.</p>
      <div className="mentors-list" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {mentors.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} onApply={handleApply} />
        ))}
      </div>
    </div>
  );
};

export default Mentors;