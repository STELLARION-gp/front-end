import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MentorCard from "../../components/Learner/MentorCard";
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
          availableSlots: mentor.maxMentees && mentor.menteeCount !== undefined
            ? mentor.maxMentees - mentor.menteeCount 
            : mentor.maxMentees || 0,
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
  
  

  

  return (
    <div className="preview-content" style={{ padding: "20px", margin: "0", textAlign: "left" }}>
      <h2 style={{ textAlign: "left", marginBottom: "0.5rem" }}>Mentors</h2>
      <p style={{ textAlign: "left", marginBottom: "1.5rem" }}>Find the right mentor for your astronomy journey.</p>
      
      {/* Loading State */}
      {loading && (
        <div style={{ padding: '2rem', textAlign: 'left', color: '#6b7280' }}>
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
          marginBottom: '1rem',
          textAlign: 'left'
        }}>
          <p>⚠️ {error}</p>
        </div>
      )}
      
      {/* Mentors List */}
      {!loading && !error && mentors.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'left', color: '#6b7280' }}>
          <p>No mentors available at the moment. Check back later!</p>
        </div>
      )}
      
      {!loading && mentors.length > 0 && (
        <div className="mentors-list" style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: '2rem', justifyContent: "flex-start" }}>
          {mentors.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} onApply={handleApply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Mentors;