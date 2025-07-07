import React, { useState } from "react";

import '../../styles/pages/learner/NightCampDetails.scss';
import Button from "../../components/Button";

// Mock data for demonstration
const camp = {
  id: 1,
  title: "Stargazing Night Camp",
  date: "July 15, 2025",
  time: "8:00 PM",
  location: "Colombo",
  description: "Join us for a magical night under the stars! Enjoy guided telescope sessions, constellation tours, and fun science activities.",
  price: 1500,
  photos: [
    "https://images.unsplash.com/photo-1464983953574-0892a716854b",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca"
  ],
  volunteers: [
    { name: "Nimal Perera", role: "Coordinator", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Samanthi Silva", role: "Education Specialist", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Kasun Jayasuriya", role: "Activity Leader", avatar: "https://randomuser.me/api/portraits/men/45.jpg" }
  ]
};

const initialComments = [
  {
    name: "Ayesha Fernando",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    date: "2025-07-01",
    text: "Amazing experience! The volunteers were super helpful and the night sky was breathtaking."
  },
  {
    name: "Ruwan Gunasekara",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    date: "2025-07-02",
    text: "Loved the telescope session. Learned a lot about constellations!"
  }
];

const NightCampDetails: React.FC = () => {
  
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          name: "You",
          avatar: "https://randomuser.me/api/portraits/men/99.jpg",
          date: new Date().toISOString().slice(0, 10),
          text: newComment
        }
      ]);
      setNewComment("");
    }
  };

  return (
    <div className="night-camp-details">
      <div className="night-camp-details__header">
        <img src={camp.photos[0]} alt="Camp" className="camp-image" />
        <div className="camp-meta">
          <h2>{camp.title}</h2>
          <div className="meta-list">
            <div className="meta-item"><span role="img" aria-label="date">📅</span> {camp.date}</div>
            <div className="meta-item"><span role="img" aria-label="time">⏰</span> {camp.time}</div>
            <div className="meta-item"><span role="img" aria-label="location">📍</span> {camp.location}</div>
          </div>
        </div>
      </div>

      <div className="night-camp-details__description">
        {camp.description}
      </div>

      <div className="night-camp-details__volunteers">
        <h3>Organizing Team</h3>
        <div className="volunteer-list">
          {camp.volunteers.map((v, i) => (
            <div className="volunteer-card" key={i}>
              <img src={v.avatar} alt={v.name} className="avatar" />
              <div className="vol-info">
                <div className="name">{v.name}</div>
                <div className="role">{v.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="night-camp-details__photos">
        <h3>Photos</h3>
        <div className="photo-gallery">
          {camp.photos.map((url, i) => (
            <img src={url} alt={`Camp photo ${i + 1}`} className="photo" key={i} />
          ))}
        </div>
      </div>

      <div className="night-camp-details__pay-section">
        <span className="price">LKR {camp.price}</span>
        <Button>Pay Now</Button>
      </div>

      <div className="night-camp-details__comments">
        <h3>Comments</h3>
        <div className="comment-list">
          {comments.map((c, i) => (
            <div className="comment" key={i}>
              <div className="comment-header">
                <img src={c.avatar} alt={c.name} className="avatar" />
                <span className="name">{c.name}</span>
                <span className="date">{c.date}</span>
              </div>
              <div className="comment-body">{c.text}</div>
            </div>
          ))}
        </div>
        <div className="add-comment">
          <textarea
            rows={2}
            placeholder="Add a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <Button onClick={handleAddComment}>Post</Button>
        </div>
      </div>
    </div>
  );
};

export default NightCampDetails;
