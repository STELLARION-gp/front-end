import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/pages/admin/MentorProfileDetail.scss';

const mentors = [
  {
    id: '1',
    user_id: 'U1001',
    name: 'Dr. Stella Orion',
    email: 'stella.orion@example.com',
    phone_number: '+1-555-1234',
    country: 'USA',
    specialist_areas: ['Astrophysics', 'Education', 'Mentoring'],
    description: 'Astrophysicist and educator with 15+ years of mentoring experience. Passionate about guiding future scientists.',
    awards: ['NASA Mentorship Award 2022', 'Best Educator 2020'],
    total_number_of_mentees: 8,
    number_of_available_slots: 2,
    experiences: ['Professor at MIT', 'Lead Scientist at NASA', 'Mentor at Science Outreach'],
    certificates: ['PhD in Astrophysics', 'Certified Mentor'],
    achievements: ['Published 30+ research papers', 'Guided 50+ mentees to success'],
    created_at: '2023-01-15',
    max_mentees: 10,
    sessions_completed: 120,
    rating: 4.9,
    bio: 'Astrophysicist and educator with 15+ years of mentoring experience. Passionate about guiding future scientists.',
    linkedin: 'https://linkedin.com/in/stellaorion',
    mentees: [
      {
        id: 'm1',
        name: 'Alice Vega',
        email: 'alice.vega@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        field: 'Physics',
      },
      {
        id: 'm2',
        name: 'Bob Lee',
        email: 'bob.lee@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        field: 'Astronomy',
      },
      {
        id: 'm3',
        name: 'Cathy Sun',
        email: 'cathy.sun@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        field: 'Astrophysics',
      },
    ],
    reviews: [
      {
        id: 'r1',
        mentee: 'Alice Vega',
        rating: 5,
        comment: 'Dr. Orion is an amazing mentor! She helped me understand complex concepts and guided my research.',
        date: '2024-03-10',
      },
      {
        id: 'r2',
        mentee: 'Bob Lee',
        rating: 4.5,
        comment: 'Very supportive and knowledgeable. Her sessions are always insightful.',
        date: '2024-04-02',
      },
      {
        id: 'r3',
        mentee: 'Cathy Sun',
        rating: 5,
        comment: 'Best mentor I have ever had! Highly recommend to anyone interested in astrophysics.',
        date: '2024-05-18',
      },
    ],
  },
  // ...other mentors
];

const MentorProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mentor = mentors.find(m => m.id === id);

  if (!mentor) {
    return <div className="mentor-profile-bg"><div className="mentor-profile-container">Mentor not found.</div></div>;
  }
  return (
    <div className="mentor-profile-bg">
      <div className="mentor-profile-container">
        <div className="mentor-profile-header">
          <div>
            <h2 className="mentor-profile-title">{mentor.name}</h2>
            <p className="mentor-profile-bio">{mentor.description}</p>
          </div>
          <Button variant="secondary" className="mentor-profile-back-btn" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
        
        <div className="mentor-profile-content">
          <div className="mentor-details-section">
            <div className="mentor-profile-info">
              <span>Email: <b>{mentor.email}</b></span>
              <span>Phone: <b>{mentor.phone_number}</b></span>
              <span>Country: <b>{mentor.country}</b></span>
              <span>Specialist Areas: <b>{mentor.specialist_areas.join(', ')}</b></span>
              <span>Max Mentees: <b>{mentor.max_mentees}</b></span>
              <span>Total Mentees: <b>{mentor.total_number_of_mentees}</b></span>
              <span>Available Slots: <b>{mentor.number_of_available_slots}</b></span>
              <span>Sessions Completed: <b>{mentor.sessions_completed}</b></span>
              <span>Rating: <b>{mentor.rating}</b></span>
              <span>Created At: <b>{mentor.created_at}</b></span>
              <span>LinkedIn: <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer">Profile</a></span>
            </div>
            <div className="mentor-profile-extra">
              <div className="mentor-profile-list">
                <b>Awards:</b>
                <ul>{mentor.awards.map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>
              <div className="mentor-profile-list">
                <b>Experiences:</b>
                <ul>{mentor.experiences.map((e, i) => <li key={i}>{e}</li>)}</ul>
              </div>
              <div className="mentor-profile-list">
                <b>Certificates:</b>
                <ul>{mentor.certificates.map((c, i) => <li key={i}>{c}</li>)}</ul>
              </div>
              <div className="mentor-profile-list">
                <b>Achievements:</b>
                <ul>{mentor.achievements.map((ach, i) => <li key={i}>{ach}</li>)}</ul>
              </div>
            </div>
          </div>
          
          <div className="mentor-reviews-section">
            <div className="mentor-profile-reviews">
              <b>Reviews from Mentees:</b>
              <ul>
                {mentor.reviews && mentor.reviews.length > 0 ? (
                  mentor.reviews.map(review => (
                    <li key={review.id} className="mentor-review-item">
                      <div className="mentor-review-header">
                        <span className="mentor-review-mentee">{review.mentee}</span>
                        <span className="mentor-review-rating">Rating: {review.rating} ⭐</span>
                        <span className="mentor-review-date">{review.date}</span>
                      </div>
                      <div className="mentor-review-comment">{review.comment}</div>
                    </li>
                  ))
                ) : (
                  <li>No reviews yet.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mentor-profile-section">
          <h3 className="mentor-profile-section-title">Mentees</h3>
          <div className="mentor-mentees-list">
            {mentor.mentees.map(mentee => (
              <div key={mentee.id} className="mentee-card">
                <img src={mentee.avatar} alt={mentee.name} className="mentee-avatar" />
                <div className="mentee-info">
                  <div className="mentee-name">{mentee.name}</div>
                  <div className="mentee-field">{mentee.field}</div>
                  <div className="mentee-email">{mentee.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfileDetail;
