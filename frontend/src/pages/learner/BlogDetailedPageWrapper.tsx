// src/pages/learner/BlogDetailedPageWrapper.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogDetailedPage from "./Blog_Page";
import { blogService, type BlogComment } from "../../services/blogService";

const BlogDetailedPageWrapper: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blog, setBlog] = useState<any | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const blogResp: any = await blogService.getBlogById(parseInt(id));
        // API sometimes returns { data: { ... } } or the object directly
        const blogData = blogResp?.data || blogResp;

        // normalize author/display fields
        const normalized = {
          ...blogData,
          author: blogData.author_display_name || blogData.author_name || blogData.author_email || 'Unknown',
          createdAt: blogData.published_at || blogData.created_at || new Date().toISOString(),
          image: blogData.featured_image || blogData.image_url || blogData.image || ''
        };

        setBlog(normalized);

        // fetch comments (may return { data: { comments: [...] } } or array)
        try {
          const commentsResp: any = await blogService.getBlogComments(parseInt(id));
          const commentList = commentsResp?.data?.comments || commentsResp?.comments || commentsResp?.data || commentsResp || [];
          setComments(Array.isArray(commentList) ? commentList : []);
        } catch (cErr) {
          console.warn('Failed to load comments for blog', id, cErr);
          setComments([]);
        }

        setError(null);
      } catch (err: any) {
        console.error('Error fetching blog details:', err);
        setError('Failed to load blog details');
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndComments();
  }, [id]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading blog...</div>;
  if (error) return <div style={{ padding: '2rem', color: '#fff' }}>{error}</div>;
  if (!blog) return <div style={{ padding: '2rem', color: '#fff' }}>Blog not found.</div>;

  return <BlogDetailedPage blog={blog} comments={comments} />;
};

export default BlogDetailedPageWrapper;