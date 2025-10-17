import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import '../../styles/pages/mentor/SelfContent.scss'

export type Mentor = {
  name?: string
  avatarUrl?: string
  qualifications?: string[]
  services?: string[]
  promoDescription?: string
  menteeCount?: number
  maxMentees?: number
  isAvailable?: boolean
  email?: string
  specialties?: string[]
}

type Props = {
  mentor?: Mentor
}

const SelfContent: React.FC<Props> = ({ mentor = {} }) => {
  const navigate = useNavigate()
  
  // Form state
  const [formData, setFormData] = useState({
    name: mentor.name || '',
    email: mentor.email || '',
    avatarUrl: mentor.avatarUrl || '',
    bio: mentor.promoDescription || '',
    maxMentees: mentor.maxMentees || 15,
    isAvailable: mentor.isAvailable ?? true,
    specialties: mentor.specialties || [],
    qualifications: mentor.qualifications || [],
  })

  const [newSpecialty, setNewSpecialty] = useState('')
  const [newQualification, setNewQualification] = useState('')

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }))
      setNewSpecialty('')
    }
  }

  const handleRemoveSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }))
  }

  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()]
      }))
      setNewQualification('')
    }
  }

  const handleRemoveQualification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save to API/context
    console.log('Saving mentor profile:', formData)
    alert('Profile saved successfully!')
    navigate('/dashboard/mentordashboard')
  }

  const handleCancel = () => {
    navigate('/dashboard/mentordashboard')
  }

  return (
    <div className="selfcontent-page">
      <div className="selfcontent-header">
        <div className="selfcontent-header-top">
          <Button 
            variant="ghost" 
            size="medium" 
            onClick={handleCancel}
            className="selfcontent-back-btn"
          >
            ← Back to Dashboard
          </Button>
        </div>
        <h1 className="selfcontent-title">Edit Mentor Profile</h1>
        <p className="selfcontent-subtitle">Update your information to attract the right mentees</p>
      </div>

      <form className="selfcontent-form" onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div className="selfcontent-section">
          <h2 className="selfcontent-section-title">
            <span className="section-icon">👤</span>
            Basic Information
          </h2>
          
          <div className="selfcontent-form-grid">
            <div className="selfcontent-form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Dr. Jane Smith"
                required
              />
            </div>

            <div className="selfcontent-form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jane.smith@astrohub.com"
                required
              />
            </div>

            <div className="selfcontent-form-group full-width">
              <label htmlFor="avatarUrl">Profile Picture URL</label>
              <input
                type="url"
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="selfcontent-form-group full-width">
              <label htmlFor="bio">About / Bio *</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell potential mentees about your experience, teaching style, and what you can help them with..."
                rows={4}
                required
              />
            </div>
          </div>
        </div>

        {/* Availability & Capacity Section */}
        <div className="selfcontent-section">
          <h2 className="selfcontent-section-title">
            <span className="section-icon">📅</span>
            Availability & Capacity
          </h2>
          
          <div className="selfcontent-form-grid">
            <div className="selfcontent-form-group">
              <label htmlFor="maxMentees">Maximum Mentees</label>
              <input
                type="number"
                id="maxMentees"
                name="maxMentees"
                value={formData.maxMentees}
                onChange={handleInputChange}
                min="1"
                max="50"
                required
              />
              <span className="form-hint">How many mentees can you mentor at once?</span>
            </div>

            <div className="selfcontent-form-group">
              <label htmlFor="isAvailable">Availability Status</label>
              <select
                id="isAvailable"
                name="isAvailable"
                value={formData.isAvailable ? 'available' : 'unavailable'}
                onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.value === 'available' }))}
                className="selfcontent-select"
              >
                <option value="available">✓ Available for New Mentees</option>
                <option value="unavailable">✗ Not Available</option>
              </select>
              <span className="form-hint">Select your availability for new mentees</span>
            </div>
          </div>
        </div>

        {/* Specialties Section */}
        <div className="selfcontent-section">
          <h2 className="selfcontent-section-title">
            <span className="section-icon">⭐</span>
            Specialties
          </h2>
          
          <div className="selfcontent-tags-input">
            <div className="tags-input-wrapper">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
                placeholder="e.g., Exoplanets, Data Analysis, Astrophotography"
              />
              <Button type="button" onClick={handleAddSpecialty}>
                + Add
              </Button>
            </div>
            <div className="tags-list">
              {formData.specialties.map((specialty, index) => (
                <span key={index} className="tag">
                  {specialty}
                  <button type="button" onClick={() => handleRemoveSpecialty(index)} className="remove-tag">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Qualifications Section */}
        <div className="selfcontent-section">
          <h2 className="selfcontent-section-title">
            <span className="section-icon">🎓</span>
            Qualifications
          </h2>
          
          <div className="selfcontent-list-input">
            <div className="list-input-wrapper">
              <input
                type="text"
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQualification())}
                placeholder="e.g., PhD in Astronomy, 10 years teaching experience"
              />
              <Button type="button" onClick={handleAddQualification}>
                + Add
              </Button>
            </div>
            <ul className="items-list">
              {formData.qualifications.map((qualification, index) => (
                <li key={index} className="list-item">
                  <span className="item-icon">✓</span>
                  <span className="item-text">{qualification}</span>
                  <button type="button" onClick={() => handleRemoveQualification(index)} className="remove-item">
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="selfcontent-actions">
          <Button type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">
            💾 Save Profile
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SelfContent
