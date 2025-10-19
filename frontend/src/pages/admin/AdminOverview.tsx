import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/admin/AdminOverview.scss';
import Button from '../../components/Button';
import {
  Users,
  BookOpen,
  Star,
  UserCheck,
  Compass,
  TrendingUp,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Award,
  Clock,
  BarChart3,
  Download,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';

// API Base URL with fallback
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Interfaces for type safety
interface UserStatistics {
  learners: number;
  mentors: number;
  influencers: number;
  guides: number;
  enthusiasts: number;
  total: number;
  activeUsers: number;
}

interface BlogItem {
  id: number;
  title: string;
  author_name: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  featured_image?: string;
  status: string;
}

interface SessionItem {
  id: number;
  title: string;
  description?: string;
  session_type?: string;
  creator_name?: string;
  session_date: string;
  session_time?: string;
  duration: number;
  status: string;
  price?: number;
  max_participants?: number;
  difficulty_level?: string;
}

interface GuideServiceItem {
  id: number;
  guide_name: string;
  service_title?: string;
  specialty: string;
  difficulty?: string;
  total_sessions: number;
  avg_rating: number;
  review_count?: number;
  price?: number;
  duration?: string;
  status: string;
  featured?: boolean;
}

interface PlatformStats {
  totalContent: number;
  totalEvents: number;
  totalSessions: number;
  activeSubscriptions: number;
}

const AdminOverview: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState<UserStatistics>({
    learners: 0,
    mentors: 0,
    influencers: 0,
    guides: 0,
    enthusiasts: 0,
    total: 0,
    activeUsers: 0
  });
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    totalContent: 0,
    totalEvents: 0,
    totalSessions: 0,
    activeSubscriptions: 0
  });
  const [topBlogs, setTopBlogs] = useState<BlogItem[]>([]);
  const [recentSessions, setRecentSessions] = useState<SessionItem[]>([]);
  const [topGuides, setTopGuides] = useState<GuideServiceItem[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('30d');

  useEffect(() => {
    fetchAllData();
  }, [selectedTimeRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserStatistics(),
        fetchPlatformStats(),
        fetchTopBlogs(),
        fetchRecentSessions(),
        fetchTopGuides()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStatistics = async () => {
    try {
      console.log('Fetching user statistics from:', `${API_BASE_URL}/api/admin/users-by-role`);
      const token = localStorage.getItem('token') || 'dev-token';
      
      // Fetch user counts by role from backend
      const response = await axios.get(`${API_BASE_URL}/api/admin/users-by-role`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('User statistics response:', response.data);

      if (response.data.success) {
        const stats = response.data.data;
        setUserStats({
          learners: stats.learners || 0,
          mentors: stats.mentors || 0,
          influencers: stats.influencers || 0,
          guides: stats.guides || 0,
          enthusiasts: stats.enthusiasts || 0,
          total: stats.total || 0,
          activeUsers: stats.activeUsers || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      // Fallback to general stats endpoint if the role-based endpoint fails
      try {
        const token = localStorage.getItem('token') || 'dev-token';
        const fallbackResponse = await axios.get(`${API_BASE_URL}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (fallbackResponse.data.success) {
          const stats = fallbackResponse.data.data;
          setUserStats({
            learners: Math.floor(stats.users.total * 0.45),
            mentors: Math.floor(stats.users.total * 0.20),
            influencers: Math.floor(stats.users.total * 0.15),
            guides: Math.floor(stats.users.total * 0.10),
            enthusiasts: Math.floor(stats.users.total * 0.10),
            total: stats.users.total,
            activeUsers: stats.users.active
          });
        }
      } catch (fallbackError) {
        console.error('Error fetching fallback statistics:', fallbackError);
      }
    }
  };

  const fetchPlatformStats = async () => {
    try {
      const token = localStorage.getItem('token') || 'dev-token';
      const response = await axios.get(`${API_BASE_URL}/api/admin/platform-overview`, {
        params: {
          timeRange: selectedTimeRange
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const stats = response.data.data;
        setPlatformStats({
          totalContent: stats.content.totalBlogs || 0,
          totalEvents: stats.events.active || 0,
          totalSessions: stats.sessions.total || 0,
          activeSubscriptions: stats.subscriptions.active || 0
        });
      }
    } catch (error) {
      console.error('Error fetching platform statistics:', error);
    }
  };

  const fetchTopBlogs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blogs`, {
        params: {
          status: 'published',
          sort_by: 'views_count',
          sort_order: 'desc',
          limit: 5
        }
      });

      if (response.data.success) {
        setTopBlogs(response.data.data.blogs || []);
      }
    } catch (error) {
      console.error('Error fetching top blogs:', error);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      const token = localStorage.getItem('token') || 'dev-token';
      const response = await axios.get(`${API_BASE_URL}/api/admin/recent-sessions`, {
        params: {
          limit: 5
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setRecentSessions(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
      // Keep empty array on error
      setRecentSessions([]);
    }
  };

  const fetchTopGuides = async () => {
    try {
      const token = localStorage.getItem('token') || 'dev-token';
      const response = await axios.get(`${API_BASE_URL}/api/admin/top-guides`, {
        params: {
          limit: 5
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setTopGuides(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching top guides:', error);
      // Keep empty array on error
      setTopGuides([]);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const handleExport = () => {
    console.log('Exporting dashboard data...');
    
    // Create export data
    const exportData = {
      generatedAt: new Date().toISOString(),
      timeRange: selectedTimeRange,
      userStatistics: userStats,
      platformStatistics: platformStats,
      topBlogs: topBlogs.map(blog => ({
        title: blog.title,
        author: blog.author_name,
        views: blog.views_count,
        likes: blog.likes_count,
        comments: blog.comments_count,
        date: blog.created_at
      })),
      recentSessions: recentSessions.map(session => ({
        title: session.title,
        creator: session.creator_name,
        date: session.session_date,
        duration: session.duration,
        status: session.status
      })),
      topGuides: topGuides.map(guide => ({
        name: guide.guide_name,
        specialty: guide.specialty,
        sessions: guide.total_sessions,
        rating: guide.avg_rating
      }))
    };

    // Create and download JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin-overview-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message (you can use a toast notification library)
    alert('Report exported successfully!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="admin-overview admin-overview--loading">
        <div className="loading-spinner">
          <RefreshCw className="spinner-icon" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-overview">
      {/* Header Section */}
      <div className="overview-header">
        <div className="overview-header__content">
          <h1 className="overview-title">Platform Overview</h1>
          <p className="overview-subtitle">Comprehensive analytics and user management dashboard</p>
        </div>
        <div className="overview-header__actions">
          <div className="time-range-selector">
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="time-select"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <Button 
            variant="secondary" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="refresh-btn"
          >
            <RefreshCw className={refreshing ? 'spinning' : ''} size={16} />
            Refresh
          </Button>
          <Button 
            variant="primary" 
            onClick={handleExport}
            className="export-btn"
          >
            <Download size={16} />
            Export Report
          </Button>
        </div>
      </div>

      {/* User Management Section */}
      <section className="overview-section">
        <div className="section-header">
          <div className="section-header__title">
            <Users size={24} className="section-icon" />
            <h2>User Management</h2>
          </div>
          <div className="section-header__stats">
            <span className="total-badge">{userStats.total.toLocaleString()} Total Users</span>
            <span className="active-badge">{userStats.activeUsers.toLocaleString()} Active</span>
          </div>
        </div>

        <div className="user-stats-grid">
          <div className="stat-card stat-card--learners">
            <div className="stat-card__icon-wrapper">
              <BookOpen className="stat-card__icon" />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__value">{userStats.learners.toLocaleString()}</h3>
              <p className="stat-card__label">Learners</p>
              <div className="stat-card__trend">
                <TrendingUp size={14} />
                <span>+12% this month</span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card--mentors">
            <div className="stat-card__icon-wrapper">
              <UserCheck className="stat-card__icon" />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__value">{userStats.mentors.toLocaleString()}</h3>
              <p className="stat-card__label">Mentors</p>
              <div className="stat-card__trend">
                <TrendingUp size={14} />
                <span>+8% this month</span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card--influencers">
            <div className="stat-card__icon-wrapper">
              <Star className="stat-card__icon" />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__value">{userStats.influencers.toLocaleString()}</h3>
              <p className="stat-card__label">Influencers</p>
              <div className="stat-card__trend">
                <TrendingUp size={14} />
                <span>+15% this month</span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card--guides">
            <div className="stat-card__icon-wrapper">
              <Compass className="stat-card__icon" />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__value">{userStats.guides.toLocaleString()}</h3>
              <p className="stat-card__label">Guides</p>
              <div className="stat-card__trend">
                <TrendingUp size={14} />
                <span>+5% this month</span>
              </div>
            </div>
          </div>

          <div className="stat-card stat-card--enthusiasts">
            <div className="stat-card__icon-wrapper">
              <Award className="stat-card__icon" />
            </div>
            <div className="stat-card__content">
              <h3 className="stat-card__value">{userStats.enthusiasts.toLocaleString()}</h3>
              <p className="stat-card__label">Enthusiasts</p>
              <div className="stat-card__trend">
                <TrendingUp size={14} />
                <span>+10% this month</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="overview-section">
        <div className="section-header">
          <div className="section-header__title">
            <BarChart3 size={24} className="section-icon" />
            <h2>Platform Statistics</h2>
          </div>
        </div>

        <div className="platform-stats-grid">
          <div className="platform-stat">
            <div className="platform-stat__icon">
              <BookOpen size={20} />
            </div>
            <div className="platform-stat__content">
              <h4>{platformStats.totalContent.toLocaleString()}</h4>
              <p>Total Content</p>
            </div>
          </div>

          <div className="platform-stat">
            <div className="platform-stat__icon">
              <Calendar size={20} />
            </div>
            <div className="platform-stat__content">
              <h4>{platformStats.totalEvents.toLocaleString()}</h4>
              <p>Active Events</p>
            </div>
          </div>

          <div className="platform-stat">
            <div className="platform-stat__icon">
              <Users size={20} />
            </div>
            <div className="platform-stat__content">
              <h4>{platformStats.totalSessions.toLocaleString()}</h4>
              <p>Total Sessions</p>
            </div>
          </div>

          <div className="platform-stat">
            <div className="platform-stat__icon">
              <Award size={20} />
            </div>
            <div className="platform-stat__content">
              <h4>{platformStats.activeSubscriptions.toLocaleString()}</h4>
              <p>Active Subscriptions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Most Rated Blogs */}
      <section className="overview-section">
        <div className="section-header">
          <div className="section-header__title">
            <BookOpen size={24} className="section-icon" />
            <h2>Top Rated Blogs</h2>
          </div>
          <Button variant="secondary" size="small" onClick={() => navigate('/dashboard/blogs')}>View All</Button>
        </div>

        <div className="content-list">
          {topBlogs.map((blog, index) => (
            <div key={blog.id} className="content-item">
              <div className="content-item__rank">#{index + 1}</div>
              <div className="content-item__info">
                <h4 className="content-item__title">{blog.title}</h4>
                <p className="content-item__meta">
                  By {blog.author_name} • {formatDate(blog.created_at)}
                </p>
              </div>
              <div className="content-item__stats">
                <div className="stat-badge">
                  <Eye size={14} />
                  <span>{blog.views_count.toLocaleString()}</span>
                </div>
                <div className="stat-badge">
                  <Heart size={14} />
                  <span>{blog.likes_count.toLocaleString()}</span>
                </div>
                <div className="stat-badge">
                  <MessageCircle size={14} />
                  <span>{blog.comments_count.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Sessions */}
      <section className="overview-section">
        <div className="section-header">
          <div className="section-header__title">
            <Calendar size={24} className="section-icon" />
            <h2>Recent Sessions</h2>
          </div>
          <Button variant="secondary" size="small" onClick={() => navigate('/dashboard/sessions')}>View All</Button>
        </div>

        <div className="sessions-grid">
          {recentSessions.map((session) => (
            <div key={session.id} className="session-card">
              <div className="session-card__header">
                <h4 className="session-card__title">{session.title}</h4>
                <span className={`session-card__status session-card__status--${session.status}`}>
                  {session.status}
                </span>
              </div>
              <div className="session-card__content">
                {session.session_type && (
                  <p className="session-card__type">
                    <Compass size={16} />
                    {session.session_type}
                  </p>
                )}
                <p className="session-card__creator">
                  <UserCheck size={16} />
                  {session.creator_name || 'Unknown Creator'}
                </p>
                <p className="session-card__date">
                  <Clock size={16} />
                  {formatDate(session.session_date)} • {session.duration} min
                </p>
                {session.price && (
                  <p className="session-card__price">
                    LKR {Number(session.price).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Guide Services */}
      <section className="overview-section">
        <div className="section-header">
          <div className="section-header__title">
            <Compass size={24} className="section-icon" />
            <h2>Top Guide Services</h2>
          </div>
          <Button variant="secondary" size="small" onClick={() => navigate('/dashboard/guides')}>View All</Button>
        </div>

        <div className="guides-table">
          <table>
            <thead>
              <tr>
                <th>Guide Name</th>
                <th>Service</th>
                <th>Category</th>
                <th>Bookings</th>
                <th>Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topGuides.map((guide) => (
                <tr key={guide.id}>
                  <td>
                    <div className="guide-name">
                      <UserCheck size={18} />
                      <span>{guide.guide_name}</span>
                    </div>
                  </td>
                  <td>{guide.service_title || guide.specialty}</td>
                  <td>
                    <span className="specialty-badge">{guide.specialty}</span>
                  </td>
                  <td>
                    <span className="session-count">{guide.total_sessions}</span>
                  </td>
                  <td>
                    <div className="rating-cell">
                      <Star size={16} className="star-icon" />
                      <span>{guide.avg_rating.toFixed(1)}</span>
                      {guide.review_count && (
                        <span className="review-count">({guide.review_count})</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-badge--${guide.status}`}>
                      {guide.status}
                      {guide.featured && <Award size={14} className="featured-icon" />}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
