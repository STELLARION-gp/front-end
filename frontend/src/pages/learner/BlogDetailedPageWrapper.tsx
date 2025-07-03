// src/pages/learner/BlogDetailedPageWrapper.tsx
import React from "react";
import { useParams } from "react-router-dom";
import BlogDetailedPage from "./Blog_Page";
import {blogs} from "./blogData"; // Import your blogs array

const BlogDetailedPageWrapper: React.FC = () => {
  const { id } = useParams();
  const blog = blogs.find(b => String(b.id) === id);

  if (!blog) {
    return <div>Blog not found.</div>;
  }

  return <BlogDetailedPage blog={blog} />;
};

export default BlogDetailedPageWrapper;