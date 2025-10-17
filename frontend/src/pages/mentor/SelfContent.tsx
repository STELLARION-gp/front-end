import React from 'react'
import '../../styles/pages/mentor/SelfContent.scss'

export type Mentor = {
  name?: string
  avatarUrl?: string
  qualifications?: string[]
  services?: string[]
  promoDescription?: string
  menteeCount?: number
  isAvailable?: boolean
  email?: string
  specialties?: string[]
}

type Props = {
  mentor?: Mentor
}

const SelfContent: React.FC<Props> = ({ mentor = {} }) => {
  const {
    name = 'Unnamed Mentor',
    avatarUrl = '',
    qualifications = [],
    services = [],
    promoDescription = '',
    menteeCount = 0,
    isAvailable = false,
    email = '',
    specialties = [],
  } = mentor

  return (
    <div className="selfcontent-page">
      <div className="selfcontent-mentor-card selfcontent-mentor-card--modern">
        <div className="selfcontent-mentor-card__avatar-bg">
          <img src={avatarUrl || 'https://via.placeholder.com/96'} alt={`${name} avatar`} className="selfcontent-mentor-card__image" />
        </div>
        <div className="selfcontent-mentor-card__info__apply">
          <h2 className="selfcontent-mentor-card__name">{name}</h2>
          <div className="selfcontent-mentor-card__status-row">
            <span className={`selfcontent-mentor-card__status-dot ${isAvailable ? 'selfcontent-available' : 'selfcontent-unavailable'}`} />
            <span className="selfcontent-mentor-card__status-text">{isAvailable ? 'Available for mentoring' : 'Not available'}</span>
            <span className="selfcontent-mentor-card__slots">{menteeCount} mentee{menteeCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="selfcontent-mentor-card__desc">{promoDescription || 'No description provided.'}</div>
          <div className="selfcontent-mentor-card__email">{email || 'Not provided'}</div>
        </div>
      </div>

      <div className="selfcontent-mentor-details">
        <section className="selfcontent-mentor-section">
          <h3>Qualifications</h3>
          {qualifications.length ? (
            <ul>
              {qualifications.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          ) : (
            <p className="selfcontent-empty">No qualifications listed.</p>
          )}
        </section>

        <section className="selfcontent-mentor-section">
          <h3>Services</h3>
          {services.length ? (
            <ul>
              {services.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <p className="selfcontent-empty">No services listed.</p>
          )}
        </section>

        <section className="selfcontent-mentor-section">
          <h3>Specialties</h3>
          {specialties.length ? (
            <div className="selfcontent-chips">
              {specialties.map((sp, i) => (
                <span key={i} className="selfcontent-chip">{sp}</span>
              ))}
            </div>
          ) : (
            <p className="selfcontent-empty">No specialties provided.</p>
          )}
        </section>

      </div>

      <div className="selfcontent-mentor-actions">
        <button className="selfcontent-btn selfcontent-btn--primary">Request Mentorship</button>
        <button className="selfcontent-btn">Message</button>
      </div>
    </div>
  )
}

export default SelfContent
