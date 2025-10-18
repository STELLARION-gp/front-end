import React from 'react';
import RollingGallery from './RollingGallery';
import TrueFocus from '../TrueFocus';
import '../../styles/components/TeamSection.scss';

const TeamSection: React.FC = () => {
  return (
    <section className="team-section">
      <div className="team-header">
        <div className="team-title-wrapper">
          <TrueFocus 
            sentence="Meet Our Team"
            manualMode={false}
            blurAmount={5}
            animationDuration={0.8}
            pauseBetweenAnimations={1.5}
          />
        </div>
        <p className="team-subtitle">
          The passionate individuals behind Stellarion
        </p>
      </div>
      
      <RollingGallery autoplay={true} pauseOnHover={true} />
      
      <div className="team-footer">
        <p>Drag or hover to explore our team members</p>
      </div>
    </section>
  );
};

export default TeamSection;
