import React from "react";
import { useNavigate } from "react-router-dom";
import MentorCard from "../../components/Learner/MentorCard";
import InfluencerCard from "../../components/Learner/InfluencerCard";

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
  // Influencer data
  const [influencers, setInfluencers] = React.useState([
    {
      id: 1,
      name: "Dr. Nova Star",
      expertise: "Astronomy Communication",
      description: "Sharing cosmic discoveries and science news with the world.",
      image: "https://randomuser.me/api/portraits/women/50.jpg",
      isFollowed: false
    },
    {
      id: 2,
      name: "Prof. Leo Galaxy",
      expertise: "Space Exploration",
      description: "Updates on missions, telescopes, and the future of space travel.",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      isFollowed: false
    },
    {
      id: 3,
      name: "Prof. Celeste Nebula",
      expertise: "Space Exploration",
      description: "Updates on missions, telescopes, and the future of space travel.",
      image: "https://randomuser.me/api/portraits/women/46.jpg",
      isFollowed: false
    }
  ]);

  const handleFollow = (id: number) => {
    setInfluencers(prev => prev.map(inf => inf.id === id ? { ...inf, isFollowed: !inf.isFollowed } : inf));
  };

  return (
    <div className="mentors-page" style={{ padding: "20px", margin: "0 auto" }}>
      <h1>Mentors & Influences</h1>
      <p>Find the right mentor or follow astronomy influencers for inspiration and updates.</p>
      <h2 style={{ marginTop: '1.5rem', color: '#6366f1' }}>Mentors</h2>
      <div className="mentors-list" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: '2rem' }}>
        {mentors.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} onApply={handleApply} />
        ))}
      </div>
      <h2 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: '#6366f1' }}>Influencers</h2>
      <div className="influencers-list" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {influencers.map((influencer) => (
          <InfluencerCard key={influencer.id} influencer={influencer} onFollow={handleFollow} />
        ))}
      </div>
    </div>
  );
};

export default Mentors;