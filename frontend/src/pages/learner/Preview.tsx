import AstronomyBlogCard from "../../components/Learner/blogcard";
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
  {
    id: 5,
    image: "https://static.vecteezy.com/system/resources/previews/026/438/961/large_2x/the-center-of-the-milky-way-galaxy-with-stars-and-space-dust-in-the-universe-night-sky-free-photo.jpg",
    title: "The Andromeda Galaxy: A Neighbor in Space",
    author: "Galileo Starfinder",
    createdAt: "2025-06-05",
    rating: 4.9,
    content: "The Milky Way galaxy is a vast, barred spiral galaxy containing over 100 billion stars. Discover its structure, including the galactic center, spiral arms, and our Solar System’s position within this enormous stellar city."
  }
];

const Preview = () => (
  <div className="preview-content">
    <h1>Blog Preview</h1>
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
  </div>
);

export default Preview;