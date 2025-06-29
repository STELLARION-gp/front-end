import AstronomyBlogCard from "../../components/Learner/blogcard";
import '../../styles/pages/learner/preview.scss'

const blogs = [
  {
    id: 1,
    image: "https://kielderobservatory.org/images/stories/virtuemart/product/Orion%20Nebula%20-%20AS%20-%20med.jpg",
    title: "Understanding React",
    author: "Jane Doe",
    createdAt: "2025-06-20",
    rating: 4.5,
    content: "React is a JavaScript library for building user interfaces...",
  },
  {
    id: 2,
    image: "https://cdn.arstechnica.net/wp-content/uploads/2024/03/cosmology-astronomy-discoveries.jpg",
    title: "Learning TypeScript",
    author: "John Smith",
    createdAt: "2025-06-18",
    rating: 4.8,
    content: "TypeScript extends JavaScript by adding types...",
  },
  // Add more blog objects here
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