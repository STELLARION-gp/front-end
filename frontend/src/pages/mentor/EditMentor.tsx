import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import avatarImg from '../../assets/world.png';
import Button from '../../components/Button';
import '../../styles/pages/mentor/mentorprofile.scss';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/_logoutModal.scss';

const EditMentor = () => {
  const [form, setForm] = useState({
    fullName: 'John Doe',
    userName: 'astro_john',
    email: 'john.doe@email.com',
    password: '********',
    rating: 4,
    qualifications: 'PhD in Astrophysics, 10+ years experience',
    location: 'New York, USA',
    institute: 'Columbia University',
    contact: '+1 234 567 8901',
    research: 'Exoplanets, Black Holes, Public Outreach',
    additional: 'Available for online mentoring and workshops.',
    video: 'https://www.youtube.com/embed/sdGseNKrurA',
  });
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [videoInput, setVideoInput] = useState('');
  const [pendingVideo, setPendingVideo] = useState(form.video);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoPopup = () => {
    setVideoInput('');
    setShowVideoPopup(true);
  };
  const handleSaveVideo = () => {
    // Extract embed link from YouTube URL
    const match = videoInput.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match) {
      setForm({ ...form, video: `https://www.youtube.com/embed/${match[1]}` });
      setPendingVideo(`https://www.youtube.com/embed/${match[1]}`);
      setShowVideoPopup(false);
      // Redirect to MentorProfile and show new video (simulate real-time update)
      navigate('/dashboard/mentorprofile', { state: { video: `https://www.youtube.com/embed/${match[1]}` } });
    }
  };
  const handleCancelVideo = () => {
    setShowVideoPopup(false);
    navigate('/dashboard/mentorprofile');
  };

  const handleSave = () => {
    setShowConfirmPopup(true);
  };
  const handleConfirmSave = () => {
    setShowConfirmPopup(false);
    navigate('/dashboard/mentorprofile', { state: { ...form } });
  };
  const handleCancelSave = () => {
    setShowConfirmPopup(false);
  };

  const handleCancel = () => {
    navigate('/dashboard/mentorprofile');
  };

  return (
    <div className="dashboard-page">
      <h2>Edit Mentor Profile</h2>
      <div className="mentor-profile-layout" style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
        {/* Left Card */}
        <div className="mentor-profile-left" style={{ minWidth: 500, maxWidth: 500, flex: '0 0 500px' }}>
          <div className="mentor-profile-avatar">
            <img src={avatarImg} alt="Mentor Avatar" />
          </div>
          <div className="mentor-profile-info-list">
            <div className="mentor-profile-info-item">
              <label>Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} className="mentor-edit-input" />
            </div>
            <div className="mentor-profile-info-item">
              <label>User Name</label>
              <input name="userName" value={form.userName} onChange={handleChange} className="mentor-edit-input" />
            </div>
            <div className="mentor-profile-info-item">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="mentor-edit-input" />
            </div>
            <div className="mentor-profile-info-item">
              <label>Password</label>
              <input name="password" value={form.password} onChange={handleChange} className="mentor-edit-input" type="password" />
            </div>
            <div className="mentor-profile-info-item">
              <label>Confirm Password</label>
              <input name="password" value={form.password} onChange={handleChange} className="mentor-edit-input" type="password" />
            </div>
            <div className="mentor-profile-info-item rating">
              <label>Rating</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {[1,2,3,4,5].map((i) => (
                  <StarIcon key={i} style={{ width: 20, color: i <= form.rating ? '#fbbf24' : '#cbd5e1', cursor: 'pointer' }} onClick={() => setForm({ ...form, rating: i })} />
                ))}
                <span className="rating-number" style={{ color: '#a0aec0', fontWeight: 500, marginLeft: 8 }}>{`Rated ${form.rating}.0/5.0`}</span><br />
              </div>
            </div>
          </div>
          {/* Intro Video Section */}
          <div className="advanced-features mentor-profile-field-box mentor-profile-intro-video" style={{ marginTop: 50 }}>
            <label>Intro Video</label>
            <div className="mentor-profile-field-value" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>
              <iframe
                width="400"
                height="200"
                src={form.video}
                title="Mentor Introduction Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block', borderRadius: 12 }}
              ></iframe>
            </div>
            {/* Get Link Button and Popup */}
            <div style={{ marginTop: 12, width: 400, marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button className="w-full" onClick={handleVideoPopup}>Get Link</Button>
            </div>
            {showVideoPopup && (
              <div className="logout-modal-backdrop">
                <div className="logout-modal">
                  <div className="logout-modal-header">
                    <h3 className="logout-modal-title">Update Intro Video</h3>
                  </div>
                  <div className="logout-modal-body">
                    <input
                      className="mentor-edit-input"
                      placeholder="Paste YouTube link here"
                      value={videoInput}
                      onChange={e => setVideoInput(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div className="logout-modal-footer">
                    <button className="logout-modal-button logout-modal-button--confirm" style={{ background: '#22c55e', color: 'white' }} onClick={handleSaveVideo}>Save</button>
                    <button className="logout-modal-button logout-modal-button--cancel" style={{ background: '#ef4444', color: 'white', border: '1px solid #ef4444' }} onClick={handleCancelVideo}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            {/* Save/Cancel Buttons at the bottom of left card */}
            <div style={{ marginTop: 32, width: 400, marginLeft: 'auto', marginRight: 'auto', display: 'flex', gap: 16 }}>
              <button className="logout-modal-button logout-modal-button--confirm w-full" style={{ background: '#22c55e', color: 'white' }} onClick={handleSave}>Save</button>
              <button className="logout-modal-button logout-modal-button--cancel w-full" style={{ background: '#ef4444', color: 'white', border: '1px solid #ef4444' }} onClick={handleCancel}>Cancel</button>
            </div>
            {showConfirmPopup && (
              <div className="logout-modal-backdrop">
                <div className="logout-modal">
                  <div className="logout-modal-header">
                    <h3 className="logout-modal-title">Confirm Save</h3>
                  </div>
                  <div className="logout-modal-body">
                    Are you sure you want to save these changes?
                  </div>
                  <div className="logout-modal-footer">
                    <button className="logout-modal-button logout-modal-button--confirm" style={{ background: '#22c55e', color: 'white' }} onClick={handleConfirmSave}>Yes, Save</button>
                    <button className="logout-modal-button logout-modal-button--cancel" style={{ background: '#ef4444', color: 'white', border: '1px solid #ef4444' }} onClick={handleCancelSave}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Right Section */}
        <div style={{ flex: 1, minWidth: 1000, maxWidth: 1000, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="advanced-features mentor-profile-field-box">
            <label>Qualifications and Years of expertise in Astronomy</label>
            <textarea name="qualifications" value={form.qualifications} onChange={handleChange} className="mentor-edit-input" />
          </div>
          <div className="advanced-features mentor-profile-field-box">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} className="mentor-edit-input" />
          </div>
          <div className="advanced-features mentor-profile-field-box">
            <label>Institute / University</label>
            <input name="institute" value={form.institute} onChange={handleChange} className="mentor-edit-input" />
          </div>
          <div className="advanced-features mentor-profile-field-box">
            <label>Contact Number</label>
            <input name="contact" value={form.contact} onChange={handleChange} className="mentor-edit-input" />
          </div>
          <div className="advanced-features mentor-profile-field-box">
            <label>Research and Interests</label>
            <textarea name="research" value={form.research} onChange={handleChange} className="mentor-edit-input" />
          </div>
          <div className="advanced-features mentor-profile-field-box">
            <label>Additional Information</label>
            <textarea name="additional" value={form.additional} onChange={handleChange} className="mentor-edit-input" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMentor; 