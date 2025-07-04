import { useNavigate } from "react-router-dom";
import AstronomyBlogCard from "../../components/Learner/blogcard";
import "../../styles/pages/learner/blog_explore.scss"
import { BookOpenIcon, UserGroupIcon, StarIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { blogs, totalBlogs, uniqueAuthors, avgRating, latestDate } from "./blogData";

const BlogExplore: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="blog-explore-page">
      <div className="blog-explore-head-cards">
        <div className="blog-stat-card">
          <BookOpenIcon className="blog-stat-icon" />
          <div>
            <div className="blog-stat-value">{totalBlogs}</div>
            <div className="blog-stat-label">Total Blogs</div>
          </div>
        </div>
        <div className="blog-stat-card">
          <UserGroupIcon className="blog-stat-icon" />
          <div>
            <div className="blog-stat-value">{uniqueAuthors}</div>
            <div className="blog-stat-label">Unique Authors</div>
          </div>
        </div>
        <div className="blog-stat-card">
          <StarIcon className="blog-stat-icon" />
          <div>
            <div className="blog-stat-value">{avgRating}</div>
            <div className="blog-stat-label">Average Rating</div>
          </div>
          </div>
        <div className="blog-stat-card">
          <CalendarDaysIcon className="blog-stat-icon" />
          <div>
            <div className="blog-stat-value">{latestDate}</div>
            <div className="blog-stat-label">Latest Blog</div>
          </div>
        </div>
      </div>
      <h2>Explore Astronomy Blogs</h2>
      <p>Discover the latest insights and discoveries in the field of astronomy.</p>
      <div className="blog-list">
        {blogs.map(blog => (
          <AstronomyBlogCard
          key={blog.id}
          image={blog.image}
          title={blog.title}
          author={blog.author}
          createdAt={blog.createdAt}
          rating={blog.rating}
          content={blog.content}
          onClick={() => navigate(`/dashboard/blogs/${blog.id}`)}
        />
        ))}
      </div>
    </div>
  );
}

export default BlogExplore;