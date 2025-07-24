import React, { useState, useEffect } from "react";
import "../../styles/pages/learner/NasaImagesPage.scss";
import { Search, MapPin, Calendar, ExternalLink, Users, Globe, Star, Clock } from "lucide-react";
import { nasaOpportunitiesService, type Opportunity } from "../../services/nasaOpportunitiesService";

const NasaOpportunitiesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch opportunities from API
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching NASA opportunities...');
        const response = await nasaOpportunitiesService.getOpportunities();
        console.log('NASA opportunities response:', response);
        console.log('Number of opportunities loaded:', response.data.length);
        console.log('Sample opportunity with image:', response.data.find(o => o.image));
        setOpportunities(response.data);
        setFilteredOpportunities(response.data);
      } catch (err) {
        console.error('Failed to fetch opportunities:', err);
        setError('Failed to load opportunities. Please try again later.');
        // Set empty array as fallback
        setOpportunities([]);
        setFilteredOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Filter opportunities based on search and filters
  useEffect(() => {
    let filtered = opportunities.filter(opportunity => {
      const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          opportunity.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || opportunity.type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || opportunity.difficulty === selectedDifficulty;
      const matchesRemote = !remoteOnly || opportunity.remote;

      return matchesSearch && matchesType && matchesDifficulty && matchesRemote;
    });

    setFilteredOpportunities(filtered);
  }, [searchTerm, selectedType, selectedDifficulty, remoteOnly, opportunities]);

  const handleOpportunityClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowModal(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'internship': return <Users className="h-5 w-5" />;
      case 'volunteer': return <Globe className="h-5 w-5" />;
      case 'citizen-science': return <Star className="h-5 w-5" />;
      default: return <Users className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internship': return 'type-internship';
      case 'volunteer': return 'type-volunteer';
      case 'citizen-science': return 'type-citizen-science';
      default: return 'type-internship';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'difficulty-beginner';
      case 'Intermediate': return 'difficulty-intermediate';
      case 'Advanced': return 'difficulty-advanced';
      default: return 'difficulty-beginner';
    }
  };

  return (
    <div className="nasa-opportunities-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 style={{color: '#ffffff'}}>NASA Opportunities & Programs</h1>
          <p>Discover internships, volunteer opportunities, and citizen science projects with NASA. Join the next generation of space explorers and contribute to groundbreaking research.</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{opportunities.filter(o => o.type === 'internship').length}</span>
              <span className="stat-label">Internships</span>
            </div>
            <div className="stat">
              <span className="stat-number">{opportunities.filter(o => o.type === 'volunteer').length}</span>
              <span className="stat-label">Volunteer Programs</span>
            </div>
            <div className="stat">
              <span className="stat-number">{opportunities.filter(o => o.type === 'citizen-science').length}</span>
              <span className="stat-label">Citizen Science</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://www.nasa.gov/wp-content/uploads/2023/04/nasa-logo-web-rgb.png" alt="NASA Students" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search opportunities, skills, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <div className="filter-group">
            <label>Type</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="internship">Internships</option>
              <option value="volunteer">Volunteer</option>
              <option value="citizen-science">Citizen Science</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Difficulty</label>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
              />
              Remote Only
            </label>
          </div>
        </div>
        
        <div className="results-count">
          {filteredOpportunities.length} opportunities found
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="opportunities-section">
        {loading && (
          <div className="loading-state-nasa">
            <div className="loading-spinner-nasa">🚀</div>
            <p>Loading NASA opportunities...</p>
          </div>
        )}
        
        {error && (
          <div className="error-state">
            <p>⚠️ {error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="opportunities-grid">
            {filteredOpportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className="opportunity-card"
              onClick={() => handleOpportunityClick(opportunity)}
            >
              {opportunity.image && (
                <div className="opportunity-image">
                  <img 
                    src={opportunity.image} 
                    alt={opportunity.title}
                    onError={(e) => {
                      console.log('Image failed to load:', opportunity.image);
                      (e.target as HTMLImageElement).src = 'https://www.nasa.gov/wp-content/uploads/2023/04/nasa-logo-web-rgb.png';
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', opportunity.image);
                    }}
                  />
                </div>
              )}
              
              <div className="opportunity-content">
                <div className="opportunity-header">
                  <div className={`opportunity-type ${getTypeColor(opportunity.type)}`}>
                    {getTypeIcon(opportunity.type)}
                    <span>{opportunity.type.replace('-', ' ')}</span>
                  </div>
                  <div className={`opportunity-difficulty ${getDifficultyColor(opportunity.difficulty)}`}>
                    {opportunity.difficulty}
                  </div>
                </div>
                
                <h3 className="opportunity-title">{opportunity.title}</h3>
                <p className="opportunity-description">{opportunity.description}</p>
                
                <div className="opportunity-details">
                  <div className="detail-item">
                    <MapPin className="h-4 w-4" />
                    <span>{opportunity.location}</span>
                    {opportunity.remote && <span className="remote-badge">Remote</span>}
                  </div>
                  
                  <div className="detail-item">
                    <Clock className="h-4 w-4" />
                    <span>{opportunity.timeCommitment}</span>
                  </div>
                  
                  {opportunity.deadline && (
                    <div className="detail-item deadline">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="opportunity-skills">
                  {opportunity.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                  {opportunity.skills.length > 3 && (
                    <span className="skill-tag more">+{opportunity.skills.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {/* Opportunity Detail Modal */}
      {showModal && selectedOpportunity && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            
            {selectedOpportunity.image && (
              <div className="modal-image">
                <img 
                  src={selectedOpportunity.image} 
                  alt={selectedOpportunity.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://www.nasa.gov/wp-content/uploads/2023/04/nasa-logo-web-rgb.png';
                  }}
                />
              </div>
            )}
            
            <div className="modal-body">
              <div className="modal-header">
                <div className={`opportunity-type ${getTypeColor(selectedOpportunity.type)}`}>
                  {getTypeIcon(selectedOpportunity.type)}
                  <span>{selectedOpportunity.type.replace('-', ' ')}</span>
                </div>
                <div className={`opportunity-difficulty ${getDifficultyColor(selectedOpportunity.difficulty)}`}>
                  {selectedOpportunity.difficulty}
                </div>
              </div>
              
              <h2>{selectedOpportunity.title}</h2>
              <p className="modal-description">{selectedOpportunity.description}</p>
              
              <div className="modal-details">
                <div className="detail-section">
                  <h4>Location & Format</h4>
                  <div className="detail-item">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedOpportunity.location}</span>
                    {selectedOpportunity.remote && <span className="remote-badge">Remote Available</span>}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Time Commitment</h4>
                  <div className="detail-item">
                    <Clock className="h-4 w-4" />
                    <span>{selectedOpportunity.timeCommitment}</span>
                  </div>
                </div>
                
                {(selectedOpportunity.startDate || selectedOpportunity.deadline) && (
                  <div className="detail-section">
                    <h4>Important Dates</h4>
                    {selectedOpportunity.deadline && (
                      <div className="detail-item deadline">
                        <Calendar className="h-4 w-4" />
                        <span>Application Deadline: {new Date(selectedOpportunity.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedOpportunity.startDate && (
                      <div className="detail-item">
                        <Calendar className="h-4 w-4" />
                        <span>Start Date: {new Date(selectedOpportunity.startDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {selectedOpportunity.endDate && (
                      <div className="detail-item">
                        <Calendar className="h-4 w-4" />
                        <span>End Date: {new Date(selectedOpportunity.endDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="detail-section">
                  <h4>Required Skills</h4>
                  <div className="skills-list">
                    {selectedOpportunity.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h4>Eligibility Requirements</h4>
                  <ul className="eligibility-list">
                    {selectedOpportunity.eligibility.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="modal-actions">
                <a
                  href={selectedOpportunity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-button"
                >
                  <ExternalLink className="h-4 w-4" />
                  Apply Now
                </a>
                <span className="source-label">Source: {selectedOpportunity.source}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NasaOpportunitiesPage;
