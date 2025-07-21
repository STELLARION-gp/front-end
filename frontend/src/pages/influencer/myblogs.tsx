import React, { useState, useEffect, useContext } from 'react';
import { Star, Edit2, Trash2, MessageCircle, Eye, Heart, Plus, Save, X, Send, BookOpen, Users, Calendar, EyeOff } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import AstronomyBlogCard from "../../components/Learner/blogcard";
import { blogs } from "../learner/blogData";
import '../../styles/pages/influencer/myblogs.scss'
import "../../styles/pages/learner/blog_explore.scss"
import "../../styles/pages/learner/BlogPage.scss"
import { AuthContext } from '../../contexts/AuthContext';
import { blogService } from '../../services/blogService';
import type { CreateBlogRequest } from '../../services/blogService';

type ActiveSection = 'blogs' | 'myblogs';

type Comment = {
    id: number;
    user: string;
    text: string;
    date: string;
};

type Blog = {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    image_url?: string;
    author_id: number;
    status: 'draft' | 'published' | 'archived';
    published_at?: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    tags: string[];
    created_at: string;
    updated_at: string;
    // Virtual fields from joins
    author_name?: string;
    author_email?: string;
    author_display_name?: string;
    user_liked?: boolean;
    // Legacy fields for compatibility
    image?: string | null;
    author?: string;
    date?: string;
    reach?: number;
    likes?: number;
    rating?: number;
    comments?: Comment[];
    liked?: boolean;
    published?: boolean;
    createdAt?: string;
};

// Custom Blog Card Component for My Blogs
const MyBlogCard: React.FC<{
    blog: Blog;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onTogglePublish: (id: number) => void;
    onView: (blog: Blog) => void;
}> = ({ blog, onEdit, onDelete, onTogglePublish, onView }) => {
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="star filled" size={16} />);
        }
        
        if (hasHalfStar) {
            stars.push(<Star key="half" className="star half-filled" size={16} />);
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="star empty" size={16} />);
        }
        
        return stars;
    };

    return (
        <div className={`blog-card ${!blog.published ? 'draft' : ''}`}>
            <div className="blog-image-container">
                {blog.image ? (
                    <img src={blog.image} alt={blog.title} className="blog-image" />
                ) : (
                    <div className="blog-image-placeholder">
                        <BookOpen size={48} />
                    </div>
                )}
                
                <div className="blog-status-badge">
                    {blog.published ? (
                        <span className="published-badge">Published</span>
                    ) : (
                        <span className="draft-badge">Draft</span>
                    )}
                </div>

                <div className="blog-actions-overlay">
                    <button 
                        className="action-btn edit-btn"
                        onClick={() => onEdit(blog.id)}
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button 
                        className="action-btn delete-btn"
                        onClick={() => onDelete(blog.id)}
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button 
                        className="action-btn publish-btn"
                        onClick={() => onTogglePublish(blog.id)}
                        title={blog.published ? "Unpublish" : "Publish"}
                    >
                        {blog.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <div className="blog-content">
                <h3 className="blog-title" onClick={() => onView(blog)}>
                    {blog.title}
                </h3>

                <div className="blog-meta">
                    <div className="meta-item">
                        <Users size={14} />
                        <span>{blog.author}</span>
                    </div>
                    <div className="meta-item">
                        <Calendar size={14} />
                        <span>{new Date(blog.createdAt || blog.created_at || blog.date || new Date()).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="blog-rating">
                    <div className="stars">
                        {renderStars(blog.rating || 0)}
                    </div>
                    <span className="rating-value">{blog.rating || 0}</span>
                </div>

                <p className="blog-excerpt">
                    {blog.content.length > 120 
                        ? `${blog.content.substring(0, 120)}...` 
                        : blog.content
                    }
                </p>

                <div className="blog-stats">
                    <div className="stat-item">
                        <Eye size={16} />
                        <span>{blog.reach}</span>
                    </div>
                    <div className="stat-item">
                        <Heart size={16} />
                        <span>{blog.likes}</span>
                    </div>
                    <div className="stat-item">
                        <MessageCircle size={16} />
                        <span>{(blog.comments || []).length}</span>
                    </div>
                </div>

                <div className="blog-actions-bottom">
                    <button 
                        className="see-more-btn"
                        onClick={() => onView(blog)}
                    >
                        See More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function MyBlogs() {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<ActiveSection>('blogs');
    const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
    const [newBlog, setNewBlog] = useState<{ title: string; content: string; image: File | null }>({ title: '', content: '', image: null });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Blog exploration states
    const [filter, setFilter] = React.useState({
        author: '',
        minRating: '',
        search: '',
        status: 'all' // all, published, draft
    });

    // Get current user info
    const currentUser = authContext?.userProfile;
    const currentUserName = currentUser?.displayName || 'User';

    useEffect(() => {
        if (currentUser) {
            loadMyBlogs();
        }
    }, [currentUser]);

    const loadMyBlogs = async () => {
        if (!currentUser) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // For now, skip API call and use demo data until backend is properly integrated
            // TODO: Implement proper user ID mapping for Firebase UID to backend user ID
            console.log('Loading blogs for user:', currentUser.uid);
            
            // Fallback to demo data
            const convertedBlogs: Blog[] = blogs
                .filter(blog => blog.author === currentUserName)
                .map(blog => ({
                    ...blog,
                    author_id: 0, // Will be resolved when backend integration is complete
                    status: Math.random() > 0.5 ? 'published' : 'draft' as const,
                    view_count: Math.floor(Math.random() * 1000) + 100,
                    like_count: Math.floor(Math.random() * 50) + 10,
                    comment_count: 0,
                    tags: [],
                    created_at: blog.createdAt || new Date().toISOString(),
                    updated_at: blog.createdAt || new Date().toISOString(),
                    date: blog.createdAt,
                    reach: Math.floor(Math.random() * 1000) + 100,
                    likes: Math.floor(Math.random() * 50) + 10,
                    comments: [],
                    liked: false,
                    published: Math.random() > 0.5
                }));
            setMyBlogs(convertedBlogs);
        } catch (err: any) {
            console.error('Error loading blogs:', err);
            
            // Fallback to demo data if API fails
            const convertedBlogs: Blog[] = blogs
                .filter(blog => blog.author === currentUserName)
                .map(blog => ({
                    ...blog,
                    author_id: 0,
                    status: Math.random() > 0.5 ? 'published' : 'draft' as const,
                    view_count: Math.floor(Math.random() * 1000) + 100,
                    like_count: Math.floor(Math.random() * 50) + 10,
                    comment_count: 0,
                    tags: [],
                    created_at: blog.createdAt || new Date().toISOString(),
                    updated_at: blog.createdAt || new Date().toISOString(),
                    date: blog.createdAt,
                    reach: Math.floor(Math.random() * 1000) + 100,
                    likes: Math.floor(Math.random() * 50) + 10,
                    comments: [],
                    liked: false,
                    published: Math.random() > 0.5
                }));
            setMyBlogs(convertedBlogs);
        } finally {
            setLoading(false);
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        if (filter.author && blog.author !== filter.author) return false;
        if (filter.minRating && blog.rating < Number(filter.minRating)) return false;
        if (filter.search && !blog.title.toLowerCase().includes(filter.search.toLowerCase()) && !blog.content.toLowerCase().includes(filter.search.toLowerCase())) return false;
        return true;
    });

    const filteredMyBlogs = myBlogs.filter(blog => {
        if (filter.status === 'published' && !blog.published) return false;
        if (filter.status === 'draft' && blog.published) return false;
        if (filter.search && !blog.title.toLowerCase().includes(filter.search.toLowerCase()) && !blog.content.toLowerCase().includes(filter.search.toLowerCase())) return false;
        return true;
    });

    const uniqueAuthors = Array.from(new Set(blogs.map(b => b.author)));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const files = (e.target as HTMLInputElement).files;
        setNewBlog((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleCreateBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating blog:', newBlog);
        
        if (!newBlog.title.trim() || !newBlog.content.trim()) {
            alert('Please fill in both title and content');
            return;
        }

        if (!currentUser) {
            alert('You must be logged in to create a blog');
            return;
        }

        setLoading(true);

        try {
            // Enable API call for blog creation
            const blogData: CreateBlogRequest = {
                title: newBlog.title,
                content: newBlog.content,
                status: 'draft',
                image_url: newBlog.image ? URL.createObjectURL(newBlog.image) : undefined,
                tags: [],
                metadata: {}
            };

            const response = await blogService.createBlog(blogData);
            
            if (response.success) {
                // Convert API response to component format
                const newBlogPost: Blog = {
                    ...response.data,
                    // Legacy compatibility fields
                    image: response.data.image_url,
                    author: currentUserName,
                    date: response.data.created_at,
                    reach: response.data.view_count,
                    likes: response.data.like_count,
                    rating: 0,
                    comments: [],
                    liked: false,
                    published: response.data.status === 'published',
                    createdAt: response.data.created_at
                };
                
                setMyBlogs([newBlogPost, ...myBlogs]);
                setNewBlog({ title: '', content: '', image: null });
                setShowCreateForm(false);
            } else {
                throw new Error('Failed to create blog');
            }
        } catch (err: any) {
            console.error('Error creating blog:', err);
            setError('Failed to create blog. Please try again.');
            
            // Fallback to local creation for demo
            const newId = myBlogs.length ? Math.max(...myBlogs.map(b => b.id)) + 1 : 1000;
            const currentDate = new Date().toISOString();
            const newBlogPost: Blog = {
                id: newId,
                title: newBlog.title,
                content: newBlog.content,
                author_id: 0,
                status: 'draft',
                view_count: 0,
                like_count: 0,
                comment_count: 0,
                tags: [],
                created_at: currentDate,
                updated_at: currentDate,
                author: currentUserName,
                date: currentDate,
                createdAt: currentDate,
                reach: 0,
                likes: 0,
                rating: 0,
                comments: [],
                liked: false,
                published: false,
                image: newBlog.image ? URL.createObjectURL(newBlog.image) : null,
            };
            
            setMyBlogs([newBlogPost, ...myBlogs]);
            setNewBlog({ title: '', content: '', image: null });
            setShowCreateForm(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAsDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            handleUpdateBlog(e, false);
        } else {
            handleCreateBlog(e);
        }
    };

    const handlePublishBlog = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (editingId) {
            handleUpdateBlog(e || {} as React.FormEvent, true);
        } else {
            console.log('Publishing blog:', newBlog);
            
            if (!newBlog.title.trim() || !newBlog.content.trim()) {
                alert('Please fill in both title and content');
                return;
            }

            if (!currentUser) {
                alert('You must be logged in to publish a blog');
                return;
            }

            setLoading(true);

            try {
                // Check authentication state first
                console.log('Authentication check:');
                console.log('- AuthContext user:', currentUser);
                console.log('- Firebase auth user:', authContext);
                
                // Test auth token
                try {
                    const testResponse = await fetch('http://localhost:5000/api/blogs', {
                        headers: {
                            'Authorization': `Bearer ${await (authContext as any)?.user?.getIdToken?.()}`
                        }
                    });
                    console.log('Test API call status:', testResponse.status);
                } catch (testErr) {
                    console.log('Test API call failed:', testErr);
                }

                // Enable API call for blog creation
                const blogData: CreateBlogRequest = {
                    title: newBlog.title,
                    content: newBlog.content,
                    status: 'published',
                    image_url: newBlog.image ? URL.createObjectURL(newBlog.image) : undefined,
                    tags: [],
                    metadata: {}
                };

                console.log('Publishing blog with data:', blogData);
                console.log('Current user:', currentUser);
                
                const response = await blogService.createBlog(blogData);
                
                if (response.success) {
                    // Convert API response to component format
                    const newBlogPost: Blog = {
                        ...response.data,
                        // Legacy compatibility fields
                        image: response.data.image_url,
                        author: currentUserName,
                        date: response.data.created_at,
                        reach: response.data.view_count,
                        likes: response.data.like_count,
                        rating: 0,
                        comments: [],
                        liked: false,
                        published: response.data.status === 'published',
                        createdAt: response.data.created_at
                    };
                    
                    setMyBlogs([newBlogPost, ...myBlogs]);
                    setNewBlog({ title: '', content: '', image: null });
                    setShowCreateForm(false);
                } else {
                    throw new Error('Failed to create blog');
                }
            } catch (err: any) {
                console.error('Error publishing blog:', err);
                setError(`Failed to publish blog: ${err.message}`);
                
                // For now, always fallback to local creation since there might be auth issues
                console.log('Falling back to local blog creation');
                const newId = myBlogs.length ? Math.max(...myBlogs.map(b => b.id)) + 1 : 1000;
                const currentDate = new Date().toISOString();
                const newBlogPost: Blog = {
                    id: newId,
                    title: newBlog.title,
                    content: newBlog.content,
                    author_id: 0,
                    status: 'published',
                    view_count: 0,
                    like_count: 0,
                    comment_count: 0,
                    tags: [],
                    created_at: currentDate,
                    updated_at: currentDate,
                    author: currentUserName,
                    date: currentDate,
                    createdAt: currentDate,
                    reach: 0,
                    likes: 0,
                    rating: 0,
                    comments: [],
                    liked: false,
                    published: true,
                    image: newBlog.image ? URL.createObjectURL(newBlog.image) : null,
                };
                setMyBlogs([newBlogPost, ...myBlogs]);
                setNewBlog({ title: '', content: '', image: null });
                setShowCreateForm(false);
                
                // Clear error after successful fallback
                setTimeout(() => setError(null), 3000);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            try {
                await blogService.deleteBlog(id);
                setMyBlogs(myBlogs.filter((b) => b.id !== id));
                if (selectedBlog?.id === id) {
                    setSelectedBlog(null);
                }
            } catch (err: any) {
                console.error('Error deleting blog:', err);
                // Fallback to local deletion
                setMyBlogs(myBlogs.filter((b) => b.id !== id));
                if (selectedBlog?.id === id) {
                    setSelectedBlog(null);
                }
            }
        }
    };

    const handleEdit = (id: number) => {
        setEditingId(id);
        const blog = myBlogs.find((b) => b.id === id);
        if (blog) {
            setNewBlog({ title: blog.title, content: blog.content, image: null });
            setShowCreateForm(true);
        }
    };

    const handleUpdateBlog = (e: React.FormEvent, publish?: boolean) => {
        e.preventDefault();
        setMyBlogs(
            myBlogs.map((b) =>
                b.id === editingId
                    ? {
                            ...b,
                            title: newBlog.title,
                            content: newBlog.content,
                            image: newBlog.image ? URL.createObjectURL(newBlog.image) : b.image,
                            published: publish !== undefined ? publish : b.published,
                        }
                    : b
            )
        );
        
        // Update selected blog if it's the one being edited
        if (selectedBlog?.id === editingId) {
            setSelectedBlog(prev => prev ? {
                ...prev,
                title: newBlog.title,
                content: newBlog.content,
                image: newBlog.image ? URL.createObjectURL(newBlog.image) : prev.image,
                published: publish !== undefined ? publish : prev.published,
            } : null);
        }
        
        setEditingId(null);
        setNewBlog({ title: '', content: '', image: null });
        setShowCreateForm(false);
    };

    const handleTogglePublish = async (id: number) => {
        const blog = myBlogs.find(b => b.id === id);
        if (!blog) return;

        try {
            const newStatus = blog.published ? 'draft' : 'published';
            await blogService.updateBlog(id, { status: newStatus });
            
            setMyBlogs(myBlogs.map(blog => 
                blog.id === id 
                    ? { ...blog, published: !blog.published, status: newStatus }
                    : blog
            ));
            
            // Update selected blog if it's the one being toggled
            if (selectedBlog?.id === id) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    published: !prev.published,
                    status: newStatus
                } : null);
            }
        } catch (err: any) {
            console.error('Error toggling publish status:', err);
            // Fallback to local toggle
            setMyBlogs(myBlogs.map(blog => 
                blog.id === id 
                    ? { ...blog, published: !blog.published }
                    : blog
            ));
            
            if (selectedBlog?.id === id) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    published: !prev.published
                } : null);
            }
        }
    };

    const handleLike = async (id: number) => {
        try {
            const response = await blogService.toggleBlogLike(id);
            
            setMyBlogs(myBlogs.map(blog => 
                blog.id === id 
                    ? { 
                        ...blog, 
                        likes: response.data.like_count,
                        like_count: response.data.like_count,
                        liked: response.data.liked 
                    }
                    : blog
            ));
            
            if (selectedBlog?.id === id) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    likes: response.data.like_count,
                    like_count: response.data.like_count,
                    liked: response.data.liked
                } : null);
            }
        } catch (err: any) {
            console.error('Error toggling like:', err);
            // Fallback to local like toggle
            setMyBlogs(myBlogs.map(blog => 
                blog.id === id 
                    ? { 
                        ...blog, 
                        likes: blog.liked ? (blog.likes || 0) - 1 : (blog.likes || 0) + 1,
                        like_count: blog.liked ? (blog.like_count || 0) - 1 : (blog.like_count || 0) + 1,
                        liked: !blog.liked 
                    }
                    : blog
            ));
            
            if (selectedBlog?.id === id) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    likes: prev.liked ? (prev.likes || 0) - 1 : (prev.likes || 0) + 1,
                    like_count: prev.liked ? (prev.like_count || 0) - 1 : (prev.like_count || 0) + 1,
                    liked: !prev.liked
                } : null);
            }
        }
    };

    const handleAddComment = async (blogId: number) => {
        if (!newComment.trim()) return;
        
        try {
            const response = await blogService.addBlogComment(blogId, {
                content: newComment.trim()
            });
            
            const comment = {
                id: response.data.id,
                user: response.data.user_display_name || 'You',
                text: response.data.content,
                date: new Date(response.data.created_at).toISOString().split('T')[0]
            };
            
            setMyBlogs(myBlogs.map(blog => 
                blog.id === blogId 
                    ? { ...blog, comments: [...(blog.comments || []), comment] }
                    : blog
            ));
            
            if (selectedBlog?.id === blogId) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    comments: [...(prev.comments || []), comment]
                } : null);
            }
            
            setNewComment('');
        } catch (err: any) {
            console.error('Error adding comment:', err);
            // Fallback to local comment
            const comment = {
                id: Date.now(),
                user: 'You',
                text: newComment,
                date: new Date().toISOString().split('T')[0]
            };
            
            setMyBlogs(myBlogs.map(blog => 
                blog.id === blogId 
                    ? { ...blog, comments: [...(blog.comments || []), comment] }
                    : blog
            ));
            
            if (selectedBlog?.id === blogId) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    comments: [...(prev.comments || []), comment]
                } : null);
            }
            
            setNewComment('');
        }
    };

    const handleDeleteComment = async (blogId: number, commentId: number) => {
        try {
            await blogService.deleteBlogComment(blogId, commentId);
            
            setMyBlogs(myBlogs.map(blog => 
                blog.id === blogId 
                    ? { ...blog, comments: (blog.comments || []).filter(c => c.id !== commentId) }
                    : blog
            ));
            
            if (selectedBlog?.id === blogId) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    comments: (prev.comments || []).filter(c => c.id !== commentId)
                } : null);
            }
        } catch (err: any) {
            console.error('Error deleting comment:', err);
            // Fallback to local deletion
            setMyBlogs(myBlogs.map(blog => 
                blog.id === blogId 
                    ? { ...blog, comments: (blog.comments || []).filter(c => c.id !== commentId) }
                    : blog
            ));
            
            if (selectedBlog?.id === blogId) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    comments: (prev.comments || []).filter(c => c.id !== commentId)
                } : null);
            }
        }
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="star filled" size={16} />);
        }
        
        if (hasHalfStar) {
            stars.push(<Star key="half" className="star half-filled" size={16} />);
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="star empty" size={16} />);
        }
        
        return stars;
    };

    const renderBlogsTab = () => (
        <div className="blog-explore-page">
            <h2>Explore Astronomy Blogs</h2>
            <p>Discover the latest insights and discoveries in the field of astronomy.</p>
            
            {/* Blog Filters */}
            <div className="blog-filters" style={{ display: 'flex', gap: 16, margin: '1.2rem 0', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search title or content..."
                    value={filter.search}
                    onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                    style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 180 }}
                />
                <select
                    value={filter.author}
                    onChange={e => setFilter(f => ({ ...f, author: e.target.value }))}
                    style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 140 }}
                >
                    <option value="">All Authors</option>
                    {uniqueAuthors.map(author => (
                        <option key={author} value={author}>{author}</option>
                    ))}
                </select>
                <select
                    value={filter.minRating}
                    onChange={e => setFilter(f => ({ ...f, minRating: e.target.value }))}
                    style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 120 }}
                >
                    <option value="">Any Rating</option>
                    {[5,4,3,2,1].map(r => (
                        <option key={r} value={r}>{r}+</option>
                    ))}
                </select>
            </div>
            
            <div className="blogexplore-blog-list">
                {filteredBlogs.map(blog => (
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

    const renderMyBlogsTab = () => (
        <div className="blog-explore-page">
            <div className="blogs-header">
                <h2>My Astronomy Blogs</h2>
                <p>Manage your cosmic discoveries and insights.</p>
                <Button onClick={() => setShowCreateForm(true)} className="create-blog-btn">
                    <Plus size={20} />
                    Create New Blog
                </Button>
            </div>

            {error && (
                <div className="error-message" style={{ 
                    backgroundColor: '#fee2e2', 
                    color: '#dc2626', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    margin: '1rem 0' 
                }}>
                    {error}
                </div>
            )}

            {loading && (
                <div className="loading-message" style={{ 
                    textAlign: 'center', 
                    padding: '2rem', 
                    color: '#6b7280' 
                }}>
                    Loading blogs...
                </div>
            )}

            {/* My Blog Filters */}
            <div className="blog-filters" style={{ display: 'flex', gap: 16, margin: '1.2rem 0', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search your blogs..."
                    value={filter.search}
                    onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                    style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 180 }}
                />
                <select
                    value={filter.status}
                    onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
                    style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 140 }}
                >
                    <option value="all">All Blogs</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                </select>
            </div>

            {showCreateForm && (
                <div className="blog-form-overlay">
                    <div className="blog-form">
                        <div className="form-header">
                            <h2>{editingId ? 'Edit Blog' : 'Create New Blog'}</h2>
                            <Button 
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingId(null);
                                    setNewBlog({ title: '', content: '', image: null });
                                }}
                            >
                                <X size={20} />
                            </Button>
                        </div>
                        
                        <form onSubmit={handleSaveAsDraft}>
                            <div className="form-group">
                                <label>Blog Title</label>
                                <InputField
                                    type="text"
                                    name="title"
                                    id="blog-title"
                                    label=""
                                    placeholder="Enter your blog title..."
                                    value={newBlog.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    name="content"
                                    placeholder="Share your astronomical insights..."
                                    value={newBlog.content}
                                    onChange={handleInputChange}
                                    required
                                    rows={8}
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.5rem', 
                                        borderRadius: '8px', 
                                        border: '1px solid #334155',
                                        minHeight: '120px',
                                        fontFamily: 'inherit'
                                    }}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Featured Image (Optional)</label>
                                <input 
                                    type="file" 
                                    name="image" 
                                    accept="image/*" 
                                    onChange={handleInputChange}
                                    style={{ 
                                        width: '100%', 
                                        padding: '0.5rem', 
                                        borderRadius: '8px', 
                                        border: '1px solid #334155'
                                    }}
                                />
                                <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                    You can publish your blog without an image
                                </small>
                            </div>
                            
                            <div className="form-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <Button 
                                    type="submit"
                                    variant="border"
                                >
                                    <Save size={16} />
                                    Save as Draft
                                </Button>
                                <Button 
                                    type="button"
                                    onClick={() => handlePublishBlog()}
                                >
                                    <Eye size={16} />
                                    {editingId ? 'Update & Publish' : 'Publish Blog'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="blogexplore-blog-list">
                {filteredMyBlogs.map(blog => (
                    <MyBlogCard
                        key={blog.id}
                        blog={blog}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onTogglePublish={handleTogglePublish}
                        onView={setSelectedBlog}
                    />
                ))}
            </div>

            {filteredMyBlogs.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>
                        {filter.status === 'published' ? 'No published blogs yet' :
                         filter.status === 'draft' ? 'No drafts yet' :
                         filter.search ? 'No blogs found' : 'No blogs yet'}
                    </h3>
                    <p>
                        {filter.search ? 'Try adjusting your search terms.' :
                         'Start sharing your astronomical discoveries with the world!'}
                    </p>
                    {!filter.search && (
                        <Button onClick={() => setShowCreateForm(true)}>
                            Create Your First Blog
                        </Button>
                    )}
                </div>
            )}

            {selectedBlog && (
                <div className="blog-modal-overlay">
                    <div className="blog-modal">
                        <div className="modal-header">
                            <h2>{selectedBlog.title}</h2>
                            <Button onClick={() => setSelectedBlog(null)}>
                                <X size={20} />
                            </Button>
                        </div>
                        
                        <div className="modal-content">
                            {selectedBlog.image && (
                                <img src={selectedBlog.image} alt={selectedBlog.title} className="modal-image" />
                            )}
                            
                            <div className="modal-meta">
                                <span className="author">By {selectedBlog.author}</span>
                                <span className="date">{new Date(selectedBlog.createdAt || selectedBlog.created_at || selectedBlog.date || new Date()).toLocaleDateString()}</span>
                                <div className="rating">
                                    {renderStars(selectedBlog.rating || 0)}
                                    <span>{selectedBlog.rating || 0}</span>
                                </div>
                                <span className={`status ${selectedBlog.published ? 'published' : 'draft'}`}>
                                    {selectedBlog.published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            
                            <div className="modal-stats">
                                <span><Eye size={16} /> {selectedBlog.reach || selectedBlog.view_count || 0} views</span>
                                <span><Heart size={16} /> {selectedBlog.likes || selectedBlog.like_count || 0} likes</span>
                                <span><MessageCircle size={16} /> {(selectedBlog.comments || []).length} comments</span>
                            </div>
                            
                            <div className="modal-text">
                                <p>{selectedBlog.content}</p>
                            </div>

                            <div className="modal-actions" style={{ display: 'flex', gap: '1rem', margin: '1rem 0', flexWrap: 'wrap' }}>
                                <Button 
                                    onClick={() => {
                                        setSelectedBlog(null);
                                        handleEdit(selectedBlog.id);
                                    }} 
                                    variant="border"
                                >
                                    <Edit2 size={16} />
                                    Edit
                                </Button>
                                <Button 
                                    onClick={() => handleTogglePublish(selectedBlog.id)}
                                    variant="border"
                                >
                                    {selectedBlog.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                    {selectedBlog.published ? 'Unpublish' : 'Publish'}
                                </Button>
                                <Button 
                                    onClick={() => handleLike(selectedBlog.id)}
                                    variant={selectedBlog.liked ? 'secondary' : 'border'}
                                >
                                    <Heart size={16} fill={selectedBlog.liked ? 'currentColor' : 'none'} />
                                    {selectedBlog.liked ? 'Liked' : 'Like'}
                                </Button>
                            </div>
                            
                            <div className="comments-section">
                                <h3>Comments ({(selectedBlog.comments || []).length})</h3>
                                
                                <div className="add-comment">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedBlog.id)}
                                    />
                                    <Button onClick={() => handleAddComment(selectedBlog.id)}>
                                        <Send size={16} />
                                    </Button>
                                </div>
                                
                                <div className="comments-list">
                                    {(selectedBlog.comments || []).map((comment) => (
                                        <div key={comment.id} className="comment">
                                            <div className="comment-header">
                                                <span className="comment-author">{comment.user}</span>
                                                <span className="comment-timestamp">{comment.date}</span>
                                                {comment.user === 'You' && (
                                                    <Button 
                                                        onClick={() => handleDeleteComment(selectedBlog.id, comment.id)}
                                                        variant="ghost"
                                                        size="small"
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                )}
                                            </div>
                                            <p>{comment.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="myblogs-tabbed-container">
            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button 
                    className={`tab-button ${activeTab === 'blogs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blogs')}
                >
                    Explore Blogs
                </button>
                <button 
                    className={`tab-button ${activeTab === 'myblogs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('myblogs')}
                >
                    My Blogs ({myBlogs.length})
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'blogs' ? renderBlogsTab() : renderMyBlogsTab()}
            </div>
        </div>
    );
};