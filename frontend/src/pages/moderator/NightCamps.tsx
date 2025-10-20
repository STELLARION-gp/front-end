import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import Button from '../../components/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import '../../styles/pages/moderator/NightCamps.scss';

interface NightCamp {
  id: number;
  name: string;
  organized_by: string;
  sponsored_by?: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  number_of_participants: number;
  image_urls: string[];
  emergency_contact?: string;
  status?: string;
  created_at: string;
  updated_at: string;
  activities: Array<{ id: number; activity: string }>;
  equipment: Array<{ id: number; category: string; equipment_name: string }>;
  volunteering: Array<{ id: number; volunteering_role: string; number_of_applicants: number }>;
}

const NightCamps: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const [nightCamps, setNightCamps] = useState<NightCamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Check authentication
    if (!authContext?.user) {
      navigate('/login');
      return;
    }

    // Check if user has moderator or admin role
    if (authContext.userProfile?.role !== 'moderator' && authContext.userProfile?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchNightCamps();
  }, [navigate, authContext, currentPage]);

  const fetchNightCamps = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5000/api/nightcamps?page=${currentPage}&limit=10`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch night camps');
      }

      const result = await response.json();
      setNightCamps(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching night camps:', error);
      setError('Failed to load night camps');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, campName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${campName}"?\n\nThis action cannot be undone and will remove all associated activities, equipment, and volunteering information.`)) {
      return;
    }

    try {
      if (!authContext?.user) {
        throw new Error('User not authenticated');
      }

      console.log(`🗑️ Deleting night camp with ID: ${id}`);
      setError(null);

      const token = await authContext.user.getIdToken();
      const response = await fetch(`http://localhost:5000/api/nightcamps/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Delete response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Delete error:', errorData);
        throw new Error(`Failed to delete night camp: ${response.status}`);
      }

      console.log('✅ Night camp deleted successfully');
      
      // Show success message
      showSuccess(`"${campName}" has been deleted successfully.`);
      
      // Refresh the list
      fetchNightCamps();
    } catch (error) {
      console.error('❌ Error deleting night camp:', error);
      setError(`Failed to delete "${campName}". Please try again.`);
      
      // Show error to user
      if (error instanceof Error && error.message.includes('authentication')) {
        showError('Authentication error. Please log in again.');
        navigate('/login');
      } else {
        showError(`Error deleting "${campName}". Please try again.`);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="night-camps-loading">
        <div className="loading-spinner"></div>
        <p>Loading night camps...</p>
      </div>
    );
  }

  return (
    <div className="night-camps">
      {/* Header */}
      <div className="night-camps-header">
        <div className="header-content">
          <div className="header-left">
            <Button
              variant="ghost"
              size="medium"
              onClick={() => navigate('/dashboard/moderation')}
            >
              ← Back to Moderation
            </Button>
            <div className="title-section">
              <h1>Night Camp Management</h1>
              <p>Manage overnight stargazing camp events</p>
            </div>
          </div>
          <div className="header-right">
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/dashboard/moderation/create-night-camp')}
            >
              <FaPlus /> Create Night Camp
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <Button variant="ghost" onClick={fetchNightCamps}>Try Again</Button>
        </div>
      )}

      {/* Content */}
      <div className="night-camps-content">
        {nightCamps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏕️</div>
            <h3>No Night Camps Yet</h3>
            <p>Create your first night camp event to get started.</p>
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/dashboard/moderation/create-night-camp')}
            >
              <FaPlus /> Create Night Camp
            </Button>
          </div>
        ) : (
          <>
            {/* Night Camps Grid */}
            <div className="camps-grid">
              {nightCamps.map((camp) => (
                <div key={camp.id} className="camp-card">
                  <div className="camp-header">
                    <h3 className="camp-title">{camp.name}</h3>
                    <div className="camp-status">
                      <span className={`status-badge ${camp.status || 'pending'}`}>
                        {camp.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  <div className="camp-details">
                    <div className="detail-item">
                      <FaCalendarAlt />
                      <span>{formatDate(camp.date)} {camp.time && `at ${camp.time}`}</span>
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <span>{camp.location}</span>
                    </div>
                    <div className="detail-item">
                      <FaUsers />
                      <span>{camp.number_of_participants} participants</span>
                    </div>
                  </div>

                  <div className="camp-description">
                    <p>{camp.description || 'No description provided'}</p>
                  </div>

                  <div className="camp-meta">
                    <div className="organized-by">
                      <strong>Organized by:</strong> {camp.organized_by}
                    </div>
                    <div className="created-date">
                      Created: {formatDate(camp.created_at)}
                    </div>
                  </div>

                  <div className="camp-stats">
                    <div className="stat">
                      <span className="stat-number">{camp.activities?.length || 0}</span>
                      <span className="stat-label">Activities</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{camp.equipment?.length || 0}</span>
                      <span className="stat-label">Equipment</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{camp.volunteering?.length || 0}</span>
                      <span className="stat-label">Volunteer Roles</span>
                    </div>
                  </div>

                  <div className="camp-actions">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => navigate(`/dashboard/moderation/night-camps/details/${camp.id}`)}
                    >
                      <FaEye /> View
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => navigate(`/dashboard/moderation/night-camps/edit/${camp.id}`)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleDelete(camp.id, camp.name)}
                      className="delete-btn"
                    >
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <Button
                  variant="ghost"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NightCamps;
