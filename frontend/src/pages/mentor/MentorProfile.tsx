import { memo, useRef, useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import avatarImg from '../../assets/world.png'; // Use your actual avatar asset path
import Button from '../../components/Button';
import '../../styles/pages/mentor/mentorprofile.scss';
// import { useNavigate } from 'react-router-dom';

const MentorProfile = memo(() => {
  const avatarRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const [videoMarginTop, setVideoMarginTop] = useState(0);

  useEffect(() => {
    if (avatarRef.current && videoBoxRef.current) {
      // Subtract 16px to lift the video up
      const margin = avatarRef.current.offsetTop + avatarRef.current.offsetHeight - 0;
      setVideoMarginTop(margin > 0 ? margin : 0);
    }
  }, []);

  return (
    <div className="dashboard-page">
      <h2>Mentor Profile</h2>
      <div className="mentor-profile-layout" style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
        {/* Left Card */}
        <div className="mentor-profile-left" style={{ minWidth: 500, maxWidth: 500, flex: '0 0 400px' }}>
          <div className="mentor-profile-avatar" ref={avatarRef}>
            <img src={avatarImg} alt="Mentor Avatar" />
          </div>
          <div className="mentor-profile-info-list">
            <div className="mentor-profile-info-item">
              <label>Full Name</label>
              <div className="value">Senesh Dinelka</div>
            </div>
            <div className="mentor-profile-info-item">
              <label>User Name</label>
              <div className="value">Don_lena</div>
            </div>
            <div className="mentor-profile-info-item">
              <label>Email</label>
              <div className="value">kgsdgamage2000@email.com</div>
            </div>
            <div className="mentor-profile-info-item">
              <label>Password</label>
              <div className="value">••••••••</div>
            </div>
            <div className="mentor-profile-info-item rating">
              <label>Rating</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <StarIcon style={{ width: 20, color: '#fbbf24' }} />
                <StarIcon style={{ width: 20, color: '#fbbf24' }} />
                <StarIcon style={{ width: 20, color: '#fbbf24' }} />
                <StarIcon style={{ width: 20, color: '#fbbf24' }} />
                <StarIcon style={{ width: 20, color: '#cbd5e1' }} />
                <span className="rating-number" style={{ color: '#a0aec0', fontWeight: 500, marginLeft: 8 }}>Rated 4.0/5.0</span><br />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 32, width: '80%' }}>
            <Button className="w-full">
              Check Reviews
            </Button>
          </div>
        {/* Intro Video as a separate section */}
        <div className="advanced-features mentor-profile-field-box mentor-profile-intro-video" style={{ marginTop: 120 }}>
          <label>Intro Video</label>
          <div className="mentor-profile-field-value" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
            <iframe
              width="400"
              height="200"
              src="https://www.youtube.com/embed/sdGseNKrurA"
              title="Mentor Introduction Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block', borderRadius: 12 }}
            ></iframe>
          </div>
        </div>
        </div>
        {/* Right Section */}
        <div style={{ flex: 1, minWidth: 1000, maxWidth: 1000, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Removed video section from here. Now starts with qualifications. */}
          <div className="advanced-features mentor-profile-field-box">
            <label>Qualifications and Years of expertise in Astronomy</label>
            <div className="mentor-profile-field-value">PhD in Astrophysics, 10+ years experience</div>
          </div>
          <div className="advanced-features mentor-profile-field-box">
            <label>Location</label>
            <div className="mentor-profile-field-value">New York, USA</div>
          </div>
          <div className="advanced-features mentor-profile-field-box">
            <label>Institute / University</label>
            <div className="mentor-profile-field-value">Columbia University</div>
          </div>
          <div className="advanced-features mentor-profile-field-box">
            <label>Contact Number</label>
            <div className="mentor-profile-field-value">+1 234 567 8901</div>
          </div>
          <div className="advanced-features mentor-profile-field-box">
            <label>Research and Interests</label>
            <div className="mentor-profile-field-value">Exoplanets, Black Holes, Public Outreach</div>
          </div>
          <div className="advanced-features mentor-profile-field-box">
            <label>Additional Information</label>
            <div className="mentor-profile-field-value">Available for online mentoring and workshops.</div>
          </div>
          <div style={{ marginTop: 32, minWidth: 180 }}>
            <Button>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MentorProfile;

  