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
}

const InfluencerCard: React.FC<InfluencerCardProps> = ({ influencer, onFollow }) => {
  return (
    <div className="influencer-card" style={{ background: '#23293a', borderRadius: '1rem', padding: '1.2rem', width: 400, color: '#fff', boxShadow: '0 2px 8px rgba(59,130,246,0.10)' }}>
      <img src={influencer.image} alt={influencer.name} style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: '0.7rem', objectFit: 'cover', border: '2px solid #6366f1' }} />
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.3rem' }}>{influencer.name}</div>
      <div style={{ color: '#facc15', fontSize: '0.95rem', marginBottom: '0.3rem' }}>{influencer.expertise}</div>
      <div style={{ fontSize: '0.95rem', marginBottom: '0.7rem' }}>{influencer.description}</div>
      <Button
        variant={influencer.isFollowed ? "success" : "primary"}
        size="small"
        onClick={() => onFollow(influencer.id)}
      >{influencer.isFollowed ? "Following" : "Follow"}</Button>
    </div>
  );
};

export default InfluencerCard;
