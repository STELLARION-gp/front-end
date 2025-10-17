import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MentorCard from "../../components/Learner/MentorCard";
import InfluencerCard from "../../components/Learner/InfluencerCard";
import { getAllMentors } from "../../services/mentorApi";
import type { MentorProfile } from "../../services/mentorApi";

const Mentors: React.FC = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to truncate text to specific number of lines
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Helper function to format specialties (show first one and count)
  const formatSpecialties = (specialties?: string[]): string => {
    if (!specialties || specialties.length === 0) return 'Astronomy';
    if (specialties.length === 1) return specialties[0];
    return `${specialties[0]} +${specialties.length - 1} more`;
  };

  // Fetch mentors from backend
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const data = await getAllMentors({ available: true });
        
        // Transform backend data to match MentorCard props
        const transformedMentors = data.map((mentor: MentorProfile) => ({
          id: mentor.id,
          name: mentor.name,
          expertise: formatSpecialties(mentor.specialties),
          description: truncateText(mentor.bio || 'Experienced astronomy mentor', 180), // Approx 4 lines at ~45 chars/line
          availableSlots: mentor.maxMentees && mentor.menteeCount 
            ? mentor.maxMentees - mentor.menteeCount 
            : 0,
          image: mentor.avatarUrl || `https://randomuser.me/api/portraits/${mentor.id % 2 === 0 ? 'women' : 'men'}/${mentor.id % 50}.jpg`
        }));
        
        setMentors(transformedMentors);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching mentors:', err);
        setError('Failed to load mentors. Please try again later.');
        // Set empty array on error so UI doesn't break
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

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
      
      {/* Loading State */}
      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          <p>🔍 Loading mentors...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.5)', 
          borderRadius: '8px',
          color: '#ef4444',
          marginBottom: '1rem'
        }}>
          <p>⚠️ {error}</p>
        </div>
      )}
      
      {/* Mentors List */}
      {!loading && !error && mentors.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          <p>No mentors available at the moment. Check back later!</p>
        </div>
      )}
      
      {!loading && mentors.length > 0 && (
        <div className="mentors-list" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: '2rem' }}>
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} onApply={handleApply} />
          ))}
        </div>
      )}
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