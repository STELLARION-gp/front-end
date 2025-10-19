import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AstronomyCompetitionCard from "../../components/Learner/AstronomyCompetitionCard";
import AstronomyBlogCard from "../../components/Learner/blogcard";
import NasaImageCard from "../../components/Learner/NasaImageCard";
import '../../styles/pages/learner/preview.scss'
import UpcomingSpaceEventCard from "../../components/Learner/UpcomingSpaceEventCard";
import OrganizedEventCard from "../../components/Learner/OrganizedEventCard";
import { blogService } from "../../services/blogService";
import type { Blog } from "../../services/blogService";



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
const spaceEvents = [
  {
    id: 1,
    event: "Perseid Meteor Shower Peak",
    date: "2025-08-12",
    category: "meteor",
    imageUrl: "https://cata.cl/wp-content/uploads/2024/08/perseids-radiant-credit-preston-dyches-cc-by-nc-2-0.webp",
    description: "A prolific meteor shower with up to 100 meteors per hour.",
    visibility: "Northern Hemisphere",
    bestTime: "2:00 AM - 4:00 AM",
    duration: "2 hours"
  },
  {
    id: 2,
    event: "Total Lunar Eclipse",
    date: "2025-09-07",
    category: "eclipse",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLFZiyInZT896tZ8u7c0a1_8EDuhJ5STRTzA&s",
    description: "Experience the beauty of a full lunar eclipse as the moon turns red.",
    visibility: "Worldwide",
    bestTime: "9:00 PM - 11:00 PM",
    duration: "1 hour 40 minutes"
  },
  {
    id: 3,
    event: "International Observe the Moon Night",
    date: "2025-10-04",
    category: "moon",
    imageUrl: "https://static.vecteezy.com/system/resources/thumbnails/022/751/189/small_2x/full-moon-over-the-river-in-the-forest-at-night-nature-background-photo.jpg",
    description: "Join a global celebration of lunar science and exploration.",
    visibility: "Global",
    bestTime: "8:00 PM local time",
    duration: "Evening"
  },
  {
    id: 4,
    event: "Next Stargazing Meetup",
    date: "2025-08-30",
    category: "meetup",
    imageUrl: "https://as1.ftcdn.net/v2/jpg/01/01/42/64/1000_F_101426449_2mhwexDmrvGW7JWT94jPeOZble75zFmr.jpg",
    description: "Gather with fellow enthusiasts to stargaze and share knowledge.",
    visibility: "Local Clubs",
    bestTime: "8:30 PM",
    duration: "3 hours"
  }
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
const organizedEvents = [
  {
    id: 1,
    name: "Astro Discovery Workshop",
    category: "Workshop",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdtIgJnLi_IClK8CtccZnSRMdcA-sSMJ9u4w&s",
    date: "2025-08-25",
    location: "Colombo Planetarium",
    contact: "astrolearn@platform.com",
    attendees: 120,
    description: "Engage in hands-on astronomy experiments and learn from experts.",
    sponsors: ["NASA", "AstroWorld"]
  },
  {
    id: 2,
    name: "Night Sky Observation Camp",
    category: "Camp",
    imageUrl: "https://cdn.mos.cms.futurecdn.net/Yad64zizbbNCtXS5eZGMgB.jpg",
    date: "2025-09-20",
    location: "Hanthana Observation Deck",
    contact: "camp@astro.lk",
    attendees: 80,
    description: "Enjoy the stars in a full-night observation camp with astronomers.",
    sponsors: ["Celestia Society"]
  },
  {
    id: 3,
    name: "Galactic Odyssey",
    category: "Astronomy",
    imageUrl: "https://thumbs.dreamstime.com/b/spacecraft-traveling-stars-galactic-odyssey-exploration-interstellar-journey-high-quality-photo-300649665.jpg",
    date: "2025-09-21T19:00:00",
    location: "National Planetarium, Colombo",
    contact: "astro@galaxyfest.org",
    attendees: 500,
    description: "Embark on a breathtaking expedition across galaxies at Galactic Odyssey! Witness live telescope demos, space talks from top scientists, VR exploration zones, and interact with Sri Lanka’s top astronomy clubs. A cosmic experience for stargazers and dreamers alike.",
    sponsors: ["NASA", "Astro Lanka"]
  },
  {
    id: 4,
    name: "Stellar Science Fair",
    category: "Astronomy",
    imageUrl: "https://c8.alamy.com/comp/2CGXY86/stellar-nebula-and-cosmic-dust-cosmic-gas-clusters-and-constellations-in-deep-space-ideal-for-a-space-science-project-elements-furnished-by-nasa-2CGXY86.jpg",
    date: "2025-09-21T19:00:00",
    location: "National Planetarium, Colombo",
    contact: "astro@galaxyfest.org",
    attendees: 500,
    description: "Embark on a breathtaking expedition across galaxies at Galactic Odyssey! Witness live telescope demos, space talks from top scientists, VR exploration zones, and interact with Sri Lanka’s top astronomy clubs. A cosmic experience for stargazers and dreamers alike.",
    sponsors: ["NASA", "SpaceX"]
  }
];
const Preview = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {spaceEvents.map(ev => (
        // <UpcomingEventCard key={ev.id} event={ev} />
        <UpcomingSpaceEventCard
      key={ev.id}
      event={ev.event}
      date={ev.date}
      category={ev.category}
      description={ev.description}
      visibility={ev.visibility}
      bestTime={ev.bestTime}
      duration={ev.duration}
      imageUrl={ev.imageUrl} // ✅ pass image
    />
      ))}
    </div>

      {/* Platform-Organized Events */}
      <h2 style={{ marginTop: "4rem" }}>Featured Events</h2>
      <p className="section-subtitle">Join exclusive events organized by our platform. Limited seats. </p>
      <div className="organized-events-container">
        {organizedEvents.map((event) => (
          <OrganizedEventCard key={event.id} event={event} />
        ))}
      </div>

    {/* upcoming competitions */}
    <h2 style={{ marginTop: "4rem" }}>Upcoming Competitions</h2>
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
    </div>


  </div>
  );
};
export default Preview;