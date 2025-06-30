import AstronomyCompetitionCard from "../../components/Learner/AstronomyCompetitionCard";
import AstronomyBlogCard from "../../components/Learner/blogcard";
import NasaImageCard from "../../components/Learner/NasaImageCard";
import UpcomingEventCard from "../../components/Learner/SpaceEvent";
import '../../styles/pages/learner/preview.scss'

const blogs = [
  {
    id: 1,
    image: "https://kielderobservatory.org/images/stories/virtuemart/product/Orion%20Nebula%20-%20AS%20-%20med.jpg",
    title: "The Orion Nebula: A Stellar Nursery",
    author: "Dr. Jane Skywalker",
    createdAt: "2025-06-20",
    rating: 4.7,
    content: "The Orion Nebula is one of the brightest nebulae visible to the naked eye. Located around 1,344 light-years away, it is a region where new stars are born. In this article, we explore its structure, the Trapezium cluster, and how the nebula helps astronomers understand stellar evolution."
  },
  {
    id: 2,
    image: "https://cdn.arstechnica.net/wp-content/uploads/2024/03/cosmology-astronomy-discoveries.jpg",
    title: "Exploring the Expanding Universe",
    author: "Prof. John Cosmos",
    createdAt: "2025-06-18",
    rating: 4.9,
    content: "Ever since Edwin Hubble’s discovery, the expanding universe has intrigued cosmologists. This blog delves into redshift, the cosmic microwave background radiation, and the implications of dark energy in accelerating the expansion of our universe."
  },
  {
    id: 3,
    image: "https://static.vecteezy.com/system/resources/previews/027/100/104/large_2x/the-starry-night-sky-with-the-milky-way-galaxy-space-dust-and-a-planet-in-the-background-all-free-photo.jpg",
    title: "The Magic of Solar Eclipses",
    author: "Luna Rivera",
    createdAt: "2025-06-15",
    rating: 4.6,
    content: "Solar eclipses offer a rare chance to study the Sun's corona and impact public interest in astronomy. This article covers the types of solar eclipses, historical significance, safety tips, and upcoming eclipse dates visible from Earth."
  },
  {
    id: 4,
    image: "https://previews.123rf.com/images/maximusnd/maximusnd1706/maximusnd170600545/81084871-universe-scene-with-planets-stars-and-galaxies-in-outer-space-showing-the-beauty-of-space.jpg",
    title: "Our Galactic Home: The Milky Way",
    author: "Neil V. Galaxy",
    createdAt: "2025-06-10",
    rating: 4.8,
    content: "The Milky Way galaxy is a vast, barred spiral galaxy containing over 100 billion stars. Discover its structure, including the galactic center, spiral arms, and our Solar System’s position within this enormous stellar city."
  },
]

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
  },
  {
    id: 2,
    event: "Total Lunar Eclipse",
    date: "2025-09-07",
  },
  {
    id: 3,
    event: "International Observe the Moon Night",
    date: "2025-10-04",
  },
  {
    id: 4,
    event: "Next Stargazing Meetup",
    date: "2025-08-30",
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

const Preview = () => (
  <div className="preview-content">
    <h2>Recent Blog Preview</h2>
    <div className="astronomy-card-container">
      {blogs.map((blog) => (
        <AstronomyBlogCard
          key={blog.id}
          image={blog.image}
          title={blog.title}
          author={blog.author}
          createdAt={blog.createdAt}
          rating={blog.rating}
          content={blog.content}
          onReadMore={() => alert(`Read more about: ${blog.title}`)}
        />
      ))}
    </div>

    
    <h2 style={{ marginTop: "2rem" }}>Most Rated NASA Images</h2>
    <div className="nasa-image-container">
      {nasaImages.map(img => (
        <NasaImageCard key={img.id} image={img.image} title={img.title} rating={img.rating} />
      ))}
    </div>
{/* upcoming events */}
    <h2 style={{ marginTop: "2rem" }}>Upcoming Space Events</h2>
    <div className="space-events-container">
      {spaceEvents.map(ev => (
        <UpcomingEventCard key={ev.id} event={ev} />
      ))}
    </div>

{/* upcoming competitions */}
    <h2 style={{ marginTop: "2rem" }}>Upcoming Competitions</h2>
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

export default Preview;