import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  Users, 
  BookOpen, 
  Telescope, 
  Check,
  ArrowLeft
} from 'lucide-react';
import '../../styles/pages/guide/_campGuideApplication.scss';

interface ApplicationForm {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  
  // Professional Background
  currentOccupation: string;
  educationLevel: string;
  astronomyEducation: string;
  guideExperience: string;
  totalExperience: number;
  
  // Certifications & Skills
  certifications: string[];
  astronomySkills: string[];
  languages: string[];
  firstAid: boolean;
  drivingLicense: boolean;
  
  // Camp-Specific Experience
  campTypes: string[];
  groupSizes: string[];
  equipmentFamiliarity: string[];
  outdoorExperience: string;
  
  // Availability & Preferences
  availableDates: string[];
  preferredLocations: string[];
  accommodationNeeds: string;
  transportationNeeds: string;
  
  // Additional Information
  motivation: string;
  specialSkills: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Documents
  documents: {
    resume: File | null;
    certifications: File | null;
    portfolio: File | null;
    references: File | null;
  };
  
  // Agreement
  termsAccepted: boolean;
  backgroundCheckConsent: boolean;
}

interface CampEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  duration: string;
  participants: number;
  type: 'stargazing' | 'astrophotography' | 'workshop' | 'expedition';
  description: string;
  requirements: string[];
}

const CampGuideApplication: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationForm>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    currentOccupation: '',
    educationLevel: '',
    astronomyEducation: '',
    guideExperience: '',
    totalExperience: 0,
    certifications: [],
    astronomySkills: [],
    languages: [],
    firstAid: false,
    drivingLicense: false,
    campTypes: [],
    groupSizes: [],
    equipmentFamiliarity: [],
    outdoorExperience: '',
    availableDates: [],
    preferredLocations: [],
    accommodationNeeds: '',
    transportationNeeds: '',
    motivation: '',
    specialSkills: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    documents: {
      resume: null,
      certifications: null,
      portfolio: null,
      references: null
    },
    termsAccepted: false,
    backgroundCheckConsent: false
  });

  const [availableCamps, setAvailableCamps] = useState<CampEvent[]>([]);
  const [selectedCamps, setSelectedCamps] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulate fetching available camps
    const camps: CampEvent[] = [
      {
        id: '1',
        title: 'Stargazing Night Camp - Colombo',
        date: '2025-08-15',
        location: 'Colombo Observatory',
        duration: '2 days',
        participants: 50,
        type: 'stargazing',
        description: 'A magical night under the stars with telescope observations',
        requirements: ['Basic astronomy knowledge', 'Night vision experience', 'Group management']
      },
      {
        id: '2',
        title: 'Astrophotography Workshop Camp',
        date: '2025-09-10',
        location: 'Dark Sky Reserve - Nuwara Eliya',
        duration: '3 days',
        participants: 30,
        type: 'astrophotography',
        description: 'Learn advanced astrophotography techniques in perfect dark skies',
        requirements: ['Photography experience', 'Camera equipment knowledge', 'Technical teaching ability']
      },
      {
        id: '3',
        title: 'Family Astronomy Adventure',
        date: '2025-08-25',
        location: 'Kandy Science Center',
        duration: '1 day',
        participants: 40,
        type: 'workshop',
        description: 'Family-friendly introduction to astronomy and space science',
        requirements: ['Child-friendly teaching', 'Interactive presentation skills', 'Safety awareness']
      },
      {
        id: '4',
        title: 'Deep Space Expedition',
        date: '2025-10-05',
        location: 'Haputale Mountains',
        duration: '4 days',
        participants: 20,
        type: 'expedition',
        description: 'Advanced astronomy expedition with camping and deep-sky observations',
        requirements: ['Advanced astronomy', 'Camping experience', 'Leadership skills', 'First aid']
      }
    ];
    setAvailableCamps(camps);
  }, []);

  const totalSteps = 6;
//   const stepNames = [
//     'Personal Info',
//     'Background', 
//     'Skills',
//     'Experience',
//     'Preferences',
//     'Review'
//   ];

  const predefinedOptions = {
    educationLevels: [
      'High School',
      'Associate Degree',
      'Bachelor\'s Degree',
      'Master\'s Degree',
      'PhD',
      'Professional Certification'
    ],
    certifications: [
      'Certified Astronomy Guide',
      'Planetarium Operator',
      'First Aid/CPR',
      'Wilderness First Responder',
      'Teaching Certification',
      'Photography Certification',
      'Tour Guide License',
      'Safety Training'
    ],
    astronomySkills: [
      'Telescope Operation',
      'Star Chart Reading',
      'Constellation Identification',
      'Astrophotography',
      'Spectroscopy',
      'Planetary Observation',
      'Deep Sky Objects',
      'Solar Observation',
      'Meteorite Identification',
      'Space Mission Knowledge'
    ],
    languages: [
      'English',
      'Sinhala',
      'Tamil',
      'Hindi',
      'Spanish',
      'French',
      'German',
      'Japanese',
      'Chinese'
    ],
    campTypes: [
      'Stargazing Nights',
      'Astrophotography Workshops',
      'Family Astronomy Events',
      'Educational Camps',
      'Advanced Expeditions',
      'Youth Programs',
      'Corporate Events',
      'School Field Trips'
    ],
    groupSizes: [
      '1-10 people (Intimate)',
      '11-25 people (Small)',
      '26-50 people (Medium)',
      '51-100 people (Large)',
      '100+ people (Very Large)'
    ],
    equipment: [
      'Refractor Telescopes',
      'Reflector Telescopes',
      'Dobsonian Telescopes',
      'Computerized Mounts',
      'Binoculars',
      'Camera Equipment',
      'Filters',
      'Star Charts',
      'Laser Pointers',
      'Red Flashlights'
    ],
    locations: [
      'Colombo Area',
      'Kandy Region',
      'Nuwara Eliya',
      'Galle Province',
      'Anuradhapura',
      'Polonnaruwa',
      'Haputale',
      'Ella',
      'Dambulla',
      'Sigiriya'
    ]
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof ApplicationForm] as Record<string, unknown>),
        [field]: value
      }
    }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof ApplicationForm] as string[];
      const isSelected = currentArray.includes(value);
      
      return {
        ...prev,
        [field]: isSelected 
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  const handleCampSelection = (campId: string) => {
    setSelectedCamps(prev => 
      prev.includes(campId) 
        ? prev.filter(id => id !== campId)
        : [...prev, campId]
    );
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.fullName) newErrors.fullName = 'Full name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone number is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        break;
      
      case 2:
        if (!formData.currentOccupation) newErrors.currentOccupation = 'Current occupation is required';
        if (!formData.educationLevel) newErrors.educationLevel = 'Education level is required';
        if (!formData.guideExperience) newErrors.guideExperience = 'Guide experience is required';
        if (formData.totalExperience < 0) newErrors.totalExperience = 'Valid experience years required';
        break;
      
      case 3:
        if (formData.astronomySkills.length === 0) newErrors.astronomySkills = 'Select at least one astronomy skill';
        if (formData.languages.length === 0) newErrors.languages = 'Select at least one language';
        break;
      
      case 4:
        if (formData.campTypes.length === 0) newErrors.campTypes = 'Select at least one camp type';
        if (formData.groupSizes.length === 0) newErrors.groupSizes = 'Select preferred group sizes';
        if (!formData.outdoorExperience) newErrors.outdoorExperience = 'Outdoor experience description is required';
        break;
      
      case 5:
        if (formData.preferredLocations.length === 0) newErrors.preferredLocations = 'Select preferred locations';
        if (!formData.motivation) newErrors.motivation = 'Motivation is required';
        if (!formData.emergencyContact.name) newErrors.emergencyContactName = 'Emergency contact name is required';
        if (!formData.emergencyContact.phone) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
        break;
      
      case 6:
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms and conditions';
        if (!formData.backgroundCheckConsent) newErrors.backgroundCheckConsent = 'Background check consent is required';
        if (selectedCamps.length === 0) newErrors.selectedCamps = 'Select at least one camp to apply for';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would submit the form data to your backend
      console.log('Submitting application:', {
        ...formData,
        selectedCamps
      });
      
      // Show success message and redirect
      const submissionSuccess = () => {
        const successDiv = document.createElement('div');
        successDiv.className = 'camp-guide-application__submission fade-in';
        successDiv.innerHTML = `
          <div class="success-icon">✅</div>
          <h3 class="success-title">Application Submitted Successfully!</h3>
          <p class="success-message">We will review your application and contact you within 5-7 business days.</p>
          <div class="reference-number">Reference: CGA-${Date.now().toString().slice(-6)}</div>
        `;
        
        document.querySelector('.camp-guide-application__content')?.appendChild(successDiv);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      };
      
      submissionSuccess();
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="camp-guide-application__step-header">
              <div className="step-icon">
                <User className="w-8 h-8" />
              </div>
              <div className="step-info">
                <h2>Personal Information</h2>
                <p>Tell us about yourself to get started</p>
              </div>
            </div>

            <div className="camp-guide-application__form-grid">
              <div className="camp-guide-application__form-group">
                <label htmlFor="fullName">Full Name <span className="required">*</span></label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="camp-guide-application__form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="camp-guide-application__form-group">
                <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="+94 71 234 5678"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="camp-guide-application__form-group">
                <label htmlFor="dateOfBirth">Date of Birth <span className="required">*</span></label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>

              <div className="camp-guide-application__form-group camp-guide-application__form-group--full-width">
                <label htmlFor="address">Address <span className="required">*</span></label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="Street address, apartment, etc."
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="camp-guide-application__form-group">
                <label htmlFor="city">City <span className="required">*</span></label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  placeholder="Your city"
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-header">
              <div className="step-icon">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="step-info">
                <h3>Professional Background</h3>
                <p>Share your education and experience</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="currentOccupation">Current Occupation *</label>
                <input
                  id="currentOccupation"
                  type="text"
                  value={formData.currentOccupation}
                  onChange={(e) => handleInputChange('currentOccupation', e.target.value)}
                  className={`form-input ${errors.currentOccupation ? 'error' : ''}`}
                  placeholder="Your current job/profession"
                />
                {errors.currentOccupation && <span className="error-message">{errors.currentOccupation}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="educationLevel">Education Level *</label>
                <select
                  id="educationLevel"
                  value={formData.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                  className={`form-select ${errors.educationLevel ? 'error' : ''}`}
                >
                  <option value="">Select education level</option>
                  {predefinedOptions.educationLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {errors.educationLevel && <span className="error-message">{errors.educationLevel}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="astronomyEducation">Astronomy Education & Training</label>
                <textarea
                  id="astronomyEducation"
                  value={formData.astronomyEducation}
                  onChange={(e) => handleInputChange('astronomyEducation', e.target.value)}
                  className="form-textarea"
                  placeholder="Describe your formal or informal astronomy education, courses, workshops..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="totalExperience">Years of Experience *</label>
                <input
                  id="totalExperience"
                  type="number"
                  min="0"
                  value={formData.totalExperience}
                  onChange={(e) => handleInputChange('totalExperience', parseInt(e.target.value) || 0)}
                  className={`form-input ${errors.totalExperience ? 'error' : ''}`}
                  placeholder="0"
                />
                {errors.totalExperience && <span className="error-message">{errors.totalExperience}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="guideExperience">Guide Experience *</label>
                <textarea
                  id="guideExperience"
                  value={formData.guideExperience}
                  onChange={(e) => handleInputChange('guideExperience', e.target.value)}
                  className={`form-textarea ${errors.guideExperience ? 'error' : ''}`}
                  placeholder="Describe your experience as a guide, tour leader, educator, or similar role..."
                  rows={4}
                  required
                />
                {errors.guideExperience && <span className="error-message">{errors.guideExperience}</span>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-header">
              <div className="step-icon">
                <Award className="w-8 h-8" />
              </div>
              <div className="step-info">
                <h3>Certifications & Skills</h3>
                <p>Select your qualifications and expertise</p>
              </div>
            </div>

            <div className="form-sections">
              <div className="form-section">
                <h4>Certifications</h4>
                <div className="camp-guide-application__checkbox-group">
                  {predefinedOptions.certifications.map(cert => (
                    <div key={cert} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`cert-${cert}`}
                        checked={formData.certifications.includes(cert)}
                        onChange={() => handleArrayToggle('certifications', cert)}
                      />
                      <label htmlFor={`cert-${cert}`}>{cert}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h4>Astronomy Skills <span className="required">*</span></h4>
                <div className="camp-guide-application__checkbox-group camp-guide-application__checkbox-group--inline">
                  {predefinedOptions.astronomySkills.map(skill => (
                    <div key={skill} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`skill-${skill}`}
                        checked={formData.astronomySkills.includes(skill)}
                        onChange={() => handleArrayToggle('astronomySkills', skill)}
                      />
                      <label htmlFor={`skill-${skill}`}>{skill}</label>
                    </div>
                  ))}
                </div>
                {errors.astronomySkills && <span className="error-message">{errors.astronomySkills}</span>}
              </div>

              <div className="form-section">
                <h4>Languages <span className="required">*</span></h4>
                <div className="camp-guide-application__checkbox-group camp-guide-application__checkbox-group--inline">
                  {predefinedOptions.languages.map(lang => (
                    <div key={lang} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`language-${lang}`}
                        checked={formData.languages.includes(lang)}
                        onChange={() => handleArrayToggle('languages', lang)}
                      />
                      <label htmlFor={`language-${lang}`}>{lang}</label>
                    </div>
                  ))}
                </div>
                {errors.languages && <span className="error-message">{errors.languages}</span>}
              </div>

              <div className="form-section">
                <h4>Additional Qualifications</h4>
                <div className="form-grid">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.firstAid}
                      onChange={(e) => handleInputChange('firstAid', e.target.checked)}
                    />
                    <span className="checkbox-text">First Aid/CPR Certified</span>
                  </label>

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.drivingLicense}
                      onChange={(e) => handleInputChange('drivingLicense', e.target.checked)}
                    />
                    <span className="checkbox-text">Valid Driving License</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="step-header">
              <div className="step-icon">
                <Telescope className="w-8 h-8" />
              </div>
              <div className="step-info">
                <h3>Camp Experience</h3>
                <p>Tell us about your camping and group leadership experience</p>
              </div>
            </div>

            <div className="form-sections">
              <div className="form-section">
                <h4>Preferred Camp Types *</h4>
                <div className="checkbox-grid">
                  {predefinedOptions.campTypes.map(type => (
                    <label key={type} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.campTypes.includes(type)}
                        onChange={() => handleArrayToggle('campTypes', type)}
                      />
                      <span className="checkbox-text">{type}</span>
                    </label>
                  ))}
                </div>
                {errors.campTypes && <span className="error-message">{errors.campTypes}</span>}
              </div>

              <div className="form-section">
                <h4>Comfortable Group Sizes *</h4>
                <div className="checkbox-grid">
                  {predefinedOptions.groupSizes.map(size => (
                    <label key={size} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.groupSizes.includes(size)}
                        onChange={() => handleArrayToggle('groupSizes', size)}
                      />
                      <span className="checkbox-text">{size}</span>
                    </label>
                  ))}
                </div>
                {errors.groupSizes && <span className="error-message">{errors.groupSizes}</span>}
              </div>

              <div className="form-section">
                <h4>Equipment Familiarity</h4>
                <div className="checkbox-grid">
                  {predefinedOptions.equipment.map(equipment => (
                    <label key={equipment} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.equipmentFamiliarity.includes(equipment)}
                        onChange={() => handleArrayToggle('equipmentFamiliarity', equipment)}
                      />
                      <span className="checkbox-text">{equipment}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <div className="form-group full-width">
                  <label htmlFor="outdoorExperience">Outdoor & Camping Experience *</label>
                  <textarea
                    id="outdoorExperience"
                    value={formData.outdoorExperience}
                    onChange={(e) => handleInputChange('outdoorExperience', e.target.value)}
                    className={`form-textarea ${errors.outdoorExperience ? 'error' : ''}`}
                    placeholder="Describe your camping, hiking, outdoor leadership experience..."
                    rows={4}
                    required
                  />
                  {errors.outdoorExperience && <span className="error-message">{errors.outdoorExperience}</span>}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <div className="step-header">
              <div className="step-icon">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="step-info">
                <h3>Availability & Preferences</h3>
                <p>Let us know your availability and location preferences</p>
              </div>
            </div>

            <div className="form-sections">
              <div className="form-section">
                <h4>Preferred Locations *</h4>
                <div className="checkbox-grid">
                  {predefinedOptions.locations.map(location => (
                    <label key={location} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.preferredLocations.includes(location)}
                        onChange={() => handleArrayToggle('preferredLocations', location)}
                      />
                      <span className="checkbox-text">{location}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredLocations && <span className="error-message">{errors.preferredLocations}</span>}
              </div>

              <div className="form-section">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="accommodationNeeds">Accommodation Needs</label>
                    <textarea
                      id="accommodationNeeds"
                      value={formData.accommodationNeeds}
                      onChange={(e) => handleInputChange('accommodationNeeds', e.target.value)}
                      className="form-textarea"
                      placeholder="Any special accommodation requirements..."
                      rows={2}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="transportationNeeds">Transportation Needs</label>
                    <textarea
                      id="transportationNeeds"
                      value={formData.transportationNeeds}
                      onChange={(e) => handleInputChange('transportationNeeds', e.target.value)}
                      className="form-textarea"
                      placeholder="Transportation arrangements or needs..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="form-group full-width">
                  <label htmlFor="motivation">Why do you want to be a camp guide? *</label>
                  <textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    className={`form-textarea ${errors.motivation ? 'error' : ''}`}
                    placeholder="Share your passion for astronomy and motivation for guiding camps..."
                    rows={4}
                    required
                  />
                  {errors.motivation && <span className="error-message">{errors.motivation}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="specialSkills">Special Skills or Talents</label>
                  <textarea
                    id="specialSkills"
                    value={formData.specialSkills}
                    onChange={(e) => handleInputChange('specialSkills', e.target.value)}
                    className="form-textarea"
                    placeholder="Any additional skills that would benefit camp participants..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>Emergency Contact *</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="emergencyName">Contact Name *</label>
                    <input
                      id="emergencyName"
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'name', e.target.value)}
                      className={`form-input ${errors.emergencyContactName ? 'error' : ''}`}
                      placeholder="Emergency contact name"
                    />
                    {errors.emergencyContactName && <span className="error-message">{errors.emergencyContactName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="emergencyRelationship">Relationship</label>
                    <input
                      id="emergencyRelationship"
                      type="text"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'relationship', e.target.value)}
                      className="form-input"
                      placeholder="Spouse, Parent, Sibling, etc."
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="emergencyPhone">Phone Number *</label>
                    <input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => handleNestedInputChange('emergencyContact', 'phone', e.target.value)}
                      className={`form-input ${errors.emergencyContactPhone ? 'error' : ''}`}
                      placeholder="+94 71 234 5678"
                    />
                    {errors.emergencyContactPhone && <span className="error-message">{errors.emergencyContactPhone}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-content">
            <div className="step-header">
              <div className="step-icon">
                <Check className="w-8 h-8" />
              </div>
              <div className="step-info">
                <h3>Review & Submit</h3>
                <p>Review your application and select camps to apply for</p>
              </div>
            </div>

            <div className="form-sections">
              <div className="form-section">
                <h4>Available Camps</h4>
                <p className="section-description">Select the camps you'd like to guide:</p>
                <div className="camp-guide-application__camp-grid">
                  {availableCamps.map(camp => (
                    <div 
                      key={camp.id} 
                      className={`camp-guide-application__camp-card ${selectedCamps.includes(camp.id) ? 'camp-guide-application__camp-card--selected' : ''}`}
                      onClick={() => handleCampSelection(camp.id)}
                    >
                      <div className="camp-header">
                        <div className="camp-title">
                          <h3>{camp.title}</h3>
                          <span className={`camp-type camp-type--${camp.type}`}>
                            {camp.type}
                          </span>
                        </div>
                        <div className={`selection-indicator ${selectedCamps.includes(camp.id) ? 'selection-indicator--visible' : ''}`}>
                          <Check className="check-icon" />
                        </div>
                      </div>
                      
                      <div className="camp-meta">
                        <div className="meta-item">
                          <Calendar className="icon" />
                          <span>{new Date(camp.date).toLocaleDateString()}</span>
                        </div>
                        <div className="meta-item">
                          <MapPin className="icon" />
                          <span>{camp.location}</span>
                        </div>
                        <div className="meta-item">
                          <Clock className="icon" />
                          <span>{camp.duration}</span>
                        </div>
                        <div className="meta-item">
                          <Users className="icon" />
                          <span>{camp.participants} participants</span>
                        </div>
                      </div>
                      
                      <p className="camp-description">{camp.description}</p>
                      
                      <div className="camp-requirements">
                        <div className="requirements-title">Requirements:</div>
                        <div className="requirements-list">
                          {camp.requirements.map((req, index) => (
                            <span key={index} className="requirement-tag">{req}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.selectedCamps && <span className="error-message">{errors.selectedCamps}</span>}
              </div>

              <div className="form-section">
                <h4>Document Upload (Optional)</h4>
                <div className="upload-grid">
                  <div className="camp-guide-application__file-upload">
                    <div className="upload-icon">📄</div>
                    <div className="upload-text">Resume/CV</div>
                    <div className="upload-hint">Upload your resume or CV</div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      title="Upload your resume or CV"
                      onChange={(e) => handleFileUpload('resume', e.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="camp-guide-application__file-upload">
                    <div className="upload-icon">🏆</div>
                    <div className="upload-text">Certifications</div>
                    <div className="upload-hint">Upload your certifications</div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      title="Upload your certifications"
                      onChange={(e) => handleFileUpload('certifications', e.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="camp-guide-application__file-upload">
                    <div className="upload-icon">📷</div>
                    <div className="upload-text">Portfolio/Photos</div>
                    <div className="upload-hint">Upload your portfolio or sample photos</div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      title="Upload your portfolio or sample photos"
                      onChange={(e) => handleFileUpload('portfolio', e.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="camp-guide-application__file-upload">
                    <div className="upload-icon">📋</div>
                    <div className="upload-text">References</div>
                    <div className="upload-hint">Upload your references</div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      title="Upload your references"
                      onChange={(e) => handleFileUpload('references', e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Terms & Conditions</h4>
                <div className="terms-section">
                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                    />
                    <span className="checkbox-text">
                      I accept the <a href="#" target="_blank">Terms and Conditions</a> and <a href="#" target="_blank">Privacy Policy</a> *
                    </span>
                  </label>
                  {errors.termsAccepted && <span className="error-message">{errors.termsAccepted}</span>}

                  <label className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.backgroundCheckConsent}
                      onChange={(e) => handleInputChange('backgroundCheckConsent', e.target.checked)}
                    />
                    <span className="checkbox-text">
                      I consent to a background check if required *
                    </span>
                  </label>
                  {errors.backgroundCheckConsent && <span className="error-message">{errors.backgroundCheckConsent}</span>}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="camp-guide-application">
      <div className="camp-guide-application__container">
        {/* Header */}
        <div className="camp-guide-application__header">
          <div className="header-content">
            <Button
              variant="ghost"
              size="medium"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
            
            <div className="header-info">
              <h1 className="camp-guide-application__header-title">Camp Guide Application</h1>
              <p className="camp-guide-application__header-subtitle">Apply to become an astronomy camp guide and share your passion for the stars</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              data-progress={`${(currentStep / totalSteps) * 100}%`}
            ></div>
          </div>
          <div className="progress-steps">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div 
                key={i + 1} 
                className={`progress-step ${currentStep >= i + 1 ? 'completed' : ''} ${currentStep === i + 1 ? 'active' : ''}`}
              >
                <span>{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="progress-text">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Form Content */}
        <div className="camp-guide-application__content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="fade-in"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="camp-guide-application__navigation">
          <div className="nav-buttons">
            {currentStep > 1 && (
              <Button
                variant="secondary"
                size="large"
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                Previous
              </Button>
            )}
            
            <div className="nav-spacer"></div>
            
            {currentStep < totalSteps ? (
              <Button
                variant="primary"
                size="large"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                size="large"
                onClick={handleSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
          <div className="step-info">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampGuideApplication;
