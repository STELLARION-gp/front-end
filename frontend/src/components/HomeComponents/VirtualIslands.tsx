import React, { useRef, useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import '../../styles/components/VirtualIslands.scss';
import { stargazingSpotService } from '../../services/stargazingSpotService';
import type { StargazingSpot } from '../../services/stargazingSpotService';

interface TrailImage {
  id: number;
  x: number;
  y: number;
  src: string;
  opacity: number;
}

interface Blog {
  id: number;
  title: string;
  author: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
}

const StargazingIsland: React.FC = () => {
  const [images, setImages] = useState<TrailImage[]>([]);
  const [spots, setSpots] = useState<StargazingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageIndexRef = useRef(0);
  const throttleRef = useRef<number>(0);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await stargazingSpotService.getAllStargazingSpots({ limit: 6 });
        setSpots(response.data || []);
      } catch (error) {
        console.error('Error fetching stargazing spots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpots();
  }, []);

  const spotImages = spots
    .filter(spot => spot.image_urls && spot.image_urls.length > 0)
    .map(spot => spot.image_urls![0])
    .slice(0, 10);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (spotImages.length === 0) return;
    
    const now = Date.now();
    if (now - throttleRef.current < 80) return;
    throttleRef.current = now;

    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newImage: TrailImage = {
      id: Date.now() + Math.random(),
      x,
      y,
      src: spotImages[imageIndexRef.current % spotImages.length],
      opacity: 1,
    };

    imageIndexRef.current += 1;

    setImages((prev) => {
      const updated = [...prev, newImage];
      if (updated.length > 20) {
        return updated.slice(-20);
      }
      return updated;
    });

    setTimeout(() => {
      setImages((prev) => prev.filter((img) => img.id !== newImage.id));
    }, 1500);
  };

  return (
    <div className="virtual-island stargazing-island">
      <div 
        ref={containerRef}
        className="island-interactive-area"
        onMouseMove={handleMouseMove}
      >
        {images.map((img) => (
          <div
            key={img.id}
            className="trail-image"
            style={{
              left: `${img.x}px`,
              top: `${img.y}px`,
              backgroundImage: `url(${img.src})`,
              opacity: img.opacity
            }}
          />
        ))}

        <div className="island-content">
          <h2 className="island-title">Spots</h2>
          
          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : (
            <div className="spots-grid">
              {spots.slice(0, 4).map((spot) => (
                <div key={spot.id} className="spot-card">
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
            <button className="island-cta">View All →</button>
          )}
        </div>
      </div>
    </div>
  );
};

const BlogsIsland: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual blog service when available
    const fetchBlogs = async () => {
      try {
        // Placeholder - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setBlogs([
          { id: 1, title: 'Understanding Dark Matter', author: 'Dr. Smith' },
          { id: 2, title: 'Galaxy Formation Theories', author: 'Prof. Johnson' },
          { id: 3, title: 'Black Holes Explained', author: 'Dr. Lee' },
          { id: 4, title: 'The Hubble Deep Field', author: 'NASA' },
        ]);
      } catch (error) {
        console.error('Error fetching blogs:', error);
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
        ) : (
          <div className="blogs-list">
            {blogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                <h3 className="blog-title">{blog.title}</h3>
                <span className="blog-author">by {blog.author}</span>
              </div>
            ))}
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <button className="island-cta">View All →</button>
        )}
      </div>
    </div>
  );
};

const EventsIsland: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual events service when available
    const fetchEvents = async () => {
      try {
        // Placeholder - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setEvents([
          { id: 1, title: 'Meteor Shower Watch', date: '2025-11-15' },
          { id: 2, title: 'Telescope Workshop', date: '2025-11-20' },
          { id: 3, title: 'Lunar Eclipse Viewing', date: '2025-12-05' },
          { id: 4, title: 'Astronomy Quiz Night', date: '2025-12-10' },
        ]);
      } catch (error) {
        console.error('Error fetching events:', error);
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
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <h3 className="event-title">{event.title}</h3>
                <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}

        {!loading && events.length > 0 && (
          <button className="island-cta">View All →</button>
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