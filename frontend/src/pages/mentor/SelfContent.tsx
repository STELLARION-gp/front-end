import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import '../../styles/pages/mentor/SelfContent.scss'
import { getMentorProfile, updateMentorProfile } from '../../services/mentorApi'
import type { MentorProfile } from '../../services/mentorApi'
import { auth } from '../../firebase'

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
  
  // Loading and error states
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
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

  // Fetch mentor profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const user = auth.currentUser
        if (!user) {
          setError('Please log in to edit your profile')
          setLoading(false)
          return
        }

        const token = await user.getIdToken()
        console.log('🔑 Fetching mentor profile for edit...')
        
        const profile = await getMentorProfile(token)
        console.log('✅ Received profile data:', profile)
        console.log('📝 Form will be populated with:', {
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
          bio: profile.bio,
          maxMentees: profile.maxMentees,
          isAvailable: profile.isAvailable,
          specialties: profile.specialties,
          qualifications: profile.qualifications
        })
        
        // Set form data with fetched profile or empty defaults
        const newFormData = {
          name: profile.name || '',
          email: profile.email || user.email || '',
          avatarUrl: profile.avatarUrl || '',
          bio: profile.bio || '',
          maxMentees: profile.maxMentees || 15,
          isAvailable: profile.isAvailable ?? true,
          specialties: Array.isArray(profile.specialties) ? profile.specialties : [],
          qualifications: Array.isArray(profile.qualifications) ? profile.qualifications : [],
        }
        
        console.log('🔧 Setting form data:', newFormData)
        console.log('🔍 Specialties check:', {
          raw: profile.specialties,
          isArray: Array.isArray(profile.specialties),
          length: profile.specialties?.length,
          final: newFormData.specialties
        })
        console.log('🔍 Qualifications check:', {
          raw: profile.qualifications,
          isArray: Array.isArray(profile.qualifications),
          length: profile.qualifications?.length,
          final: newFormData.qualifications
        })
        
        setFormData(newFormData)
        console.log('✅ Form data set successfully')
        setError(null)
      } catch (err: any) {
        console.error('❌ Error fetching mentor profile:', err)
        console.error('Error response:', err.response?.data)
        
        // Don't show error for new mentors - just use empty form
        if (err.response?.status === 403 || err.response?.status === 404) {
          // New mentor - load empty form with user's email
          const user = auth.currentUser
          if (user) {
            console.log('ℹ️ New mentor detected, loading empty form')
            setFormData({
              name: user.displayName || '',
              email: user.email || '',
              avatarUrl: user.photoURL || '',
              bio: '',
              maxMentees: 15,
              isAvailable: true,
              specialties: [],
              qualifications: [],
            })
          }
          setError(null)
        } else {
          setError(err.response?.data?.error || 'Failed to load profile')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      const user = auth.currentUser
      if (!user) {
        setError('Please log in to save your profile')
        return
      }

      const token = await user.getIdToken()
      
      await updateMentorProfile(token, {
        name: formData.name,
        email: formData.email,
        avatarUrl: formData.avatarUrl,
        bio: formData.bio,
        maxMentees: formData.maxMentees,
        isAvailable: formData.isAvailable,
        specialties: formData.specialties,
        qualifications: formData.qualifications,
      })

      setSuccessMessage('Profile saved successfully!')
      setTimeout(() => {
        navigate('/dashboard/mentordashboard')
      }, 1500)
    } catch (err: any) {
      console.error('Error saving mentor profile:', err)
      setError(err.response?.data?.error || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
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

      {loading && (
        <div className="loading-container">
          <p>Loading your profile...</p>
        </div>
      )}

      {error && (
        <div className="error-banner" style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          border: '1px solid rgba(239, 68, 68, 0.5)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          color: '#ef4444'
        }}>
          <span>⚠️ {error}</span>
        </div>
      )}

      {successMessage && (
        <div className="success-banner" style={{ 
          background: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid rgba(16, 185, 129, 0.5)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '1rem',
          color: '#10b981'
        }}>
          <span>✓ {successMessage}</span>
        </div>
      )}

      {!loading && (
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

            {/* <div className="selfcontent-form-group full-width">
              <label htmlFor="avatarUrl">Profile Picture URL</label>
              <input
                type="url"
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div> */}

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
          <Button type="button" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? '💾 Saving...' : '💾 Save Profile'}
          </Button>
        </div>
      </form>
      )}
    </div>
  )
}

export default SelfContent
