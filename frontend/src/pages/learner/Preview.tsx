import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AstronomyCompetitionCard from "../../components/Learner/AstronomyCompetitionCard";
import AstronomyBlogCard from "../../components/Learner/blogcard";
import NasaImageCard from "../../components/Learner/NasaImageCard";
import '../../styles/pages/learner/preview.scss'
import UpcomingSpaceEventCard from "../../components/Learner/UpcomingSpaceEventCard";
import OrganizedEventCard from "../../components/Learner/OrganizedEventCard";
import { eventService, type Event as FeaturedEvent } from "../../services/eventService";

import { astronomyEventsService } from "../../services/astronomyEventsService";
import { blogService } from "../../services/blogService";
import type { Blog } from "../../services/blogService";
import type { AstronomyEvent } from "../../services/astronomyEventsService";



const nasaImages = [
  {
    id: 1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCwVU9bz2GSMbdbeN-ZuifT07u4cZMENy0WQ&s",
    title: "Pillars of Creation",
    rating: 4.9,
  },
  {
    id: 2,
    image: "https://science.nasa.gov/wp-content/uploads/2023/07/stsci-01h44ay5ztcv1npb227b2p650j-temp.png?w=1536",
    title: "Rosette Nebula",
    rating: 4.8,
  },
  {
    id: 4,
    image: "https://www.nasa.gov/wp-content/uploads/2021/01/hubble_nebula_ngc_2818.png",
    title: "Rosette Nebula",
    rating: 4.8,
  },
  {
    id: 5,
    image: "https://c4.wallpaperflare.com/wallpaper/486/591/731/spitzer-space-telescope-space-galaxy-nasa-wallpaper-preview.jpg",
    title: "Spitzer Space",
    rating: 3.1,
  },
  
];


const competitions = [
  {
    id: 1,
    name: "Astro Quiz Challenge",
    coverImage: "https://static.vecteezy.com/system/resources/previews/036/289/512/non_2x/competition-winners-concept-flat-illustration-template-1st-2nd-and-3rd-winners-of-the-competition-trophy-award-and-reward-success-achieving-goals-vector.jpg",
    date: "2025-09-15",
    description: "Test your astronomy knowledge and win prizes!",
  },
  {
    id: 2,
    name: "Deep Space Art Contest",
    coverImage: "https://png.pngtree.com/png-vector/20221020/ourmid/pngtree-happy-children-with-medals-on-school-competition-on-contest-png-image_6331904.png",
    date: "2025-10-05",
    description: "Submit your best space-themed artwork.",
  },
  {
    id: 3,
    name: "Telescope Photography Battle",
    coverImage: "https://w7.pngwing.com/pngs/731/996/png-transparent-competition-winners-hand-table-tree-thumbnail.png",
    date: "2025-11-01",
    description: "Capture the night sky and compete with others.",
  },
];
// (moved inside Preview component)

const Preview = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [events, setEvents] = useState<AstronomyEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Featured Events state (moved here)
  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [featuredEventsLoading, setFeaturedEventsLoading] = useState(true);
  const [featuredEventsError, setFeaturedEventsError] = useState<string | null>(null);


  useEffect(() => {
  setLoading(true);
  blogService.getBlogs({ status: 'published', sort_by: 'created_at', sort_order: 'desc', limit: 4 })
      .then((data) => {
        if (data && data.success && data.data && data.data.blogs) {
          setBlogs(data.data.blogs);
        } else if (data && data.blogs) {
          setBlogs(data.blogs);
        } else {
          setBlogs([]);
        }
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch blogs');
      })
      .finally(() => setLoading(false));

    setEventsLoading(true);
    astronomyEventsService.getEvents({ limit: 4 })
      .then((data) => {
        setEvents(Array.isArray(data) ? data : data.events || []);
        setEventsError(null);
      })
      .catch((err) => {
        setEventsError(err.message || 'Failed to fetch events');
      })
      .finally(() => setEventsLoading(false));

    // Fetch featured events from backend
    setFeaturedEventsLoading(true);
    eventService.getApprovedEvents()
      .then((events) => {
        setFeaturedEvents(events);
        setFeaturedEventsError(null);
      })
      .catch((err) => {
        setFeaturedEventsError(err.message || 'Failed to fetch featured events');
      })
      .finally(() => setFeaturedEventsLoading(false));
  }, []);

  return (
    <div className="preview-content">
      <h2>Recent Blog Preview</h2>
      <p className="section-subtitle">Stay informed with our newest blog posts. </p>
      <div className="astronomy-card-container">
        {loading ? (
          <div>Loading blogs...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : blogs.length === 0 ? (
          <div>No blogs found.</div>
        ) : (
          blogs.slice(0, 4).map((blog) => (
            <AstronomyBlogCard
              key={blog.id}
              image={blog.featured_image || blog.image_url || ''}
              title={blog.title}
              author={blog.author_name || 'Unknown'}
              createdAt={blog.created_at}
              rating={blog.like_count}
              content={blog.content}
              onClick={() => navigate(`/dashboard/blogs/${blog.id}`)}
            />
          ))
        )}
      </div>

    
    <h2 style={{ marginTop: "4rem" }}>Most Rated NASA Images</h2>
    <p className="section-subtitle">Explore breathtaking NASA images loved by our community. </p>
    <div className="nasa-image-container">
      {nasaImages.map(img => (
        <NasaImageCard key={img.id} image={img.image} title={img.title} rating={img.rating} />
      ))}
    </div>

    

    {/* upcoming events */}
    <h2 style={{ marginTop: "4rem" }}>Upcoming Space Events</h2>
    <p className="section-subtitle">Don't miss your chance to witness the wonders of the night sky.</p>
    <div className="space-events-container">
      {eventsLoading ? (
        <div>Loading events...</div>
      ) : eventsError ? (
        <div style={{ color: 'red' }}>{eventsError}</div>
      ) : events.length === 0 ? (
        <div>No astronomy events found.</div>
      ) : (
        events.slice(0, 4).map(ev => (
          <UpcomingSpaceEventCard
            key={ev.id}
            event={ev.name}
            date={ev.event_date}
            category={ev.event_type}
            description={ev.description}
            visibility={ev.visibility}
            bestTime={ev.best_time}
            duration={ev.duration}
            imageUrl={ev.image_url || ''}
          />
        ))
      )}
    </div>

      {/* Platform-Organized Events */}
      <h2 style={{ marginTop: "4rem" }}>Featured Events</h2>
      <p className="section-subtitle">Join exclusive events organized by our platform. Limited seats. </p>
      <div className="organized-events-container">
        {featuredEventsLoading ? (
          <div>Loading featured events...</div>
        ) : featuredEventsError ? (
          <div style={{ color: 'red' }}>{featuredEventsError}</div>
        ) : featuredEvents.length === 0 ? (
          <div>No featured events found.</div>
        ) : (
          featuredEvents.map((event) => (
            <OrganizedEventCard key={event.id} event={event} />
          ))
        )}
      </div>

    {/* upcoming competitions */}
    {/* <h2 style={{ marginTop: "4rem" }}>Upcoming Competitions</h2>
    <p className="section-subtitle">Show off your skills and shine among the stars.</p>
    <div className="competitions-container">
      {competitions.map(comp => (
        <AstronomyCompetitionCard
          key={comp.id}
          coverImage={comp.coverImage}
          name={comp.name}
          date={new Date(comp.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          description={comp.description}
        />
      ))}
    </div> */}


  </div>
  );
};
export default Preview;