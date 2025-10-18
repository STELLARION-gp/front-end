import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/VirtualIslands.scss';
import { stargazingSpotService } from '../../services/stargazingSpotService';
import type { StargazingSpot } from '../../services/stargazingSpotService';
import { blogService, type Blog } from '../../services/blogService';
import { listEvents, mapBackendEvent, type PlatformEventMapped } from '../../services/eventsService';

const StargazingIsland: React.FC = () => {
  const [spots, setSpots] = useState<StargazingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await stargazingSpotService.getAllStargazingSpots({ limit: 4 });
        setSpots(response.data || []);
      } catch (error) {
        console.error('Error fetching stargazing spots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  return (
    <div className="virtual-island stargazing-island">
      <div className="island-content">
        <h2 className="island-title">Spots</h2>
        
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : (
          <div className="spots-grid">
            {spots.map((spot) => (
              <div 
                key={spot.id} 
                className="spot-card"
                onClick={() => navigate(`/dashboard/stargazing`)}
              >
                {spot.image_urls && spot.image_urls[0] && (
                  <div 
                    className="spot-image" 
                    style={{ backgroundImage: `url(${spot.image_urls[0]})` }}
                  ></div>
                )}
                <div className="spot-info">
                  <h3>{spot.name}</h3>
                  <div className="spot-meta">
                    {spot.rating && (
                      <span className="spot-rating">★ {spot.rating}</span>
                    )}
                    {spot.location && (
                      <span className="spot-location">{spot.location}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && spots.length > 0 && (
          <button 
            className="island-cta"
            onClick={() => navigate('/dashboard/stargazing')}
          >
            View All →
          </button>
        )}
      </div>
    </div>
  );
};

const BlogsIsland: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Fetching blogs...');
        const response = await blogService.getBlogs({ 
          status: 'published',
          limit: 4,
          sort_by: 'published_at',
          sort_order: 'desc'
        });
        
        console.log('Blogs response:', response);
        
        // Handle different response structures
        let blogsData: Blog[] = [];
        if (response && response.success && response.data && response.data.blogs) {
          blogsData = response.data.blogs;
        } else if (response && response.data) {
          blogsData = response.data;
        } else if (response && response.blogs) {
          blogsData = response.blogs;
        } else if (Array.isArray(response)) {
          blogsData = response;
        }
        
        // Map to include proper image URLs
        const processedBlogs = blogsData.map((blog: Blog) => ({
          ...blog,
          image_url: blog.featured_image || blog.image_url || `https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400`
        }));
        
        console.log('Processed blogs:', processedBlogs);
        setBlogs(processedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        // Set empty array on error
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="virtual-island blogs-island">
      <div className="island-content">
        <h2 className="island-title">Blogs</h2>
        
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="loading-state">No blogs available</div>
        ) : (
          <div className="blogs-list">
            {blogs.map((blog) => (
              <div 
                key={blog.id} 
                className="blog-card"
                onClick={() => navigate(`/dashboard/blogs/${blog.id}`)}
              >
                {blog.image_url && (
                  <div 
                    className="blog-image" 
                    style={{ backgroundImage: `url(${blog.image_url})` }}
                  ></div>
                )}
                <div className="blog-info">
                  <h3 className="blog-title">{blog.title}</h3>
                  <span className="blog-author">
                    by {blog.author_display_name || blog.author_name || 'Unknown Author'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <button 
            className="island-cta"
            onClick={() => navigate('/dashboard/blogs')}
          >
            View All →
          </button>
        )}
      </div>
    </div>
  );
};

const EventsIsland: React.FC = () => {
  const [events, setEvents] = useState<PlatformEventMapped[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log('Fetching events...');
        const response = await listEvents();
        console.log('Events response:', response);
        
        // Map backend events to frontend format
        const eventsData = (response.data || response.events || [])
          .map(mapBackendEvent)
          .filter((event: PlatformEventMapped) => event.status === 'approved')
          .slice(0, 4);
        
        console.log('Processed events:', eventsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Set empty array on error
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="virtual-island events-island">
      <div className="island-content">
        <h2 className="island-title">Events</h2>
        
        {loading ? (
          <div className="loading-state">Loading...</div>
        ) : events.length === 0 ? (
          <div className="loading-state">No events available</div>
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="event-card"
                onClick={() => navigate(`/dashboard/events`)}
              >
                <h3 className="event-title">{event.eventName}</h3>
                <span className="event-date">
                  {new Date(event.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            ))}
          </div>
        )}

        {!loading && events.length > 0 && (
          <button 
            className="island-cta"
            onClick={() => navigate('/dashboard/events')}
          >
            View All →
          </button>
        )}
      </div>
    </div>
  );
};

const VirtualIslands: React.FC = () => {
  return (
    <section className="virtual-islands-section">
      <div className="islands-container">
        <StargazingIsland />
        <div className="island-divider"></div>
        <BlogsIsland />
        <div className="island-divider"></div>
        <EventsIsland />
      </div>
    </section>
  );
};

export default VirtualIslands;