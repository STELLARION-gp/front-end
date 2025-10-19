// pages/mentor/MenteeApplications.tsx
import React, { useState, useEffect } from 'react';
import { getReceivedApplications, updateApplicationStatus, type MenteeApplication } from '../../services/menteeApplicationApi';
import '../../styles/pages/mentor/MenteeApplications.scss';
import '../../styles/pages/influencer/SessionsNotification.scss';
import Button from '../../components/Button';
import { auth } from '../../firebase';

const MenteeApplications: React.FC = () => {
  const [applications, setApplications] = useState<MenteeApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState<MenteeApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  // Show notification helper
  const showNotification = (
    type: "success" | "error" | "info",
    message: string
  ) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type, message: "" });
    }, 5000); // Auto-hide after 5 seconds
  };

  // Download document with authentication
  const handleDownloadDocument = async (fileName: string, originalName: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        showNotification("error", "Please log in to download documents");
        return;
      }

      const token = await user.getIdToken();
      
      const response = await fetch(`http://localhost:5000/api/mentee-applications/documents/${fileName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = originalName || fileName;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading file:', err);
      showNotification("error", "Failed to download document");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getReceivedApplications();
      setApplications(data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load applications.';
      setError(errorMsg);
      showNotification("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId: number, status: 'accepted' | 'rejected') => {
    try {
      await updateApplicationStatus(appId, status, reviewNotes);
      showNotification("success", `✅ Application ${status} successfully!`);
      setSelectedApp(null);
      setReviewNotes('');
      fetchApplications(); // Refresh list
    } catch (err: any) {
      console.error('Error updating application:', err);
      const errorMsg = err.response?.data?.error || 'Failed to update application.';
      showNotification("error", errorMsg);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filterStatus === 'all') return true;
    return app.application_status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusClass = {
      pending: 'mentee-status-pending',
      accepted: 'mentee-status-accepted',
      rejected: 'mentee-status-rejected'
    }[status] || 'mentee-status-pending';

    return <span className={`mentee-status-badge ${statusClass}`}>{status.toUpperCase()}</span>;
  };

  if (loading) {
    return (
      <div className="mentee-applications-page">
        <div className="mentee-loading">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="mentee-applications-page">
      <div className="mentee-page-header">
        <h1>Mentee Applications</h1>
        <p>Review and manage applications from learners</p>
      </div>

      {error && (
        <div className="mentee-error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mentee-navigation">
        <div className="mentee-tab-buttons">
          <Button
            variant={filterStatus === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('all')}
          >
            All ({applications.length})
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('pending')}
          >
            Pending ({applications.filter(a => a.application_status === 'pending').length})
          </Button>
          <Button
            variant={filterStatus === 'accepted' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('accepted')}
          >
            Accepted ({applications.filter(a => a.application_status === 'accepted').length})
          </Button>
          <Button
            variant={filterStatus === 'rejected' ? 'primary' : 'secondary'}
            onClick={() => setFilterStatus('rejected')}
          >
            Rejected ({applications.filter(a => a.application_status === 'rejected').length})
          </Button>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="mentee-no-applications">
          <p>No applications found.</p>
        </div>
      ) : (
        <div className="mentee-applications-grid">
          {filteredApplications.map((app) => (
            <div key={app.application_id} className="mentee-application-card">
              <div className="mentee-card-header">
                <h3>
                  {app.learner?.display_name || 
                   `${app.learner?.first_name || ''} ${app.learner?.last_name || ''}`.trim() || 
                   'Anonymous'}
                </h3>
                {getStatusBadge(app.application_status)}
              </div>

              <div className="mentee-card-body">
                <div className="mentee-info-row">
                  <span className="mentee-label">Email:</span>
                  <span className="mentee-value">{app.learner?.email}</span>
                </div>
                
                <div className="mentee-info-row">
                  <span className="mentee-label">Applied:</span>
                  <span className="mentee-value">{new Date(app.submitted_at).toLocaleDateString()}</span>
                </div>

                <div className="mentee-interest-section">
                  <strong>Interest Statement:</strong>
                  <p>{app.interest_statement}</p>
                </div>

                {/* Documents */}
                {app.documents && Array.isArray(app.documents) && app.documents.length > 0 && (
                  <div className="mentee-documents-section">
                    <strong>Attached Documents:</strong>
                    <div className="mentee-documents-list">
                      {app.documents.map((doc: any, idx) => (
                        <div key={idx} className="mentee-document-item">
                          <span>📄 {doc.originalName || doc.fileName}</span>
                          <div className="mentee-document-actions">
                            {/* Google Drive files */}
                            {doc.webViewLink && (
                              <>
                                <a 
                                  href={doc.webViewLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="mentee-doc-link"
                                >
                                  View
                                </a>
                                <a 
                                  href={doc.webContentLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="mentee-doc-link"
                                >
                                  Download
                                </a>
                              </>
                            )}
                            {/* Local files */}
                            {doc.storageType === 'local' && doc.fileName && (
                              <button
                                onClick={() => handleDownloadDocument(doc.fileName, doc.originalName)}
                                className="mentee-doc-link mentee-doc-download-btn"
                                title={`Download ${doc.originalName}`}
                              >
                                Download
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Notes */}
                {app.review_notes && (
                  <div className="mentee-review-notes">
                    <strong>Review Notes:</strong>
                    <p>{app.review_notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {app.application_status === 'pending' && (
                <div className="mentee-card-actions">
                  <Button 
                    variant="primary" 
                    size="small"
                    onClick={() => setSelectedApp(app)}
                  >
                    Review Application
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedApp && (
        <div className="mentee-modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="mentee-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Review Application</h2>
            
            <div className="mentee-modal-body">
              <p><strong>Applicant:</strong> {selectedApp.learner?.display_name || selectedApp.learner?.email}</p>
              
              <div className="mentee-form-group">
                <label>Review Notes (optional):</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add any notes or feedback..."
                  rows={4}
                />
              </div>
            </div>

            <div className="mentee-modal-actions">
              <Button 
                variant="secondary" 
                onClick={() => setSelectedApp(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleStatusUpdate(selectedApp.application_id, 'rejected')}
              >
                Reject
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleStatusUpdate(selectedApp.application_id, 'accepted')}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button
              className="notification-close"
              onClick={() => setNotification({ ...notification, show: false })}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenteeApplications;
