import React, { useState, useEffect } from 'react';
import { Star, Edit2, Trash2, MessageCircle, Eye, Heart, Plus, Save, X, Send, BookOpen, Users, Calendar, EyeOff } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { BookOpenIcon, UserGroupIcon, StarIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import AstronomyBlogCard from "../../components/Learner/blogcard";
import { blogs, totalBlogs, avgRating, latestDate } from "../learner/blogData";
import '../../styles/pages/influencer/myblogs.scss'
import "../../styles/pages/learner/blog_explore.scss"
import "../../styles/pages/learner/BlogPage.scss"

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
    image: string | null;
    author: string;
    date: string;
    reach: number;
    likes: number;
    rating: number;
    comments: Comment[];
    liked: boolean;
    published: boolean;
    createdAt: string;
};

// Current user constant
const CURRENT_USER = 'Neil V. Galaxy';

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
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="blog-rating">
                    <div className="stars">
                        {renderStars(blog.rating)}
                    </div>
                    <span className="rating-value">{blog.rating}</span>
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
                        <span>{blog.comments.length}</span>
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
    const [activeTab, setActiveTab] = useState<ActiveSection>('blogs');
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
        search: '',
        status: 'all' // all, published, draft
    });

    useEffect(() => {
        console.log('Loading blogs for user:', CURRENT_USER);
        // Convert blogs from blogData to Blog type and filter by current user
        const convertedBlogs: Blog[] = blogs
            .filter(blog => blog.author === CURRENT_USER)
            .map(blog => ({
                ...blog,
                date: blog.createdAt,
                reach: Math.floor(Math.random() * 1000) + 100, // Random reach for demo
                likes: Math.floor(Math.random() * 50) + 10, // Random likes for demo
                comments: [], // Start with no comments
                liked: false,
                published: Math.random() > 0.5, // Randomly assign published status for demo
            }));
        
        console.log('Converted blogs:', convertedBlogs);
        setMyBlogs(convertedBlogs);
    }, []);

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

    const handleCreateBlog = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating blog:', newBlog);
        
        if (!newBlog.title.trim() || !newBlog.content.trim()) {
            alert('Please fill in both title and content');
            return;
        }

        const newId = myBlogs.length ? Math.max(...myBlogs.map(b => b.id)) + 1 : 1000; // Start with high ID to avoid conflicts
        const currentDate = new Date().toISOString().split('T')[0];
        const newBlogPost: Blog = {
            title: newBlog.title,
            content: newBlog.content,
            id: newId,
            author: CURRENT_USER,
            date: currentDate,
            createdAt: currentDate,
            reach: 0,
            likes: 0,
            rating: 0,
            comments: [],
            liked: false,
            published: false, // Default to draft
            image: newBlog.image ? URL.createObjectURL(newBlog.image) : null,
        };
        
        console.log('New blog post:', newBlogPost);
        setMyBlogs([newBlogPost, ...myBlogs]);
        setNewBlog({ title: '', content: '', image: null });
        setShowCreateForm(false);
    };

    const handleSaveAsDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            handleUpdateBlog(e, false);
        } else {
            handleCreateBlog(e);
        }
    };

    const handlePublishBlog = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            handleUpdateBlog(e, true);
        } else {
            console.log('Publishing blog:', newBlog);
            
            if (!newBlog.title.trim() || !newBlog.content.trim()) {
                alert('Please fill in both title and content');
                return;
            }

            const newId = myBlogs.length ? Math.max(...myBlogs.map(b => b.id)) + 1 : 1000;
            const currentDate = new Date().toISOString().split('T')[0];
            const newBlogPost: Blog = {
                title: newBlog.title,
                content: newBlog.content,
                id: newId,
                author: CURRENT_USER,
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
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            setMyBlogs(myBlogs.filter((b) => b.id !== id));
            if (selectedBlog?.id === id) {
                setSelectedBlog(null);
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

    const handleTogglePublish = (id: number) => {
        setMyBlogs(myBlogs.map(blog => 
            blog.id === id 
                ? { ...blog, published: !blog.published }
                : blog
        ));
        
        // Update selected blog if it's the one being toggled
        if (selectedBlog?.id === id) {
            setSelectedBlog(prev => prev ? {
                ...prev,
                published: !prev.published
            } : null);
        }
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

            {/* Tab Navigation (moved here) */}
            <div className="tab-navigation" style={{ margin: '1.2rem 0' }}>
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

            {/* Blog Filters (only show if Explore Blogs tab is active) */}
            {activeTab === 'blogs' && (
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
            )}

            {/* Blog List (only show if Explore Blogs tab is active) */}
            {activeTab === 'blogs' && (
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
            )}
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
                                <label>Featured Image</label>
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
                            </div>
                            
                            <div className="form-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <Button 
                                    type="submit"
                                    variant="outline"
                                >
                                    <Save size={16} />
                                    Save as Draft
                                </Button>
                                <Button 
                                    type="button"
                                    onClick={handlePublishBlog}
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
                                <span className="date">{selectedBlog.date}</span>
                                <div className="rating">
                                    {renderStars(selectedBlog.rating)}
                                    <span>{selectedBlog.rating}</span>
                                </div>
                                <span className={`status ${selectedBlog.published ? 'published' : 'draft'}`}>
                                    {selectedBlog.published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            
                            <div className="modal-stats">
                                <span><Eye size={16} /> {selectedBlog.reach} views</span>
                                <span><Heart size={16} /> {selectedBlog.likes} likes</span>
                                <span><MessageCircle size={16} /> {selectedBlog.comments.length} comments</span>
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
                                    variant="outline"
                                >
                                    <Edit2 size={16} />
                                    Edit
                                </Button>
                                <Button 
                                    onClick={() => handleTogglePublish(selectedBlog.id)}
                                    variant="outline"
                                >
                                    {selectedBlog.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                    {selectedBlog.published ? 'Unpublish' : 'Publish'}
                                </Button>
                                <Button 
                                    onClick={() => handleLike(selectedBlog.id)}
                                    variant={selectedBlog.liked ? 'secondary' : 'outline'}
                                >
                                    <Heart size={16} fill={selectedBlog.liked ? 'currentColor' : 'none'} />
                                    {selectedBlog.liked ? 'Liked' : 'Like'}
                                </Button>
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
                                                {comment.user === 'You' && (
                                                    <Button 
                                                        onClick={() => handleDeleteComment(selectedBlog.id, comment.id)}
                                                        variant="ghost"
                                                        size="sm"
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
            {/* Always show Explore Astronomy Blogs above tabs */}
            {renderBlogsTab()}

            {/* Tab Content (only show My Blogs tab content if active) */}
            <div className="tab-content">
                {activeTab === 'myblogs' && renderMyBlogsTab()}
            </div>
        </div>
    );
};