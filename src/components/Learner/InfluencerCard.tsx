
import React from "react";
import Button from "../Button";


interface Influencer {
  id: number;
  name: string;
  expertise: string;
  description: string;
  image: string;
  isFollowed: boolean;
}


interface InfluencerCardProps {
  influencer: Influencer;
  onFollow: (id: number) => void;
  onOpen?: (name: string) => void;
}


const InfluencerCard: React.FC<InfluencerCardProps> = ({ influencer, onFollow, onOpen }) => {
  return (
    <div className="influencer-card" style={{ background: '#23293a', borderRadius: '1rem', padding: '1.2rem', width: 400, color: '#fff', boxShadow: '0 2px 8px rgba(59,130,246,0.10)', position: 'relative' }}>
      <img src={influencer.image} alt={influencer.name} style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: '0.7rem', objectFit: 'cover', border: '2px solid #6366f1' }} />
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>{influencer.name}</div>
      <div style={{ color: '#facc15', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{influencer.expertise}</div>
      <div style={{ fontSize: '0.95rem', marginBottom: '0.7rem' }}>{influencer.description}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.7rem' }}>
        {influencer.isFollowed ? (
          <span style={{ background: '#22c55e', color: '#fff', borderRadius: '9999px', padding: '0.3rem 1rem', fontWeight: 600, fontSize: '0.95rem' }}>Following</span>
        ) : (
          <Button
            variant="primary"
            size="small"
            onClick={() => onFollow(influencer.id)}
          >Follow</Button>
        )}
        {onOpen && (
          <Button
            variant="secondary"
            size="small"
            onClick={() => onOpen(influencer.name)}
          >Open</Button>
        )}
      </div>
    </div>
  );
};

export default InfluencerCard;
