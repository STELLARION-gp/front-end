import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { getRoleName } from '../utils/dashboardUtils';
import '../styles/pages/Dashboard.scss';

const DashboardOverview: React.FC = () => {
    const { userProfile } = useAuth();

    if (!userProfile) {
        return <div>Loading...</div>;
    }

    const roleName = getRoleName(userProfile.role);

    // Role-specific content
    const getRoleSpecificContent = () => {
        switch (userProfile.role) {
            case 'admin':
                return (
                    <div className="role-content">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Users</h3>
                                <div className="stat-value">1,247</div>
                                <div className="stat-change positive">+12% this month</div>
                            </div>
                            <div className="stat-card">
                                <h3>Active Sessions</h3>
                                <div className="stat-value">89</div>
                                <div className="stat-change positive">+5% today</div>
                            </div>
                            <div className="stat-card">
                                <h3>System Health</h3>
                                <div className="stat-value">98.9%</div>
                                <div className="stat-change neutral">Uptime</div>
                            </div>
                        </div>
                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <button className="action-btn primary">User Management</button>
                                <button className="action-btn secondary">System Settings</button>
                                <button className="action-btn success">View Reports</button>
                            </div>
                        </div>
                    </div>
                );

            case 'moderator':
                return (
                    <div className="role-content">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Pending Reports</h3>
                                <div className="stat-value">12</div>
                                <div className="stat-change negative">Requires attention</div>
                            </div>
                            <div className="stat-card">
                                <h3>Resolved Today</h3>
                                <div className="stat-value">8</div>
                                <div className="stat-change positive">+3 from yesterday</div>
                            </div>
                            <div className="stat-card">
                                <h3>Community Posts</h3>
                                <div className="stat-value">156</div>
                                <div className="stat-change positive">New this week</div>
                            </div>
                        </div>
                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <button className="action-btn warning">Review Reports</button>
                                <button className="action-btn primary">Content Management</button>
                                <button className="action-btn secondary">Community Guidelines</button>
                            </div>
                        </div>
                    </div>
                );

            case 'mentor':
                return (
                    <div className="role-content">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Active Students</h3>
                                <div className="stat-value">24</div>
                                <div className="stat-change positive">+3 this week</div>
                            </div>
                            <div className="stat-card">
                                <h3>Sessions This Month</h3>
                                <div className="stat-value">18</div>
                                <div className="stat-change positive">75% completion rate</div>
                            </div>
                            <div className="stat-card">
                                <h3>Course Materials</h3>
                                <div className="stat-value">12</div>
                                <div className="stat-change neutral">Created</div>
                            </div>
                        </div>
                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <button className="action-btn primary">Schedule Session</button>
                                <button className="action-btn success">Create Course</button>
                                <button className="action-btn secondary">Student Progress</button>
                            </div>
                        </div>
                    </div>
                );

            case 'influencer':
                return (
                    <div className="role-content">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Followers</h3>
                                <div className="stat-value">5.2K</div>
                                <div className="stat-change positive">+12% this month</div>
                            </div>
                            <div className="stat-card">
                                <h3>Content Views</h3>
                                <div className="stat-value">28.5K</div>
                                <div className="stat-change positive">+25% this week</div>
                            </div>
                            <div className="stat-card">
                                <h3>Engagement Rate</h3>
                                <div className="stat-value">8.4%</div>
                                <div className="stat-change positive">Above average</div>
                            </div>
                        </div>
                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <button className="action-btn primary">Create Post</button>
                                <button className="action-btn success">Schedule Content</button>
                                <button className="action-btn secondary">Analytics</button>
                            </div>
                        </div>
                    </div>
                );

            case 'guide':
                return (
                    <div className="role-content">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Tours Conducted</h3>
                                <div className="stat-value">42</div>
                                <div className="stat-change positive">This month</div>
                            </div>
                            <div className="stat-card">
                                <h3>Participants</h3>
                                <div className="stat-value">156</div>
                                <div className="stat-change positive">Total guided</div>
                            </div>
                            <div className="stat-card">
                                <h3>Rating</h3>
                                <div className="stat-value">4.9/5</div>
                                <div className="stat-change positive">Excellent</div>
                            </div>
                        </div>
                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <button className="action-btn primary">Create Tour</button>
                                <button className="action-btn success">Sky Calendar</button>
                                <button className="action-btn secondary">Equipment Check</button>
                            </div>
                        </div>
                    </div>
                );

            case 'enthusiast':
                return (
                    <div className="role-content">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Observations</h3>
                                <div className="stat-value">89</div>
                                <div className="stat-change positive">Logged this year</div>
                            </div>
                            <div className="stat-card">
                                <h3>Photos Taken</h3>
                                <div className="stat-value">234</div>
                                <div className="stat-change positive">Astrophotos</div>
                            </div>
                            <div className="stat-card">
                                <h3>Community Rank</h3>
                                <div className="stat-value">#127</div>
                                <div className="stat-change positive">Rising</div>
                            </div>
                        </div>
                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <button className="action-btn primary">Log Observation</button>
                                <button className="action-btn success">Sky Planner</button>
                                <button className="action-btn secondary">Photo Gallery</button>
                            </div>
                        </div>
                    </div>
                );

            case 'learner':
            default:
                return (
                    <div className="role-content">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Courses Enrolled</h3>
                                <div className="stat-value">3</div>
                                <div className="stat-change positive">67% average progress</div>
                            </div>
                            <div className="stat-card">
                                <h3>Learning Hours</h3>
                                <div className="stat-value">24</div>
                                <div className="stat-change positive">This month</div>
                            </div>
                            <div className="stat-card">
                                <h3>Achievements</h3>
                                <div className="stat-value">8</div>
                                <div className="stat-change positive">Badges earned</div>
                            </div>
                        </div>
                        <div className="quick-actions">
                            <h3>Quick Actions</h3>
                            <div className="action-buttons">
                                <button className="action-btn primary">Browse Courses</button>
                                <button className="action-btn success">Join Live Session</button>
                                <button className="action-btn secondary">Study Materials</button>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-overview">
            <div className="dashboard-header">
                <h1>Welcome back, {userProfile.displayName || 'User'}!</h1>
                <p className="role-badge">{roleName} Dashboard</p>
                <p className="welcome-message">
                    {userProfile.role === 'admin' ? 'Manage your system and oversee all operations.'
                        : userProfile.role === 'moderator' ? 'Keep the community safe and engaged.'
                            : userProfile.role === 'mentor' ? 'Guide students on their astronomy journey.'
                                : userProfile.role === 'influencer' ? 'Share your passion and inspire others.'
                                    : userProfile.role === 'guide' ? 'Lead amazing stargazing experiences.'
                                        : userProfile.role === 'enthusiast' ? 'Explore the cosmos and share your discoveries.'
                                            : 'Start your journey into the fascinating world of astronomy.'}
                </p>
            </div>

            {getRoleSpecificContent()}

            <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <span className="activity-time">2 hours ago</span>
                        <span className="activity-desc">Completed "Introduction to Telescopes" module</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-time">1 day ago</span>
                        <span className="activity-desc">Joined community discussion on "Mars Observation"</span>
                    </div>
                    <div className="activity-item">
                        <span className="activity-time">3 days ago</span>
                        <span className="activity-desc">Uploaded astrophotography: "Orion Nebula"</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
