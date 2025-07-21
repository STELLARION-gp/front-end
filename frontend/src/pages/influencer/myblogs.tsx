import React, { useState, useEffect } from 'react';
import { Star, Edit2, Trash2, MessageCircle, Eye, Heart, Plus, Save, X, Send, BookOpen, Users, Calendar, EyeOff, Download } from 'lucide-react'; // Added Download icon
import { useNavigate } from "react-router-dom";
import { BookOpenIcon, UserGroupIcon, StarIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import AstronomyBlogCard from "../../components/Learner/blogcard";
import { blogs, totalBlogs, avgRating, latestDate } from "../learner/blogData";
import '../../styles/pages/influencer/myblogs.scss'
import "../../styles/pages/learner/blog_explore.scss"
import "../../styles/pages/learner/BlogPage.scss"

// Updated ActiveSection type to include vlogs
type ActiveSection = 'blogs' | 'myblogs' | 'vlogs' | 'myvlogs';

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

// New Vlog Type
type Vlog = {
    id: number;
    title: string;
    description: string; // Renamed from content for video context
    videoUrl: string | null; // URL for the video
    thumbnail: string | null; // Thumbnail for the video
    author: string;
    date: string;
    views: number; // Renamed from reach for video context
    likes: number;
    comments: Comment[];
    liked: boolean;
    published: boolean;
    createdAt: string;
};

// Current user constant
const CURRENT_USER = 'Neil V. Galaxy';

// Custom Blog Card Component for My Blogs (Existing)
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

                <div className="blog-actions-overlay" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8, alignItems: 'center' }}>
                    <span style={{
                        fontWeight: 600,
                        color: blog.published ? '#22d3ee' : '#fbbf24',
                        fontSize: 15,
                        marginRight: 12,
                        marginLeft: 0,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {blog.published ? 'Published' : 'Draft'}
                    </span>
                    <button
                        className="action-btn edit-btn"
                        style={{
                            background: 'transparent',
                            border: '1.5px solid #334155',
                            borderRadius: 8,
                            cursor: 'pointer',
                            padding: '10px 16px',
                            fontSize: 20,
                            marginRight: 0
                        }}
                        onClick={() => onEdit(blog.id)}
                        title="Edit"
                    >
                        <Edit2 size={24} />
                    </button>
                    <button
                        className="action-btn delete-btn"
                        style={{
                            background: 'transparent',
                            border: '1.5px solid #334155',
                            borderRadius: 8,
                            cursor: 'pointer',
                            padding: '10px 16px',
                            fontSize: 20,
                            marginRight: 0
                        }}
                        onClick={() => onDelete(blog.id)}
                        title="Delete"
                    >
                        <Trash2 size={24} />
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
                    {blog.published ? (
                        <>
                            <div className="stat-item">
                                <Eye size={20} />
                                <span>{blog.reach}</span>
                            </div>
                            <div className="stat-item">
                                <Heart size={20} />
                                <span>{blog.likes}</span>
                            </div>
                            <div className="stat-item">
                                <MessageCircle size={20} />
                                <span>{blog.comments.length}</span>
                            </div>
                        </>
                    ) : (
                        <span style={{ fontStyle: 'italic', color: '#6b7280' }}>Draft - Stats not available</span>
                    )}
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

// Custom Vlog Card Component for My Vlogs (New)
const MyVlogCard: React.FC<{
    vlog: Vlog;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onTogglePublish: (id: number) => void;
    onView: (vlog: Vlog) => void;
}> = ({ vlog, onEdit, onDelete, onTogglePublish, onView }) => {
    return (
        <div className={`blog-card ${!vlog.published ? 'draft' : ''}`}> {/* Reusing blog-card styling */}
            <div className="blog-image-container"> {/* Reusing blog-image-container for video thumbnail */}
                {vlog.thumbnail ? (
                    <img src={vlog.thumbnail} alt={vlog.title} className="blog-image" />
                ) : (
                    <div className="blog-image-placeholder">
                        <BookOpen size={48} /> {/* Or a video icon */}
                    </div>
                )}
                <div className="blog-actions-overlay" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8, alignItems: 'center' }}>
                    <span style={{
                        fontWeight: 600,
                        color: vlog.published ? '#22d3ee' : '#fbbf24',
                        fontSize: 15,
                        marginRight: 12,
                        marginLeft: 0,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {vlog.published ? 'Published' : 'Draft'}
                    </span>
                    <button
                        className="action-btn edit-btn"
                        style={{
                            background: 'transparent',
                            border: '1.5px solid #334155',
                            borderRadius: 8,
                            cursor: 'pointer',
                            padding: '10px 16px',
                            fontSize: 20,
                            marginRight: 0
                        }}
                        onClick={() => onEdit(vlog.id)}
                        title="Edit"
                    >
                        <Edit2 size={24} />
                    </button>
                    <button
                        className="action-btn delete-btn"
                        style={{
                            background: 'transparent',
                            border: '1.5px solid #334155',
                            borderRadius: 8,
                            cursor: 'pointer',
                            padding: '10px 16px',
                            fontSize: 20,
                            marginRight: 0
                        }}
                        onClick={() => onDelete(vlog.id)}
                        title="Delete"
                    >
                        <Trash2 size={24} />
                    </button>
                </div>
            </div>
            <div className="blog-content">
                <h3 className="blog-title" onClick={() => onView(vlog)}>
                    {vlog.title}
                </h3>
                <div className="blog-meta">
                    <div className="meta-item">
                        <Users size={14} />
                        <span>{vlog.author}</span>
                    </div>
                    <div className="meta-item">
                        <Calendar size={14} />
                        <span>{new Date(vlog.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <p className="blog-excerpt">
                    {vlog.description.length > 120
                        ? `${vlog.description.substring(0, 120)}...`
                        : vlog.description
                    }
                </p>
                <div className="blog-stats">
                    {vlog.published ? ( // Only show stats if published
                        <>
                            <div className="stat-item">
                                <Eye size={20} />
                                <span>{vlog.views}</span>
                            </div>
                            <div className="stat-item">
                                <Heart size={20} />
                                <span>{vlog.likes}</span>
                            </div>
                            <div className="stat-item">
                                <MessageCircle size={20} />
                                <span>{vlog.comments.length}</span>
                            </div>
                        </>
                    ) : (
                        <span style={{ fontStyle: 'italic', color: '#6b7280' }}>Draft - Stats not available</span>
                    )}
                </div>
                <div className="blog-actions-bottom">
                    <button
                        className="see-more-btn"
                        onClick={() => onView(vlog)}
                    >
                        Watch Now
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

    // Vlog states (New)
    const [myVlogs, setMyVlogs] = useState<Vlog[]>([]);
    const [newVlog, setNewVlog] = useState<{ title: string; description: string; videoFile: File | null; thumbnailFile: File | null }>({ title: '', description: '', videoFile: null, thumbnailFile: null });
    const [editingVlogId, setEditingVlogId] = useState<number | null>(null);
    const [showCreateVlogForm, setShowCreateVlogForm] = useState(false);
    const [selectedVlog, setSelectedVlog] = useState<Vlog | null>(null);
    const [vlogFilter, setVlogFilter] = React.useState({
        author: '',
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

        // Dummy vlog data for demonstration (New)
        const dummyVlogs: Vlog[] = [
            {
                id: 1,
                title: "Journey to the Red Planet",
                description: "An exciting exploration of Mars, its geology, and the search for life. This video covers the latest findings from rovers and orbiters.",
                videoUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4", // Placeholder MP4
                thumbnail: "https://via.placeholder.com/300x200?text=Mars+Vlog",
                author: CURRENT_USER,
                date: "2023-01-15",
                views: 1500,
                likes: 250,
                comments: [],
                liked: false,
                published: true,
                createdAt: "2023-01-15"
            },
            {
                id: 2,
                title: "Understanding Black Holes",
                description: "A deep dive into the mysteries of black holes, from their formation to their impact on galaxies. We'll explore concepts like event horizons and singularities.",
                videoUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4", // Placeholder MP4
                thumbnail: "https://via.placeholder.com/300x200?text=Black+Hole+Vlog",
                author: CURRENT_USER,
                date: "2023-02-20",
                views: 800,
                likes: 120,
                comments: [],
                liked: false,
                published: false,
                createdAt: "2023-02-20"
            },
            {
                id: 3,
                title: "The Beauty of Nebulae",
                description: "Explore the stunning cosmic clouds where stars are born and die. This video showcases some of the most famous nebulae in our galaxy.",
                videoUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4", // Placeholder MP4
                thumbnail: "https://via.placeholder.com/300x200?text=Nebulae+Vlog",
                author: CURRENT_USER,
                date: "2023-03-10",
                views: 2100,
                likes: 400,
                comments: [],
                liked: false,
                published: true,
                createdAt: "2023-03-10"
            }
        ];
        setMyVlogs(dummyVlogs);

    }, []);

    // Blog Filtering Logic (Existing)
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

    // Vlog Filtering Logic (New)
    const filteredVlogs = myVlogs.filter(vlog => { // Assuming 'Explore Vlogs' shows all vlogs, including current user's
        if (vlogFilter.author && vlog.author !== vlogFilter.author) return false;
        if (vlogFilter.search && !vlog.title.toLowerCase().includes(vlogFilter.search.toLowerCase()) && !vlog.description.toLowerCase().includes(vlogFilter.search.toLowerCase())) return false;
        return true;
    });

    const filteredMyVlogs = myVlogs.filter(vlog => {
        if (vlogFilter.status === 'published' && !vlog.published) return false;
        if (vlogFilter.status === 'draft' && vlog.published) return false;
        if (vlogFilter.search && !vlog.title.toLowerCase().includes(vlogFilter.search.toLowerCase()) && !vlog.description.toLowerCase().includes(vlogFilter.search.toLowerCase())) return false;
        return true;
    });

    const uniqueVlogAuthors = Array.from(new Set(myVlogs.map(v => v.author))); // Only authors from myVlogs for simplicity


    // Blog Handlers (Existing)
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

    // Vlog Handlers (New)
    const handleVlogInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const files = (e.target as HTMLInputElement).files;
        setNewVlog((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleCreateVlog = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newVlog.title.trim() || !newVlog.description.trim() || !newVlog.videoFile) {
            alert('Please fill in title, description, and upload a video');
            return;
        }

        const newId = myVlogs.length ? Math.max(...myVlogs.map(v => v.id)) + 1 : 2000; // Different ID range for vlogs
        const currentDate = new Date().toISOString().split('T')[0];
        const newVlogPost: Vlog = {
            title: newVlog.title,
            description: newVlog.description,
            id: newId,
            author: CURRENT_USER,
            date: currentDate,
            createdAt: currentDate,
            views: 0,
            likes: 0,
            comments: [],
            liked: false,
            published: false, // Default to draft
            videoUrl: newVlog.videoFile ? URL.createObjectURL(newVlog.videoFile) : null,
            thumbnail: newVlog.thumbnailFile ? URL.createObjectURL(newVlog.thumbnailFile) : null,
        };

        setMyVlogs([newVlogPost, ...myVlogs]);
        setNewVlog({ title: '', description: '', videoFile: null, thumbnailFile: null });
        setShowCreateVlogForm(false);
    };

    const handleSaveVlogAsDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVlogId) {
            handleUpdateVlog(e, false);
        } else {
            handleCreateVlog(e);
        }
    };

    const handlePublishVlog = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVlogId) {
            handleUpdateVlog(e, true);
        } else {
            if (!newVlog.title.trim() || !newVlog.description.trim() || !newVlog.videoFile) {
                alert('Please fill in title, description, and upload a video');
                return;
            }

            const newId = myVlogs.length ? Math.max(...myVlogs.map(v => v.id)) + 1 : 2000;
            const currentDate = new Date().toISOString().split('T')[0];
            const newVlogPost: Vlog = {
                title: newVlog.title,
                description: newVlog.description,
                id: newId,
                author: CURRENT_USER,
                date: currentDate,
                createdAt: currentDate,
                views: 0,
                likes: 0,
                comments: [],
                liked: false,
                published: true,
                videoUrl: newVlog.videoFile ? URL.createObjectURL(newVlog.videoFile) : null,
                thumbnail: newVlog.thumbnailFile ? URL.createObjectURL(newVlog.thumbnailFile) : null,
            };
            setMyVlogs([newVlogPost, ...myVlogs]);
            setNewVlog({ title: '', description: '', videoFile: null, thumbnailFile: null });
            setShowCreateVlogForm(false);
        }
    };

    const handleDeleteVlog = (id: number) => {
        if (window.confirm('Are you sure you want to delete this vlog?')) {
            setMyVlogs(myVlogs.filter((v) => v.id !== id));
            if (selectedVlog?.id === id) {
                setSelectedVlog(null);
            }
        }
    };

    const handleEditVlog = (id: number) => {
        setEditingVlogId(id);
        const vlog = myVlogs.find((v) => v.id === id);
        if (vlog) {
            setNewVlog({ title: vlog.title, description: vlog.description, videoFile: null, thumbnailFile: null });
            setShowCreateVlogForm(true);
        }
    };

    const handleUpdateVlog = (e: React.FormEvent, publish?: boolean) => {
        e.preventDefault();
        setMyVlogs(
            myVlogs.map((v) =>
                v.id === editingVlogId
                    ? {
                        ...v,
                        title: newVlog.title,
                        description: newVlog.description,
                        videoUrl: newVlog.videoFile ? URL.createObjectURL(newVlog.videoFile) : v.videoUrl,
                        thumbnail: newVlog.thumbnailFile ? URL.createObjectURL(newVlog.thumbnailFile) : v.thumbnail,
                        published: publish !== undefined ? publish : v.published,
                    }
                    : v
            )
        );

        if (selectedVlog?.id === editingVlogId) {
            setSelectedVlog(prev => prev ? {
                ...prev,
                title: newVlog.title,
                description: newVlog.description,
                videoUrl: newVlog.videoFile ? URL.createObjectURL(newVlog.videoFile) : prev.videoUrl,
                thumbnail: newVlog.thumbnailFile ? URL.createObjectURL(newVlog.thumbnailFile) : prev.thumbnail,
                published: publish !== undefined ? publish : prev.published,
            } : null);
        }

        setEditingVlogId(null);
        setNewVlog({ title: '', description: '', videoFile: null, thumbnailFile: null });
        setShowCreateVlogForm(false);
    };

    const handleToggleVlogPublish = (id: number) => {
        setMyVlogs(myVlogs.map(vlog =>
            vlog.id === id
                ? { ...vlog, published: !vlog.published }
                : vlog
        ));

        if (selectedVlog?.id === id) {
            setSelectedVlog(prev => prev ? {
                ...prev,
                published: !prev.published
            } : null);
        }
    };

    const handleLikeVlog = (id: number) => {
        setMyVlogs(myVlogs.map(vlog =>
            vlog.id === id
                ? {
                    ...vlog,
                    likes: vlog.liked ? vlog.likes - 1 : vlog.likes + 1,
                    liked: !vlog.liked
                }
                : vlog
        ));

        if (selectedVlog?.id === id) {
            setSelectedVlog(prev => prev ? {
                ...prev,
                likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
                liked: !prev.liked
            } : null);
        }
    };

    const handleAddVlogComment = (vlogId: number) => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            user: 'You',
            text: newComment,
            date: new Date().toISOString().split('T')[0]
        };

        setMyVlogs(myVlogs.map(vlog =>
            vlog.id === vlogId
                ? { ...vlog, comments: [...vlog.comments, comment] }
                : vlog
        ));

        if (selectedVlog?.id === vlogId) {
            setSelectedVlog(prev => prev ? {
                ...prev,
                comments: [...prev.comments, comment]
            } : null);
        }

        setNewComment('');
    };

    const handleDeleteVlogComment = (vlogId: number, commentId: number) => {
        setMyVlogs(myVlogs.map(vlog =>
            vlog.id === vlogId
                ? { ...vlog, comments: vlog.comments.filter(c => c.id !== commentId) }
                : vlog
        ));

        if (selectedVlog?.id === vlogId) {
            setSelectedVlog(prev => prev ? {
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
            <h2>Astronomy Blogs</h2>
            <p>Discover the latest insights and discoveries in the field of astronomy.</p>

            {/* Blog Filters (only show if Explore Blogs tab is active) */}
            {activeTab === 'blogs' && (
                <>
                    <div className="page-title" style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                        <h2 style={{ textAlign: 'center', margin: 0 }}>Explore Blogs</h2>
                    </div>
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
                            {[5, 4, 3, 2, 1].map(r => (
                                <option key={r} value={r}>{r}+</option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {/* Blog List (only show if Explore Blogs tab is active) */}
            {activeTab === 'blogs' && (
                <div
                    className="blogexplore-blog-list"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1.5rem',

                    }}
                >
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
            <div className="blogs-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
                <h2 style={{ margin: 0, flex: 'none' }}>My Astronomy Blogs</h2>
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
                                    label="Blog Title"
                                    id="blog-title"
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
                                {selectedBlog.published ? (
                                    <>
                                        <span><Eye size={16} /> {selectedBlog.reach} views</span>
                                        <span><Heart size={16} /> {selectedBlog.likes} likes</span>
                                        <span><MessageCircle size={16} /> {selectedBlog.comments.length} comments</span>
                                    </>
                                ) : (
                                    <span style={{ fontStyle: 'italic', color: '#6b7280' }}>Draft - Stats not available</span>
                                )}
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

                                >
                                    <Edit2 size={16} />
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => handleTogglePublish(selectedBlog.id)}

                                >
                                    {selectedBlog.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                    {selectedBlog.published ? 'Unpublish' : 'Publish'}
                                </Button>
                                <Button
                                    onClick={() => handleLike(selectedBlog.id)}
                                // variant={selectedBlog.liked ? 'secondary' : 'outline'}
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

    // Render Vlogs Tab (New)
    const renderVlogsTab = () => {
        // For 'Explore Vlogs', we'll show all vlogs, including the current user's
        // If you had a global 'allVlogs' data source, you'd use that here.
        // For now, we'll just use `myVlogs` as the source for simplicity.
        const allVlogsForExplore = [...myVlogs].filter(v => v.published); // Only show published vlogs in explore
        const filteredExploreVlogs = allVlogsForExplore.filter(vlog => {
            if (vlogFilter.author && vlog.author !== vlogFilter.author) return false;
            if (vlogFilter.search && !vlog.title.toLowerCase().includes(vlogFilter.search.toLowerCase()) && !vlog.description.toLowerCase().includes(vlogFilter.search.toLowerCase())) return false;
            return true;
        });
        const uniqueExploreVlogAuthors = Array.from(new Set(allVlogsForExplore.map(v => v.author)));

        return (
            <div className="blog-explore-page"> {/* Reusing styling */}
                <h2>Astronomy Vlogs</h2>
                <p>Watch the latest astronomical discoveries and insights.</p>

                {activeTab === 'vlogs' && (
                    <>
                        <div className="page-title" style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                            <h2 style={{ textAlign: 'center', margin: 0 }}>Explore Vlogs</h2>
                        </div>
                        <div className="blog-filters" style={{ display: 'flex', gap: 16, margin: '1.2rem 0', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Search title or description..."
                                value={vlogFilter.search}
                                onChange={e => setVlogFilter(f => ({ ...f, search: e.target.value }))}
                                style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 180 }}
                            />
                            <select
                                value={vlogFilter.author}
                                onChange={e => setVlogFilter(f => ({ ...f, author: e.target.value }))}
                                style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 140 }}
                            >
                                <option value="">All Authors</option>
                                {uniqueExploreVlogAuthors.map(author => (
                                    <option key={author} value={author}>{author}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {activeTab === 'vlogs' && (
                    <div
                        className="blogexplore-blog-list"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1.5rem',
                        }}
                    >
                        {filteredExploreVlogs.map(vlog => (
                            <AstronomyBlogCard // Reusing AstronomyBlogCard, but ideally you'd have AstronomyVlogCard
                                key={vlog.id}
                                image={vlog.thumbnail} // Use thumbnail for card image
                                title={vlog.title}
                                author={vlog.author}
                                createdAt={vlog.createdAt}
                                rating={0} // Vlogs might not have ratings in the same way, or you'd add a rating to Vlog type
                                content={vlog.description}
                                onClick={() => setSelectedVlog(vlog)} // Open vlog modal directly
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Render My Vlogs Tab (New)
    const renderMyVlogsTab = () => (
        <div className="blog-explore-page">
            <div className="blogs-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
                <h2 style={{ margin: 0, flex: 'none' }}>My Astronomy Vlogs</h2>
                <Button onClick={() => setShowCreateVlogForm(true)} className="create-blog-btn">
                    <Plus size={20} />
                    Create New Vlog
                </Button>
            </div>

            {/* My Vlog Filters */}
            <div className="blog-filters" style={{ display: 'flex', gap: 16, margin: '1.2rem 0', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search your vlogs..."
                    value={vlogFilter.search}
                    onChange={e => setVlogFilter(f => ({ ...f, search: e.target.value }))}
                    style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 180 }}
                />
                <select
                    value={vlogFilter.status}
                    onChange={e => setVlogFilter(f => ({ ...f, status: e.target.value }))}
                    style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #334155', minWidth: 140 }}
                >
                    <option value="all">All Vlogs</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                </select>
            </div>

            {showCreateVlogForm && (
                <div className="blog-form-overlay">
                    <div className="blog-form">
                        <div className="form-header">
                            <h2>{editingVlogId ? 'Edit Vlog' : 'Create New Vlog'}</h2>
                            <Button
                                onClick={() => {
                                    setShowCreateVlogForm(false);
                                    setEditingVlogId(null);
                                    setNewVlog({ title: '', description: '', videoFile: null, thumbnailFile: null });
                                }}
                            >
                                <X size={20} />
                            </Button>
                        </div>

                        <form onSubmit={handleSaveVlogAsDraft}>
                            <div className="form-group">
                                <label>Vlog Title</label>
                                <InputField
                                    label="Vlog Title"
                                    id="vlog-title"
                                    type="text"
                                    name="title"
                                    placeholder="Enter your vlog title..."
                                    value={newVlog.title}
                                    onChange={handleVlogInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Describe your astronomical video..."
                                    value={newVlog.description}
                                    onChange={handleVlogInputChange}
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
                                <label>Upload Video</label>
                                <input
                                    type="file"
                                    name="videoFile"
                                    accept="video/*"
                                    onChange={handleVlogInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        border: '1px solid #334155'
                                    }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Video Thumbnail (Optional)</label>
                                <input
                                    type="file"
                                    name="thumbnailFile"
                                    accept="image/*"
                                    onChange={handleVlogInputChange}
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
                                    onClick={handlePublishVlog}
                                >
                                    <Eye size={16} />
                                    {editingVlogId ? 'Update & Publish' : 'Publish Vlog'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="blogexplore-blog-list">
                {filteredMyVlogs.map(vlog => (
                    <MyVlogCard
                        key={vlog.id}
                        vlog={vlog}
                        onEdit={handleEditVlog}
                        onDelete={handleDeleteVlog}
                        onTogglePublish={handleToggleVlogPublish}
                        onView={setSelectedVlog}
                    />
                ))}
            </div>

            {filteredMyVlogs.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🎥</div> {/* Video icon */}
                    <h3>
                        {vlogFilter.status === 'published' ? 'No published vlogs yet' :
                            vlogFilter.status === 'draft' ? 'No drafts yet' :
                                vlogFilter.search ? 'No vlogs found' : 'No vlogs yet'}
                    </h3>
                    <p>
                        {vlogFilter.search ? 'Try adjusting your search terms.' :
                            'Start sharing your astronomical videos with the world!'}
                    </p>
                    {!vlogFilter.search && (
                        <Button onClick={() => setShowCreateVlogForm(true)}>
                            Create Your First Vlog
                        </Button>
                    )}
                </div>
            )}

            {selectedVlog && (
                <div className="blog-modal-overlay">
                    <div className="blog-modal">
                        <div className="modal-header">
                            <h2>{selectedVlog.title}</h2>
                            <Button onClick={() => setSelectedVlog(null)}>
                                <X size={20} />
                            </Button>
                        </div>

                        <div className="modal-content">
                            {selectedVlog.videoUrl && (
                                <video controls src={selectedVlog.videoUrl} className="modal-image" style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                            )}

                            <div className="modal-meta">
                                <span className="author">By {selectedVlog.author}</span>
                                <span className="date">{selectedVlog.date}</span>
                                <span className={`status ${selectedVlog.published ? 'published' : 'draft'}`}>
                                    {selectedVlog.published ? 'Published' : 'Draft'}
                                </span>
                            </div>

                            <div className="modal-stats">
                                {selectedVlog.published ? (
                                    <>
                                        <span><Eye size={16} /> {selectedVlog.views} views</span>
                                        <span><Heart size={16} /> {selectedVlog.likes} likes</span>
                                        <span><MessageCircle size={16} /> {selectedVlog.comments.length} comments</span>
                                    </>
                                ) : (
                                    <span style={{ fontStyle: 'italic', color: '#6b7280' }}>Draft - Stats not available</span>
                                )}
                            </div>

                            <div className="modal-text">
                                <p>{selectedVlog.description}</p>
                            </div>

                            <div className="modal-actions" style={{ display: 'flex', gap: '1rem', margin: '1rem 0', flexWrap: 'wrap' }}>
                                <Button
                                    onClick={() => {
                                        setSelectedVlog(null);
                                        handleEditVlog(selectedVlog.id);
                                    }}

                                >
                                    <Edit2 size={16} />
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => handleToggleVlogPublish(selectedVlog.id)}

                                >
                                    {selectedVlog.published ? <EyeOff size={16} /> : <Eye size={16} />}
                                    {selectedVlog.published ? 'Unpublish' : 'Publish'}
                                </Button>
                                <Button
                                    onClick={() => handleLikeVlog(selectedVlog.id)}
                                >
                                    <Heart size={16} fill={selectedVlog.liked ? 'currentColor' : 'none'} />
                                    {selectedVlog.liked ? 'Liked' : 'Like'}
                                </Button>
                                {selectedVlog.videoUrl && (
                                    <a href={selectedVlog.videoUrl} download={`${selectedVlog.title}.mp4`} style={{ textDecoration: 'none' }}>
                                        <Button>
                                            <Download size={16} />
                                            Download
                                        </Button>
                                    </a>
                                )}
                            </div>

                            <div className="comments-section">
                                <h3>Comments ({selectedVlog.comments.length})</h3>

                                <div className="add-comment">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddVlogComment(selectedVlog.id)}
                                    />
                                    <Button onClick={() => handleAddVlogComment(selectedVlog.id)}>
                                        <Send size={16} />
                                    </Button>
                                </div>

                                <div className="comments-list">
                                    {selectedVlog.comments.map((comment) => (
                                        <div key={comment.id} className="comment">
                                            <div className="comment-header">
                                                <span className="comment-author">{comment.user}</span>
                                                <span className="comment-timestamp">{comment.date}</span>
                                                {comment.user === 'You' && (
                                                    <Button
                                                        onClick={() => handleDeleteVlogComment(selectedVlog.id, comment.id)}
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
            {/* Tab Navigation (NightCamps style, center aligned) */}
            <div
                className="myblogs__navigation"
                style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    margin: '1.2rem 0'
                }}
            >
                <Button
                    variant={activeTab === 'blogs' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('blogs')}
                >
                    Explore Blogs
                </Button>
                <Button
                    variant={activeTab === 'myblogs' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('myblogs')}
                >
                    My Blogs ({myBlogs.length})
                </Button>
                <Button
                    variant={activeTab === 'vlogs' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('vlogs')}
                >
                    Explore Vlogs
                </Button>
                <Button
                    variant={activeTab === 'myvlogs' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('myvlogs')}
                >
                    My Vlogs ({myVlogs.length})
                </Button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'blogs' && renderBlogsTab()}
                {activeTab === 'myblogs' && renderMyBlogsTab()}
                {activeTab === 'vlogs' && renderVlogsTab()}
                {activeTab === 'myvlogs' && renderMyVlogsTab()}
            </div>
        </div>
    );
};
