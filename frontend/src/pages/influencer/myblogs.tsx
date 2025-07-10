import React, { useState, useEffect } from 'react';
import { Star, Edit2, Trash2, MessageCircle, Eye, Heart, Plus, Save, X, Send } from 'lucide-react';
import '../../styles/pages/influencer/myblogs.scss'

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
};

const mockBlogs: Blog[] = [
    {
        id: 1,
        title: 'The Orion Nebula: A Stellar Nursery',
        content: 'The Orion Nebula is one of the brightest nebulae visible to the naked eye. Located approximately 1,344 light-years from Earth, this stellar nursery is where new stars are born from cosmic dust and gas. The nebula spans about 24 light-years and contains enough material to form thousands of stars.',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
        author: 'Dr. Jane Skywalker',
        date: '2025-06-20',
        reach: 1247,
        likes: 89,
        rating: 4.7,
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
        author: 'Prof. John Cosmos',
        date: '2025-06-18',
        reach: 892,
        likes: 67,
        rating: 4.9,
        comments: [
            { id: 3, user: 'Maria Galaxy', text: 'The explanation of red shift is excellent!', date: '2025-06-19' },
        ],
    },
];

export default function MyBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [newBlog, setNewBlog] = useState<{ title: string; content: string; image: File | null }>({ title: '', content: '', image: null });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState<number | null>(null);

    useEffect(() => {
        setBlogs(mockBlogs);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setNewBlog((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleCreateBlog = (e) => {
        e.preventDefault();
        const newId = blogs.length ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
        const newBlogPost = {
            ...newBlog,
            id: newId,
            author: 'You',
            date: new Date().toISOString().split('T')[0],
            reach: 0,
            likes: 0,
            rating: 0,
            comments: [],
            image: newBlog.image ? URL.createObjectURL(newBlog.image) : null,
        };
        setBlogs([newBlogPost, ...blogs]);
        setNewBlog({ title: '', content: '', image: null });
        setShowCreateForm(false);
    };

    const handleDelete = (id) => {
        setBlogs(blogs.filter((b) => b.id !== id));
        if (selectedBlog?.id === id) {
            setSelectedBlog(null);
        }
    };

    const handleEdit = (id) => {
        setEditingId(id);
        const blog = blogs.find((b) => b.id === id);
        setNewBlog({ title: blog.title, content: blog.content, image: null });
        setShowCreateForm(true);
    };

    const handleUpdateBlog = (e) => {
        e.preventDefault();
        setBlogs(
            blogs.map((b) =>
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

    const handleLike = (id) => {
        setBlogs(blogs.map(blog => 
            blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
        ));
    };

    const handleAddComment = (blogId) => {
        if (!newComment.trim()) return;
        
        const comment = {
            id: Date.now(),
            user: 'You',
            text: newComment,
            date: new Date().toISOString().split('T')[0]
        };
        
        setBlogs(blogs.map(blog => 
            blog.id === blogId 
                ? { ...blog, comments: [...blog.comments, comment] }
                : blog
        ));
        setNewComment('');
    };

    const handleDeleteComment = (blogId, commentId) => {
        setBlogs(blogs.map(blog => 
            blog.id === blogId 
                ? { ...blog, comments: blog.comments.filter(c => c.id !== commentId) }
                : blog
        ));
    };

    const renderStars = (rating) => {
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
        <div className="blogs-container">
            <div className="blogs-header">
                <h1>My Astronomy Blogs</h1>
                <p>Share your cosmic discoveries and insights with the world.</p>
                <button 
                    className="create-blog-btn"
                    onClick={() => setShowCreateForm(true)}
                >
                    <Plus size={20} />
                    Create New Blog
                </button>
            </div>

            {showCreateForm && (
                <div className="blog-form-overlay">
                    <div className="blog-form">
                        <div className="form-header">
                            <h2>{editingId ? 'Edit Blog' : 'Create New Blog'}</h2>
                            <button 
                                className="close-btn"
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingId(null);
                                    setNewBlog({ title: '', content: '', image: null });
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={editingId ? handleUpdateBlog : handleCreateBlog}>
                            <div className="form-group">
                                <label>Blog Title</label>
                                <input
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
                                <button type="submit" className="submit-btn">
                                    <Save size={16} />
                                    {editingId ? 'Update Blog' : 'Publish Blog'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="blogs-grid">
                {blogs.map((blog) => (
                    <div key={blog.id} className="blog-card">
                        <div className="blog-image">
                            {blog.image && (
                                <img src={blog.image} alt={blog.title} />
                            )}
                            <div className="blog-actions">
                                <button onClick={() => handleEdit(blog.id)} className="action-btn edit">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(blog.id)} className="action-btn delete">
                                    <Trash2 size={16} />
                                </button>
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
                                <button 
                                    className="like-btn"
                                    onClick={() => handleLike(blog.id)}
                                >
                                    <Heart size={16} />
                                    Like
                                </button>
                                <button 
                                    className="read-more-btn"
                                    onClick={() => setSelectedBlog(blog)}
                                >
                                    Read More
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {blogs.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No blogs yet</h3>
                    <p>Start sharing your astronomical discoveries with the world!</p>
                    <button 
                        className="create-first-blog-btn"
                        onClick={() => setShowCreateForm(true)}
                    >
                        Create Your First Blog
                    </button>
                </div>
            )}

            {selectedBlog && (
                <div className="blog-modal-overlay">
                    <div className="blog-modal">
                        <div className="modal-header">
                            <h2>{selectedBlog.title}</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setSelectedBlog(null)}
                            >
                                <X size={20} />
                            </button>
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
                                    <button 
                                        onClick={() => handleAddComment(selectedBlog.id)}
                                        className="send-comment-btn"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                                
                                <div className="comments-list">
                                    {selectedBlog.comments.map((comment) => (
                                        <div key={comment.id} className="comment">
                                            <div className="comment-header">
                                                <strong>{comment.user}</strong>
                                                <span className="comment-date">{comment.date}</span>
                                                <button 
                                                    className="delete-comment-btn"
                                                    onClick={() => handleDeleteComment(selectedBlog.id, comment.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
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
};