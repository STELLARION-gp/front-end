import React, { useState, useEffect } from 'react';
import { Star, Edit2, Trash2, MessageCircle, Eye, Heart, Plus, Save, X, Send } from 'lucide-react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import '../../styles/pages/influencer/myblogs.scss';

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
    createdAt?: string;
};

type ActiveSection = 'blogs' | 'myblogs';

// Mock data for blog explore section
const mockExploreBlogs: Blog[] = [
    {
        id: 101,
        title: 'The Mystery of Black Holes',
        content: 'Black holes are among the most fascinating objects in the universe. These cosmic phenomena occur when massive stars collapse under their own gravity, creating regions where gravity is so strong that nothing, not even light, can escape. Recent discoveries by the Event Horizon Telescope have given us our first direct images of these mysterious objects.',
        image: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=400&fit=crop',
        author: 'Dr. Sarah Johnson',
        date: '2025-07-15',
        createdAt: '2025-07-15',
        reach: 2341,
        likes: 156,
        rating: 4.8,
        comments: [],
        liked: false,
    },
    {
        id: 102,
        title: 'Journey to Mars: The Red Planet Awaits',
        content: 'Mars has captured human imagination for centuries. With its distinctive red appearance and potential for past life, Mars represents our next frontier in space exploration. Recent rover missions have provided unprecedented insights into the planet\'s geology and climate history.',
        image: 'https://images.unsplash.com/photo-1614732414444-096a5d1d1fa6?w=800&h=400&fit=crop',
        author: 'Prof. Michael Chen',
        date: '2025-07-12',
        createdAt: '2025-07-12',
        reach: 1876,
        likes: 89,
        rating: 4.6,
        comments: [],
        liked: false,
    },
    {
        id: 103,
        title: 'Exoplanets: Worlds Beyond Our Solar System',
        content: 'The discovery of exoplanets has revolutionized our understanding of planetary systems. With over 5,000 confirmed exoplanets, we\'ve found worlds that challenge our preconceptions about planet formation and the potential for life elsewhere in the universe.',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
        author: 'Dr. Emily Rodriguez',
        date: '2025-07-10',
        createdAt: '2025-07-10',
        reach: 1654,
        likes: 123,
        rating: 4.7,
        comments: [],
        liked: false,
    },
];

const mockBlogs: Blog[] = [
    {
        id: 1,
        title: 'The Orion Nebula: A Stellar Nursery',
        content: 'The Orion Nebula is one of the brightest nebulae visible to the naked eye. Located approximately 1,344 light-years from Earth, this stellar nursery is where new stars are born from cosmic dust and gas. The nebula spans about 24 light-years and contains enough material to form thousands of stars.',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=400&fit=crop',
        author: 'Astro Influencer',
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

// Simple blog card component to replace the missing import
const AstronomyBlogCard = ({ image, title, author, createdAt, rating, content, onClick }) => {
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="star-full" size={16} />);
        }
        
        if (hasHalfStar) {
            stars.push(<Star key="half" className="star-half" size={16} />);
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="star-empty" size={16} />);
        }
        
        return stars;
    };

    return (
        <div className="astronomy-blog-card" onClick={onClick}>
            {image && (
                <img src={image} alt={title} className="blog-card-image" />
            )}
            <div className="blog-card-content">
                <h3 className="blog-card-title">{title}</h3>
                <p className="blog-card-meta">By {author} • {createdAt}</p>
                <div className="blog-card-rating">
                    {renderStars(rating)}
                    <span className="rating-text">{rating}</span>
                </div>
                <p className="blog-card-preview">
                    {content.substring(0, 120)}...
                </p>
            </div>
        </div>
    );
};

export default function MyBlogs() {
    const [activeSection, setActiveSection] = useState<ActiveSection>('blogs');
    const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
    const [newBlog, setNewBlog] = useState<{ title: string; content: string; image: File | null }>({ title: '', content: '', image: null });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [newComment, setNewComment] = useState('');
    
    // Blog explore filters
    const [filter, setFilter] = useState({
        author: '',
        minRating: '',
        search: ''
    });

    // Mock statistics for explore section
    const totalBlogs = mockExploreBlogs.length;
    const uniqueAuthors = Array.from(new Set(mockExploreBlogs.map(b => b.author)));
    const avgRating = (mockExploreBlogs.reduce((sum, blog) => sum + blog.rating, 0) / mockExploreBlogs.length).toFixed(1);
    const latestDate = mockExploreBlogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || '';

    useEffect(() => {
        setMyBlogs(mockBlogs);
    }, []);

    // Filter blogs for explore section
    const filteredBlogs = mockExploreBlogs.filter(blog => {
        if (filter.author && blog.author !== filter.author) return false;
        if (filter.minRating && blog.rating < Number(filter.minRating)) return false;
        if (filter.search && !blog.title.toLowerCase().includes(filter.search.toLowerCase()) && !blog.content.toLowerCase().includes(filter.search.toLowerCase())) return false;
        return true;
    });

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
            stars.push(<Star key={i} className="star-full" size={16} />);
        }
        
        if (hasHalfStar) {
            stars.push(<Star key="half" className="star-half" size={16} />);
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="star-empty" size={16} />);
        }
        
        return stars;
    };

    const renderBlogsExplore = () => (
        <div className="blogs-explore">
            <div className="explore-header">
                <h2 className="explore-title">Explore Astronomy Blogs</h2>
                <p className="explore-subtitle">Discover the latest insights and discoveries in the field of astronomy.</p>
            </div>
            
            <div className="stats-grid">
                <div className="stat-card stat-card-blue">
                    <div className="stat-icon">📚</div>
                    <div className="stat-value">{totalBlogs}</div>
                    <div className="stat-label">Total Blogs</div>
                </div>
                <div className="stat-card stat-card-green">
                    <div className="stat-icon">👥</div>
                    <div className="stat-value">{uniqueAuthors.length}</div>
                    <div className="stat-label">Unique Authors</div>
                </div>
                <div className="stat-card stat-card-yellow">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-value">{avgRating}</div>
                    <div className="stat-label">Average Rating</div>
                </div>
                <div className="stat-card stat-card-pink">
                    <div className="stat-icon">📅</div>
                    <div className="stat-value">{latestDate}</div>
                    <div className="stat-label">Latest Blog</div>
                </div>
            </div>

            <div className="blog-filters">
                <input
                    type="text"
                    placeholder="Search title or content..."
                    value={filter.search}
                    onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                    className="filter-input search-input"
                />
                <select
                    value={filter.author}
                    onChange={e => setFilter(f => ({ ...f, author: e.target.value }))}
                    className="filter-select"
                >
                    <option value="">All Authors</option>
                    {uniqueAuthors.map(author => (
                        <option key={author} value={author}>{author}</option>
                    ))}
                </select>
                <select
                    value={filter.minRating}
                    onChange={e => setFilter(f => ({ ...f, minRating: e.target.value }))}
                    className="filter-select"
                >
                    <option value="">Any Rating</option>
                    {[5,4,3,2,1].map(r => (
                        <option key={r} value={r}>{r}+ Stars</option>
                    ))}
                </select>
            </div>
            
            <div className="blogs-grid">
                {filteredBlogs.map(blog => (
                    <AstronomyBlogCard
                        key={blog.id}
                        image={blog.image}
                        title={blog.title}
                        author={blog.author}
                        createdAt={blog.createdAt || blog.date}
                        rating={blog.rating}
                        content={blog.content}
                        onClick={() => setSelectedBlog(blog)}
                    />
                ))}
            </div>
        </div>
    );

    const renderMyBlogs = () => (
        <div className="my-blogs">
            <div className="my-blogs-header">
                <div className="header-content">
                    <h1 className="page-title">My Astronomy Blogs</h1>
                    <p className="page-subtitle">Share your cosmic discoveries and insights with the world.</p>
                </div>
                <Button onClick={() => setShowCreateForm(true)} className="create-blog-btn">
                    <Plus size={20} />
                    Create New Blog
                </Button>
            </div>

            {showCreateForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">{editingId ? 'Edit Blog' : 'Create New Blog'}</h2>
                            <Button 
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingId(null);
                                    setNewBlog({ title: '', content: '', image: null });
                                }}
                                className="modal-close-btn"
                            >
                                <X size={24} />
                            </Button>
                        </div>
                        
                        <form onSubmit={editingId ? handleUpdateBlog : handleCreateBlog} className="modal-form">
                            <div className="form-group">
                                <label className="form-label">Blog Title</label>
                                <InputField
                                    type="text"
                                    name="title"
                                    placeholder="Enter your blog title..."
                                    value={newBlog.title}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                    label={''}
                                    id={''}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Content</label>
                                <textarea
                                    name="content"
                                    placeholder="Share your astronomical insights..."
                                    value={newBlog.content}
                                    onChange={handleInputChange}
                                    required
                                    rows={8}
                                    className="form-textarea"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Featured Image</label>
                                <input 
                                    type="file" 
                                    name="image" 
                                    accept="image/*" 
                                    onChange={handleInputChange}
                                    className="form-file-input"
                                />
                            </div>
                            
                            <div className="form-actions">
                                <Button type="submit" className="submit-btn">
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
                                    className="cancel-btn"
                                >
                                    <X size={16} />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="my-blogs-grid">
                {myBlogs.map((blog) => (
                    <div key={blog.id} className="my-blog-card">
                        <div className="blog-card-header">
                            {blog.image && (
                                <img src={blog.image} alt={blog.title} className="blog-image" />
                            )}
                            <div className="blog-actions">
                                <Button onClick={() => handleEdit(blog.id)} className="edit-btn">
                                    <Edit2 size={16} />
                                </Button>
                                <Button onClick={() => handleDelete(blog.id)} className="delete-btn">
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>
                        
                        <div className="blog-card-body">
                            <h3 className="blog-title">{blog.title}</h3>
                            
                            <div className="blog-meta">
                                <span>{blog.author}</span> • <span>{blog.date}</span>
                            </div>
                            
                            <div className="blog-rating">
                                {renderStars(blog.rating)}
                                <span className="rating-value">{blog.rating}</span>
                            </div>
                            
                            <p className="blog-content-preview">
                                {blog.content.substring(0, 150)}...
                            </p>
                            
                            <div className="blog-stats">
                                <span className="stat-item">
                                    <Eye size={16} />
                                    {blog.reach}
                                </span>
                                <span className="stat-item">
                                    <Heart size={16} />
                                    {blog.likes}
                                </span>
                                <span className="stat-item">
                                    <MessageCircle size={16} />
                                    {blog.comments.length}
                                </span>
                            </div>
                            
                            <div className="blog-card-actions">
                                <Button 
                                    onClick={() => handleLike(blog.id)}
                                    className={`like-btn ${blog.liked ? 'liked' : ''}`}
                                >
                                    <Heart size={16} fill={blog.liked ? 'currentColor' : 'none'} />
                                    {blog.liked ? 'Liked' : 'Like'}
                                </Button>
                                <Button 
                                    onClick={() => setSelectedBlog(blog)}
                                    className="read-more-btn"
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
                    <h3 className="empty-title">No blogs yet</h3>
                    <p className="empty-subtitle">Start sharing your astronomical discoveries with the world!</p>
                    <Button onClick={() => setShowCreateForm(true)} className="empty-action-btn">
                        Create Your First Blog
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className="my-blogs-page">
            <div className="page-container">
                <div className="navigation-tabs">
                    <Button
                        onClick={() => setActiveSection('blogs')}
                        className={`nav-tab ${activeSection === 'blogs' ? 'active' : ''}`}
                    >
                        Explore Blogs
                    </Button>
                    <Button
                        onClick={() => setActiveSection('myblogs')}
                        className={`nav-tab ${activeSection === 'myblogs' ? 'active' : ''}`}
                    >
                        My Blogs
                    </Button>
                </div>

                <div className="page-content">
                    {activeSection === 'blogs' ? renderBlogsExplore() : renderMyBlogs()}
                </div>

                {selectedBlog && (
                    <div className="modal-overlay">
                        <div className="blog-detail-modal">
                            <div className="modal-header">
                                <h2 className="modal-title">{selectedBlog.title}</h2>
                                <Button 
                                    onClick={() => setSelectedBlog(null)}
                                    className="modal-close-btn"
                                >
                                    <X size={24} />
                                </Button>
                            </div>
                            <div className="modal-body">
                                <p className="blog-content">{selectedBlog.content}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};