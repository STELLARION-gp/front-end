import React, { useState, useEffect } from 'react';
import { Star, Edit2, Trash2, MessageCircle, Eye, Heart, Plus, Save, X, Send } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { BookOpenIcon, UserGroupIcon, StarIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import AstronomyBlogCard from "../../components/Learner/blogcard";
import { blogs, totalBlogs, avgRating, latestDate } from "../learner/blogData";
import '../../styles/pages/influencer/myblogs.scss'
import "../../styles/pages/learner/blog_explore.scss"

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
    image: string | null;
    author: string;
    date: string;
    reach: number;
    likes: number;
    rating: number;
    comments: Comment[];
    liked: boolean;
};

const mockBlogs: Blog[] = [
    {
        id: 1,
        title: 'The Orion Nebula: A Stellar Nursery',
        content: 'The Orion Nebula is one of the brightest nebulae visible to the naked eye. Located approximately 1,344 light-years from Earth, this stellar nursery is where new stars are born from cosmic dust and gas. The nebula spans about 24 light-years and contains enough material to form thousands of stars.',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
        author: 'Astro Infleuencer',
        date: '2025-06-20',
        reach: 1247,
        likes: 89,
        rating: 4.7,
        liked: false,
        comments: [
            { id: 1, user: 'Alice Cooper', text: 'Fascinating insights about stellar formation!', date: '2025-06-21' },
            { id: 2, user: 'Bob Universe', text: 'The images are absolutely breathtaking.', date: '2025-06-22' },
        ],
    },
    {
        id: 2,
        title: 'Exploring the Expanding Universe',
        content: 'Ever since Edwin Hubble\'s discovery, the expanding universe has intrigued cosmologists worldwide. This phenomenon suggests that galaxies are moving away from us, and the farther they are, the faster they recede. Understanding this expansion helps us comprehend the age and fate of our universe.',
        image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=400&fit=crop',
        author: 'Astro Influencer',
        date: '2025-06-18',
        reach: 892,
        likes: 67,
        rating: 4.9,
        liked: false,
        comments: [
            { id: 3, user: 'Maria Galaxy', text: 'The explanation of red shift is excellent!', date: '2025-06-19' },
        ],
    },
];

export default function MyBlogs() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('blogs');
    const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
    const [newBlog, setNewBlog] = useState<{ title: string; content: string; image: File | null }>({ title: '', content: '', image: null });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [newComment, setNewComment] = useState('');

    // Blog exploration states
    const [filter, setFilter] = React.useState({
        author: '',
        minRating: '',
        search: ''
    });

    useEffect(() => {
        setMyBlogs(mockBlogs);
    }, []);

    const filteredBlogs = blogs.filter(blog => {
        if (filter.author && blog.author !== filter.author) return false;
        if (filter.minRating && blog.rating < Number(filter.minRating)) return false;
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

    const handleCreateBlog = (e: React.FormEvent) => {
        e.preventDefault();
        const newId = myBlogs.length ? Math.max(...myBlogs.map(b => b.id)) + 1 : 1;
        const newBlogPost = {
            ...newBlog,
            id: newId,
            author: 'You',
            date: new Date().toISOString().split('T')[0],
            reach: 0,
            likes: 0,
            rating: 0,
            comments: [],
            liked: false,
            image: newBlog.image ? URL.createObjectURL(newBlog.image) : null,
        };
        setMyBlogs([newBlogPost, ...myBlogs]);
        setNewBlog({ title: '', content: '', image: null });
        setShowCreateForm(false);
    };

    const handleDelete = (id: number) => {
        setMyBlogs(myBlogs.filter((b) => b.id !== id));
        if (selectedBlog?.id === id) {
            setSelectedBlog(null);
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

    const handleUpdateBlog = (e: React.FormEvent) => {
        e.preventDefault();
        setMyBlogs(
            myBlogs.map((b) =>
                b.id === editingId
                    ? {
                            ...b,
                            title: newBlog.title,
                            content: newBlog.content,
                            image: newBlog.image ? URL.createObjectURL(newBlog.image) : b.image,
                        }
                    : b
            )
        );
        setEditingId(null);
        setNewBlog({ title: '', content: '', image: null });
        setShowCreateForm(false);
    };

    const handleLike = (id: number) => {
        setMyBlogs(myBlogs.map(blog => 
            blog.id === id 
                ? { 
                    ...blog, 
                    likes: blog.liked ? blog.likes - 1 : blog.likes + 1,
                    liked: !blog.liked 
                }
                : blog
        ));
        
        if (selectedBlog?.id === id) {
            setSelectedBlog(prev => prev ? {
                ...prev,
                likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
                liked: !prev.liked
            } : null);
        }
    };

    const handleAddComment = (blogId: number) => {
        if (!newComment.trim()) return;
        
        const comment = {
            id: Date.now(),
            user: 'You',
            text: newComment,
            date: new Date().toISOString().split('T')[0]
        };
        
        setMyBlogs(myBlogs.map(blog => 
            blog.id === blogId 
                ? { ...blog, comments: [...blog.comments, comment] }
                : blog
        ));
        
        if (selectedBlog?.id === blogId) {
            setSelectedBlog(prev => prev ? {
                ...prev,
                comments: [...prev.comments, comment]
            } : null);
        }
        
        setNewComment('');
    };

    const handleDeleteComment = (blogId: number, commentId: number) => {
        setMyBlogs(myBlogs.map(blog => 
            blog.id === blogId 
                ? { ...blog, comments: blog.comments.filter(c => c.id !== commentId) }
                : blog
        ));
        
        if (selectedBlog?.id === blogId) {
            setSelectedBlog(prev => prev ? {
                ...prev,
                comments: prev.comments.filter(c => c.id !== commentId)
            } : null);
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
        <div className="blogs-container">
            <div className="blogs-header">
                <h1>My Astronomy Blogs</h1>
                <p>Share your cosmic discoveries and insights with the world.</p>
                <Button onClick={() => setShowCreateForm(true)}>
                    <Plus size={20} />
                    Create New Blog
                </Button>
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
                        
                        <form onSubmit={editingId ? handleUpdateBlog : handleCreateBlog}>
                            <div className="form-group">
                                <label>Blog Title</label>
                                <InputField
                                    type="text"
                                    name="title"
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
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Featured Image</label>
                                <input 
                                    type="file" 
                                    name="image" 
                                    accept="image/*" 
                                    onChange={handleInputChange}
                                />
                            </div>
                            
                            <div className="form-actions">
                                <Button type="submit">
                                    <Save size={16} />
                                    {editingId ? 'Update Blog' : 'Publish Blog'}
                                </Button>
                                <Button 
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setEditingId(null);
                                        setNewBlog({ title: '', content: '', image: null });
                                    }}
                                >
                                    <Save size={16} />
                                    Save Draft
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="blogs-grid">
                {myBlogs.map((blog) => (
                    <div key={blog.id} className="blog-card">
                        <div className="blog-image">
                            {blog.image && (
                                <img src={blog.image} alt={blog.title} />
                            )}
                            <div className="blog-actions">
                                <Button onClick={() => handleEdit(blog.id)}>
                                    <Edit2 size={16} />
                                </Button>
                                <Button onClick={() => handleDelete(blog.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                        
                        <div className="blog-content">
                            <h3>{blog.title}</h3>
                            
                            <div className="blog-meta">
                                <span className="author">{blog.author}</span>
                                <span className="date">{blog.date}</span>
                            </div>
                            
                            <div className="blog-rating">
                                {renderStars(blog.rating)}
                                <span className="rating-value">{blog.rating}</span>
                            </div>
                            
                            <p className="blog-excerpt">
                                {blog.content.substring(0, 150)}...
                            </p>
                            
                            <div className="blog-stats">
                                <span className="stat">
                                    <Eye size={16} />
                                    {blog.reach}
                                </span>
                                <span className="stat">
                                    <Heart size={16} />
                                    {blog.likes}
                                </span>
                                <span className="stat">
                                    <MessageCircle size={16} />
                                    {blog.comments.length}
                                </span>
                            </div>
                            
                            <div className="blog-actions-bottom">
                                <Button 
                                    onClick={() => handleLike(blog.id)}
                                    variant={blog.liked ? 'secondary' : 'outline'}
                                >
                                    <Heart size={16} fill={blog.liked ? 'currentColor' : 'none'} />
                                    {blog.liked ? 'Liked' : 'Like'}
                                </Button>
                                <Button 
                                    onClick={() => setSelectedBlog(blog)}
                                    variant="outline"
                                >
                                    Read More
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {myBlogs.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No blogs yet</h3>
                    <p>Start sharing your astronomical discoveries with the world!</p>
                    <Button onClick={() => setShowCreateForm(true)}>
                        Create Your First Blog
                    </Button>
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
                                <span className="date">{selectedBlog.date}</span>
                                <div className="rating">
                                    {renderStars(selectedBlog.rating)}
                                    <span>{selectedBlog.rating}</span>
                                </div>
                            </div>
                            
                            <div className="modal-stats">
                                <span><Eye size={16} /> {selectedBlog.reach} views</span>
                                <span><Heart size={16} /> {selectedBlog.likes} likes</span>
                                <span><MessageCircle size={16} /> {selectedBlog.comments.length} comments</span>
                            </div>
                            
                            <div className="modal-text">
                                <p>{selectedBlog.content}</p>
                            </div>
                            
                            <div className="comments-section">
                                <h3>Comments ({selectedBlog.comments.length})</h3>
                                
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
                                    {selectedBlog.comments.map((comment) => (
                                        <div key={comment.id} className="comment">
                                            <div className="comment-header">
                                                <span className="comment-author">{comment.user}</span>
                                                <span className="comment-timestamp">{comment.date}</span>
                                                <Button 
                                                    onClick={() => handleDeleteComment(selectedBlog.id, comment.id)}
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
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
                <Button 
                    className={`tab-button ${activeTab === 'blogs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blogs')}
                >
                    Blogs
                </Button>
                <Button 
                    className={`tab-button ${activeTab === 'my-blogs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my-blogs')}
                >
                    My Blogs
                </Button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'blogs' ? renderBlogsTab() : renderMyBlogsTab()}
            </div>
        </div>
    );
}