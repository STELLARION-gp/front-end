import React, { useState, useEffect, useContext } from 'react';
import { Star, MessageCircle, Heart, Plus, Save, X, Send, BookOpen, Users, Calendar } from 'lucide-react';
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaHeart, FaComment } from 'react-icons/fa';
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
import { FirebaseStorageService } from '../../services/firebaseStorage';

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
    featured_image?: string; // Backend field
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
    return (
        <div className={`myblog-card ${!blog.published ? 'myblog-card--draft' : 'myblog-card--published'}`}>
            <div className="myblog-card__image-container">
                {blog.image ? (
                    <img src={blog.image} alt={blog.title} className="myblog-card__image" />
                ) : (
                    <div className="myblog-card__image-placeholder">
                        <BookOpen size={48} />
                    </div>
                )}
                
                <div className="myblog-card__status-badge">
                    {blog.published ? (
                        <span className="myblog-card__badge myblog-card__badge--published">Published</span>
                    ) : (
                        <span className="myblog-card__badge myblog-card__badge--draft">Draft</span>
                    )}
                </div>

                <div className="myblog-card__actions-overlay">
                    <button 
                        className="myblog-card__action-btn myblog-card__action-btn--edit"
                        onClick={() => onEdit(blog.id)}
                        title="Edit"
                    >
                        ✏️
                    </button>
                    <button 
                        className="myblog-card__action-btn myblog-card__action-btn--delete"
                        onClick={() => onDelete(blog.id)}
                        title="Delete"
                    >
                        🗑️
                    </button>
                    <button 
                        className="myblog-card__action-btn myblog-card__action-btn--publish"
                        onClick={() => onTogglePublish(blog.id)}
                        title={blog.published ? "Unpublish" : "Publish"}
                    >
                        {blog.published ? '🙈' : '👁️'}
                    </button>
                </div>
            </div>

            <div className="myblog-card__content">
                <h3 className="myblog-card__title" onClick={() => onView(blog)}>
                    {blog.title}
                </h3>

                <div className="myblog-card__meta">
                    <div className="myblog-card__meta-item">
                        <Users size={14} />
                        <span>{blog.author}</span>
                    </div>
                    <div className="myblog-card__meta-item">
                        <Calendar size={14} />
                        <span>{new Date(blog.createdAt || blog.created_at || blog.date || new Date()).toLocaleDateString()}</span>
                    </div>
                </div>

                <p className="myblog-card__excerpt">
                    {blog.content.length > 120 
                        ? `${blog.content.substring(0, 120)}...` 
                        : blog.content
                    }
                </p>

                <div className="myblog-card__stats">
                    <div className="myblog-card__stat-item">
                        <FaEye size={16} />
                        <span>{blog.reach || blog.view_count || 0}</span>
                    </div>
                    <div className="myblog-card__stat-item">
                        <FaHeart size={16} />
                        <span>{blog.likes || blog.like_count || 0}</span>
                    </div>
                    <div className="myblog-card__stat-item" title={`${blog.comment_count || 0} comment${(blog.comment_count || 0) !== 1 ? 's' : ''}`}>
                        <FaComment size={16} />
                        <span>{blog.comment_count || 0}</span>
                    </div>
                </div>

                <div className="myblog-card__actions-bottom">
                    <Button
                        className="myblog-card__see-more-btn"
                        onClick={() => onView(blog)}
                    >
                        See More
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default function MyBlogs() {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<ActiveSection>('myblogs');
    const [myBlogs, setMyBlogs] = useState<Blog[]>([]);
    const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
    const [newBlog, setNewBlog] = useState<{ title: string; content: string; image: File | null }>({ title: '', content: '', image: null });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [exploreLoading, setExploreLoading] = useState(false);

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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (currentUser) {
            loadMyBlogs();
            loadAllBlogs(); // Load all blogs for explore tab
            // Test Firebase Storage configuration
            testFirebaseStorage();
        }
    }, [currentUser]);

    const testFirebaseStorage = async () => {
        try {
            const config = await FirebaseStorageService.checkConfiguration();
            if (!config.isConfigured) {
                console.error('Firebase Storage configuration issues:', config.errors);
                setError(`Firebase Storage setup issues: ${config.errors.join(', ')}`);
            } else {
                console.log('✅ Firebase Storage is properly configured');
            }
        } catch (err) {
            console.error('Firebase Storage test failed:', err);
        }
    };

    const loadMyBlogs = async () => {
        if (!currentUser) return;
        
        setLoading(true);
        setError(null);
        
        try {
            console.log('Loading blogs for user:', currentUser.uid, 'Display name:', currentUserName);
            
            // Try to get user's blogs from the API
            try {
                // First get all blogs since we need to filter by user
                const response = await blogService.getBlogs({
                    status: undefined, // Get both published and draft
                    limit: 50 // Get more blogs to filter through
                });
                
                console.log('API response:', response);
                
                if (response.success && response.data && response.data.blogs) {
                    console.log('All blogs from API:', response.data.blogs);
                    
                    // Filter blogs by current user (using multiple criteria)
                    const userBlogs = response.data.blogs.filter((blog: any) => {
                        const matchesAuthorName = blog.author_name && 
                                                 (blog.author_name.toLowerCase().includes(currentUserName.toLowerCase()) ||
                                                  currentUserName.toLowerCase().includes(blog.author_name.toLowerCase()));
                        const matchesDisplayName = blog.author_display_name === currentUserName;
                        const matchesEmail = blog.author_email === currentUser.email;
                        
                        console.log('Blog filter check:', {
                            blogId: blog.id,
                            blogTitle: blog.title,
                            blogAuthor: blog.author_name,
                            blogDisplayName: blog.author_display_name,
                            blogEmail: blog.author_email,
                            currentUserName,
                            currentUserEmail: currentUser.email,
                            matchesAuthorName,
                            matchesDisplayName,
                            matchesEmail
                        });
                        
                        return matchesAuthorName || matchesDisplayName || matchesEmail;
                    });
                    
                    console.log('Filtered user blogs:', userBlogs);
                    
                    if (userBlogs.length > 0) {
                        // Convert API response to component format
                        const convertedBlogs: Blog[] = userBlogs.map((blog: any) => ({
                            ...blog,
                            // Use featured_image as the primary field
                            image: blog.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                            image_url: blog.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                            featured_image: blog.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                            author: blog.author_display_name || blog.author_name || currentUserName,
                            date: blog.created_at,
                            reach: blog.view_count || blog.views_count || 0,
                            likes: blog.like_count || blog.likes_count || 0,
                            rating: 0,
                            comments: [], // Comments will be loaded separately when needed
                            comment_count: blog.comment_count || 0, // Use backend comment count
                            liked: blog.user_liked || false,
                            published: blog.status === 'published',
                            createdAt: blog.created_at
                        }));
                        
                        setMyBlogs(convertedBlogs);
                        console.log('Set user blogs from API:', convertedBlogs);
                        return;
                    } else {
                        console.log('No user blogs found in API response, will create sample blogs...');
                    }
                } else {
                    console.log('API response not successful or no data:', response);
                }
            } catch (apiError: any) {
                console.log('API call failed:', apiError);
                setError(`API Error: ${apiError.message}. Using sample data.`);
            }
            
            // Fallback to demo data with automatic sample blog creation for current user
            console.log('Creating sample blogs for user:', currentUserName);
            
            // Find existing demo blogs for current user
            const existingUserBlogs = blogs.filter(blog => blog.author === currentUserName);
            console.log('Found existing demo blogs:', existingUserBlogs);
            
            // Create sample blogs for the current user (always create some for demo)
            // const sampleBlogs = [
            //     {
            //         id: Date.now() + 1,
            //         title: "Welcome to Your Astronomy Blog",
            //         content: "Welcome to your personal astronomy blog dashboard! Here you can create, edit, and manage your cosmic discoveries and insights. This is a sample blog created automatically for you. Feel free to edit or delete it and create your own amazing content about the universe!",
            //         image: FirebaseStorageService.DEFAULT_BLOG_IMAGE,
            //         author: currentUserName,
            //         createdAt: new Date().toISOString(),
            //         rating: 4.5,
            //         reach: 125,
            //         likes: 23,
            //         comments: [], // Will be loaded from backend
            //         liked: false
            //     },
            //     {
            //         id: Date.now() + 2,
            //         title: "Getting Started with Stargazing",
            //         content: "Stargazing is one of the most rewarding hobbies you can pursue. All you need is a clear night sky and curiosity about the cosmos. Start by identifying bright stars and constellations, then gradually work your way up to planets, star clusters, and nebulae. This sample post shows how your blogs might look!",
            //         image: FirebaseStorageService.DEFAULT_BLOG_IMAGE,
            //         author: currentUserName,
            //         createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            //         rating: 4.8,
            //         reach: 89,
            //         likes: 34,
            //         comments: [], // Will be loaded from backend
            //         liked: false
            //     }
            // ];
            
            // Use existing blogs if any, otherwise use sample blogs
            const userDemoBlogs: any[] = existingUserBlogs.length > 0 ? existingUserBlogs : [];

            const convertedBlogs: Blog[] = userDemoBlogs.map(blog => ({
                ...blog,
                author_id: 0,
                status: Math.random() > 0.5 ? 'published' : 'draft' as const,
                view_count: (blog as any).reach || Math.floor(Math.random() * 1000) + 100,
                like_count: (blog as any).likes || Math.floor(Math.random() * 50) + 10,
                comment_count: 0, // Will be loaded from backend when comments are fetched
                tags: [],
                created_at: blog.createdAt || new Date().toISOString(),
                updated_at: blog.createdAt || new Date().toISOString(),
                date: blog.createdAt,
                reach: (blog as any).reach || Math.floor(Math.random() * 1000) + 100,
                likes: (blog as any).likes || Math.floor(Math.random() * 50) + 10,
                comments: [], // Will be loaded from backend when needed
                liked: (blog as any).liked || false,
                published: Math.random() > 0.5,
                // Ensure featured_image and image_url are set
                featured_image: blog.image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                image_url: blog.image || FirebaseStorageService.DEFAULT_BLOG_IMAGE
            }));
            
            setMyBlogs(convertedBlogs);
            console.log('Set demo blogs for user:', convertedBlogs);
            
        } catch (err: any) {
            console.error('Error loading blogs:', err);
            setError('Failed to load blogs. Please try again.');
            
            // Last resort fallback - create at least one blog for the user
            const fallbackBlog: Blog = {
                id: Date.now(),
                title: "Welcome to Your Blog Dashboard",
                content: "This is your blog dashboard where you can create, edit, and manage your astronomy blogs. Start by creating your first blog post to share your cosmic discoveries with the world!",
                author_id: 0,
                status: 'draft',
                view_count: 0,
                like_count: 0,
                comment_count: 0,
                tags: [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                author: currentUserName,
                date: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                reach: 0,
                likes: 0,
                rating: 0,
                comments: [],
                liked: false,
                published: false,
                image: FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                featured_image: FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                image_url: FirebaseStorageService.DEFAULT_BLOG_IMAGE
            };
            
            setMyBlogs([fallbackBlog]);
        } finally {
            setLoading(false);
        }
    };

    // Load all blogs for the explore tab
    const loadAllBlogs = async () => {
        setExploreLoading(true);
        try {
            console.log('Loading all blogs for explore tab...');
            
            const response = await blogService.getBlogs({
                status: 'published', // Only show published blogs in explore
                limit: 50 // Get more blogs for explore
            });
            
            console.log('All blogs API response:', response);
            
            if (response.success && response.data && response.data.blogs) {
                // Convert API response to component format
                const convertedBlogs: Blog[] = response.data.blogs.map((blog: any) => ({
                    ...blog,
                    // Use featured_image as the primary field
                    image: blog.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                    image_url: blog.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                    featured_image: blog.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                    author: blog.author_display_name || blog.author_name || 'Unknown Author',
                    date: blog.created_at,
                    reach: blog.view_count || blog.views_count || 0,
                    likes: blog.like_count || blog.likes_count || 0,
                    rating: Math.random() * 2 + 3, // Random rating between 3-5 for demo
                    comments: [], // Comments will be loaded separately when needed
                    comment_count: blog.comment_count || 0,
                    liked: blog.user_liked || false,
                    published: blog.status === 'published',
                    createdAt: blog.created_at
                }));
                
                setAllBlogs(convertedBlogs);
                console.log('Set all blogs from API:', convertedBlogs);
            } else {
                console.log('API response not successful or no data, using fallback blogs');
                // Fallback to static data if API fails - filter only published blogs
                const publishedBlogs = blogs.filter(blog => (blog as any).published !== false);
                setAllBlogs(publishedBlogs.map(blog => ({
                    ...blog,
                    id: blog.id,
                    title: blog.title,
                    content: blog.content,
                    author_id: 0,
                    status: 'published' as const,
                    view_count: (blog as any).reach || 0,
                    like_count: (blog as any).likes || 0,
                    comment_count: 0,
                    tags: [],
                    created_at: blog.createdAt || new Date().toISOString(),
                    updated_at: blog.createdAt || new Date().toISOString(),
                    date: blog.createdAt,
                    reach: (blog as any).reach || 0,
                    likes: (blog as any).likes || 0,
                    comments: [],
                    liked: false,
                    published: true,
                    featured_image: blog.image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                    image_url: blog.image || FirebaseStorageService.DEFAULT_BLOG_IMAGE
                })));
            }
        } catch (err: any) {
            console.error('Error loading all blogs:', err);
            // Fallback to static data - filter only published blogs
            const publishedBlogs = blogs.filter(blog => (blog as any).published !== false);
            setAllBlogs(publishedBlogs.map(blog => ({
                ...blog,
                id: blog.id,
                title: blog.title,
                content: blog.content,
                author_id: 0,
                status: 'published' as const,
                view_count: (blog as any).reach || 0,
                like_count: (blog as any).likes || 0,
                comment_count: 0,
                tags: [],
                created_at: blog.createdAt || new Date().toISOString(),
                updated_at: blog.createdAt || new Date().toISOString(),
                date: blog.createdAt,
                reach: (blog as any).reach || 0,
                likes: (blog as any).likes || 0,
                comments: [],
                liked: false,
                published: true,
                featured_image: blog.image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                image_url: blog.image || FirebaseStorageService.DEFAULT_BLOG_IMAGE
            })));
        } finally {
            setExploreLoading(false);
        }
    };

    // Load comments for a specific blog from the backend
    const loadBlogComments = async (blogId: number) => {
        setCommentsLoading(true);
        try {
            const response = await blogService.getBlogComments(blogId);
            
            if (response.success && response.data) {
                // Convert backend comment format to frontend format
                const backendComments = response.data.comments || [];
                const convertedComments: Comment[] = backendComments.map((comment: any) => ({
                    id: comment.id,
                    user: comment.user_display_name || comment.user_name || 'Unknown User',
                    text: comment.content,
                    date: new Date(comment.created_at).toLocaleDateString()
                }));

                // Update the blog with loaded comments and accurate comment count
                const actualCommentCount = response.data.total || convertedComments.length;
                
                setMyBlogs(prevBlogs => 
                    prevBlogs.map(blog => 
                        blog.id === blogId 
                            ? { 
                                ...blog, 
                                comments: convertedComments,
                                comment_count: actualCommentCount
                            }
                            : blog
                    )
                );

                // Update selected blog if it's the one we're loading comments for
                setSelectedBlog(prev => 
                    prev && prev.id === blogId 
                        ? { 
                            ...prev, 
                            comments: convertedComments,
                            comment_count: actualCommentCount
                        }
                        : prev
                );

                console.log('Loaded comments for blog', blogId, ':', convertedComments);
                console.log('Comment count for blog', blogId, ':', actualCommentCount);
            } else {
                console.log('No comments found for blog', blogId);
                // Set empty comments and zero count
                setMyBlogs(prevBlogs => 
                    prevBlogs.map(blog => 
                        blog.id === blogId 
                            ? { 
                                ...blog, 
                                comments: [],
                                comment_count: 0
                            }
                            : blog
                    )
                );
                
                setSelectedBlog(prev => 
                    prev && prev.id === blogId 
                        ? { 
                            ...prev, 
                            comments: [],
                            comment_count: 0
                        }
                        : prev
                );
            }
        } catch (err: any) {
            console.error('Error loading comments for blog', blogId, ':', err);
            // Don't show error to user for comment loading failures, but set empty state
            setMyBlogs(prevBlogs => 
                prevBlogs.map(blog => 
                    blog.id === blogId 
                        ? { 
                            ...blog, 
                            comments: [],
                            comment_count: 0
                        }
                        : blog
                )
            );
            
            setSelectedBlog(prev => 
                prev && prev.id === blogId 
                    ? { 
                        ...prev, 
                        comments: [],
                        comment_count: 0
                    }
                    : prev
            );
        } finally {
            setCommentsLoading(false);
        }
    };

    const filteredBlogs = blogs.filter(blog => {
        if (filter.author && blog.author !== filter.author) return false;
        if (filter.minRating && blog.rating < Number(filter.minRating)) return false;
        if (filter.search && !blog.title.toLowerCase().includes(filter.search.toLowerCase()) && !blog.content.toLowerCase().includes(filter.search.toLowerCase())) return false;
        return true;
    });

    const filteredAllBlogs = allBlogs.filter(blog => {
        if (filter.author && blog.author !== filter.author) return false;
        if (filter.minRating && blog.rating && blog.rating < Number(filter.minRating)) return false;
        if (filter.search && !blog.title.toLowerCase().includes(filter.search.toLowerCase()) && !blog.content.toLowerCase().includes(filter.search.toLowerCase())) return false;
        return true;
    });

    const filteredMyBlogs = myBlogs.filter(blog => {
        if (filter.status === 'published' && !blog.published) return false;
        if (filter.status === 'draft' && blog.published) return false;
        if (filter.search && !blog.title.toLowerCase().includes(filter.search.toLowerCase()) && !blog.content.toLowerCase().includes(filter.search.toLowerCase())) return false;
        return true;
    });

    const uniqueAuthors = Array.from(new Set([...blogs.map(b => b.author), ...allBlogs.map(b => b.author || 'Unknown')]));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const files = (e.target as HTMLInputElement).files;
        
        if (name === 'image' && files && files[0]) {
            const file = files[0];
            setNewBlog((prev) => ({
                ...prev,
                image: file,
            }));
            
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setNewBlog((prev) => ({
                ...prev,
                [name]: files ? files[0] : value,
            }));
        }
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
        let imageUrl: string = FirebaseStorageService.DEFAULT_BLOG_IMAGE;

        try {
            // Upload image if provided, otherwise use default
            if (newBlog.image) {
                setImageUploading(true);
                // Don't pass blogId during creation since it doesn't exist yet
                imageUrl = await FirebaseStorageService.uploadBlogImage(newBlog.image);
                setImageUploading(false);
            }

            const blogData: CreateBlogRequest = {
                title: newBlog.title,
                content: newBlog.content,
                status: 'draft',
                featured_image: imageUrl,
                tags: [],
                metadata: {}
            };

            const response = await blogService.createBlog(blogData);
            
            if (response.success) {
                // Convert API response to component format
                const newBlogPost: Blog = {
                    ...response.data,
                    // Use featured_image as the primary field
                    image: response.data.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                    image_url: response.data.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                    featured_image: response.data.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                    author: currentUserName,
                    date: response.data.created_at,
                    reach: response.data.view_count || response.data.views_count || 0,
                    likes: response.data.like_count || response.data.likes_count || 0,
                    rating: 0,
                    comments: [], // Comments will be loaded when needed
                    comment_count: response.data.comment_count || 0, // Use backend comment count
                    liked: false,
                    published: response.data.status === 'published',
                    createdAt: response.data.created_at
                };
                
                setMyBlogs([newBlogPost, ...myBlogs]);
                setNewBlog({ title: '', content: '', image: null });
                setImagePreview(null);
                setShowCreateForm(false);
                setError(null);
                setSuccessMessage('Blog created as draft successfully!');
                setTimeout(() => setSuccessMessage(null), 3000);
            } else {
                throw new Error('Failed to create blog');
            }
        } catch (err: any) {
            console.error('Error creating blog:', err);
            setError('Failed to create blog. Please try again.');
            
            // Clean up uploaded image if blog creation failed
            if (newBlog.image && imageUrl && imageUrl !== FirebaseStorageService.DEFAULT_BLOG_IMAGE) {
                try {
                    await FirebaseStorageService.deleteImage(imageUrl);
                } catch (deleteErr) {
                    console.error('Error cleaning up image:', deleteErr);
                }
            }
            
            // Fallback to local creation for demo
            const newId = myBlogs.length ? Math.max(...myBlogs.map(b => b.id)) + 1 : 1000;
            const currentDate = new Date().toISOString();
            const fallbackImageUrl = newBlog.image ? URL.createObjectURL(newBlog.image) : FirebaseStorageService.DEFAULT_BLOG_IMAGE;
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
                image: fallbackImageUrl,
                image_url: fallbackImageUrl,
                featured_image: fallbackImageUrl,
            };
            
            setMyBlogs([newBlogPost, ...myBlogs]);
            setNewBlog({ title: '', content: '', image: null });
            setImagePreview(null);
            setShowCreateForm(false);
        } finally {
            setLoading(false);
            setImageUploading(false);
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
            // When editing, call update with publish=true
            await handleUpdateBlog(e, true);
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
            let imageUrl: string = FirebaseStorageService.DEFAULT_BLOG_IMAGE;

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

                // Upload image if provided, otherwise use default
                if (newBlog.image) {
                    setImageUploading(true);
                    // Don't pass blogId during creation since it doesn't exist yet
                    imageUrl = await FirebaseStorageService.uploadBlogImage(newBlog.image);
                    setImageUploading(false);
                }

                // Enable API call for blog creation
                const blogData: CreateBlogRequest = {
                    title: newBlog.title,
                    content: newBlog.content,
                    status: 'published',
                    featured_image: imageUrl,
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
                        // Use featured_image as the primary field
                        image: response.data.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                        image_url: response.data.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                        featured_image: response.data.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                        author: currentUserName,
                        date: response.data.created_at,
                        reach: response.data.view_count || response.data.views_count || 0,
                        likes: response.data.like_count || response.data.likes_count || 0,
                        rating: 0,
                        comments: [], // Comments will be loaded when needed
                        comment_count: response.data.comment_count || 0, // Use backend comment count
                        liked: false,
                        published: response.data.status === 'published',
                        createdAt: response.data.created_at
                    };
                    
                    setMyBlogs([newBlogPost, ...myBlogs]);
                    setNewBlog({ title: '', content: '', image: null });
                    setImagePreview(null);
                    setShowCreateForm(false);
                    setError(null);
                    setSuccessMessage('Blog published successfully!');
                    setTimeout(() => setSuccessMessage(null), 3000);
                } else {
                    throw new Error('Failed to create blog');
                }
            } catch (err: any) {
                console.error('Error publishing blog:', err);
                setError(`Failed to publish blog: ${err.message}`);
                
                // Clean up uploaded image if blog creation failed
                if (newBlog.image && imageUrl !== FirebaseStorageService.DEFAULT_BLOG_IMAGE) {
                    try {
                        await FirebaseStorageService.deleteImage(imageUrl);
                    } catch (deleteErr) {
                        console.error('Error cleaning up image:', deleteErr);
                    }
                }
                
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
                    image: newBlog.image ? URL.createObjectURL(newBlog.image) : FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                    image_url: newBlog.image ? URL.createObjectURL(newBlog.image) : FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                    featured_image: newBlog.image ? URL.createObjectURL(newBlog.image) : FirebaseStorageService.DEFAULT_BLOG_IMAGE,
                };
                setMyBlogs([newBlogPost, ...myBlogs]);
                setNewBlog({ title: '', content: '', image: null });
                setImagePreview(null);
                setShowCreateForm(false);
                
                // Clear error after successful fallback
                setTimeout(() => setError(null), 3000);
            } finally {
                setLoading(false);
                setImageUploading(false);
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
            // Set the current image as preview for editing
            setImagePreview(blog.featured_image || blog.image_url || blog.image || null);
            setShowCreateForm(true);
        }
    };

    const handleUpdateBlog = async (e?: React.FormEvent, publish?: boolean) => {
        if (e) e.preventDefault();
        
        if (!editingId) {
            console.error('No editingId found for update');
            return;
        }
        
        // Validate form inputs
        if (!newBlog.title.trim() || !newBlog.content.trim()) {
            setError('Please fill in both title and content before updating.');
            return;
        }
        
        setLoading(true);
        let imageUrl: string | undefined;
        const existingBlog = myBlogs.find(b => b.id === editingId);
        
        try {
            // Handle image upload/removal logic
            if (newBlog.image) {
                // User selected a new image
                setImageUploading(true);
                imageUrl = await FirebaseStorageService.uploadBlogImage(newBlog.image, editingId.toString());
                setImageUploading(false);
                
                // Delete old image if it exists and it's not the default image
                if (existingBlog?.featured_image && existingBlog.featured_image !== FirebaseStorageService.DEFAULT_BLOG_IMAGE) {
                    try {
                        await FirebaseStorageService.deleteImage(existingBlog.featured_image);
                    } catch (deleteErr) {
                        console.error('Error deleting old image:', deleteErr);
                    }
                }
            } else if (imagePreview === null && existingBlog?.featured_image) {
                // User removed the image (set preview to null), use default
                imageUrl = FirebaseStorageService.DEFAULT_BLOG_IMAGE;
                // Delete old image if it's not the default
                if (existingBlog.featured_image !== FirebaseStorageService.DEFAULT_BLOG_IMAGE) {
                    try {
                        await FirebaseStorageService.deleteImage(existingBlog.featured_image);
                    } catch (deleteErr) {
                        console.error('Error deleting old image:', deleteErr);
                    }
                }
            } else {
                // Keep existing image URL or use default
                imageUrl = existingBlog?.featured_image || FirebaseStorageService.DEFAULT_BLOG_IMAGE;
            }

            const updateData = {
                title: newBlog.title,
                content: newBlog.content,
                status: publish ? 'published' as const : 'draft' as const,
                featured_image: imageUrl
            };

            try {
                await blogService.updateBlog(editingId, updateData);
            } catch (apiErr) {
                console.error('API update failed, continuing with local update:', apiErr);
            }
            
            setMyBlogs(
                myBlogs.map((b) =>
                    b.id === editingId
                        ? {
                                ...b,
                                title: newBlog.title,
                                content: newBlog.content,
                                image: imageUrl,
                                image_url: imageUrl,
                                featured_image: imageUrl,
                                published: publish !== undefined ? publish : b.published,
                                status: publish ? 'published' : 'draft'
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
                    image: imageUrl,
                    image_url: imageUrl,
                    featured_image: imageUrl,
                    published: publish !== undefined ? publish : prev.published,
                    status: publish ? 'published' : 'draft'
                } : null);
            }
            
            // Show success message
            setError(null);
            const successMsg = publish ? 'Blog updated and published successfully!' : 'Blog updated as draft successfully!';
            setSuccessMessage(successMsg);
            console.log(successMsg);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
            
            setEditingId(null);
            setNewBlog({ title: '', content: '', image: null });
            setImagePreview(null);
            setShowCreateForm(false);
        } catch (err: any) {
            console.error('Error updating blog:', err);
            setError('Failed to update blog. Please try again.');
        } finally {
            setLoading(false);
            setImageUploading(false);
        }
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
                date: new Date(response.data.created_at).toLocaleDateString()
            };
            
            // Update the blog with the new comment and increment comment count
            setMyBlogs(myBlogs.map(blog => 
                blog.id === blogId 
                    ? { 
                        ...blog, 
                        comments: [...(blog.comments || []), comment],
                        comment_count: (blog.comment_count || 0) + 1
                    }
                    : blog
            ));
            
            if (selectedBlog?.id === blogId) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    comments: [...(prev.comments || []), comment],
                    comment_count: (prev.comment_count || 0) + 1
                } : null);
            }
            
            setNewComment('');
        } catch (err: any) {
            console.error('Error adding comment:', err);
            // Fallback to local comment for demo purposes
            const comment = {
                id: Date.now(),
                user: 'You',
                text: newComment,
                date: new Date().toLocaleDateString()
            };
            
            setMyBlogs(myBlogs.map(blog => 
                blog.id === blogId 
                    ? { 
                        ...blog, 
                        comments: [...(blog.comments || []), comment],
                        comment_count: (blog.comment_count || 0) + 1
                    }
                    : blog
            ));
            
            if (selectedBlog?.id === blogId) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    comments: [...(prev.comments || []), comment],
                    comment_count: (prev.comment_count || 0) + 1
                } : null);
            }
            
            setNewComment('');
        }
    };

    const handleDeleteComment = async (blogId: number, commentId: number) => {
        try {
            await blogService.deleteBlogComment(blogId, commentId);
            
            // Update the blog by removing the comment and decrementing comment count
            setMyBlogs(myBlogs.map(blog => 
                blog.id === blogId 
                    ? { 
                        ...blog, 
                        comments: (blog.comments || []).filter(c => c.id !== commentId),
                        comment_count: Math.max(0, (blog.comment_count || 0) - 1)
                    }
                    : blog
            ));
            
            if (selectedBlog?.id === blogId) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    comments: (prev.comments || []).filter(c => c.id !== commentId),
                    comment_count: Math.max(0, (prev.comment_count || 0) - 1)
                } : null);
            }
        } catch (err: any) {
            console.error('Error deleting comment:', err);
            // Fallback to local deletion
            setMyBlogs(myBlogs.map(blog => 
                blog.id === blogId 
                    ? { 
                        ...blog, 
                        comments: (blog.comments || []).filter(c => c.id !== commentId),
                        comment_count: Math.max(0, (blog.comment_count || 0) - 1)
                    }
                    : blog
            ));
            
            if (selectedBlog?.id === blogId) {
                setSelectedBlog(prev => prev ? {
                    ...prev,
                    comments: (prev.comments || []).filter(c => c.id !== commentId),
                    comment_count: Math.max(0, (prev.comment_count || 0) - 1)
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
                {exploreLoading && activeTab === 'blogs' ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        Loading blogs...
                    </div>
                ) : (
                    (activeTab === 'blogs' ? filteredAllBlogs : filteredBlogs).map(blog => (
                        <AstronomyBlogCard
                            key={blog.id}
                            image={(blog as any).image || (blog as any).featured_image || (blog as any).image_url || FirebaseStorageService.DEFAULT_BLOG_IMAGE}
                            title={blog.title}
                            author={(blog as any).author || 'Unknown Author'}
                            createdAt={(blog as any).createdAt || (blog as any).date || (blog as any).created_at || new Date().toISOString()}
                            rating={(blog as any).rating || 0}
                            content={blog.content}
                            onClick={() => navigate(`/dashboard/blogs/${blog.id}`)}
                        />
                    ))
                )}
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

            {successMessage && (
                <div className="success-message" style={{ 
                    backgroundColor: '#dcfce7', 
                    color: '#166534', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    margin: '1rem 0' 
                }}>
                    ✅ {successMessage}
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
                                    setImagePreview(null);
                                }}
                            >
                                <X size={20} />
                            </Button>
                        </div>
                        
                        {/* {editingId && (
                            <div style={{ 
                                padding: '0.75rem', 
                                backgroundColor: '#f0f9ff', 
                                border: '1px solid #0ea5e9',
                                borderRadius: '8px', 
                                marginBottom: '1rem' 
                            }}>
                                <small style={{ color: '#0369a1' }}>
                                    ✏️ Editing blog #{editingId}. Make your changes below and click "Update as Draft" or "Update & Publish".
                                </small>
                            </div>
                        )} */}
                        
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
                                {imagePreview && (
                                    <div style={{ marginTop: '0.5rem', position: 'relative' }}>
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            style={{ 
                                                maxWidth: '200px', 
                                                maxHeight: '150px', 
                                                borderRadius: '8px',
                                                objectFit: 'cover'
                                            }} 
                                        />
                                        {editingId && (
                                            <button
                                                onClick={() => setImagePreview(null)}
                                                type="button"
                                                style={{ 
                                                    position: 'absolute', 
                                                    top: '4px', 
                                                    right: '4px', 
                                                    background: 'rgba(0,0,0,0.7)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    minWidth: 'auto',
                                                    padding: '4px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <X size={12} />
                                            </button>
                                        )}
                                    </div>
                                )}
                                {imageUploading && (
                                    <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                        Uploading image...
                                    </div>
                                )}
                                <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                    {editingId 
                                        ? 'Upload a new image to replace the current one, or leave unchanged.'
                                        : 'If no image is selected, a default astronomy image will be used.'
                                    } Recommended: 1200x600px or 2:1 aspect ratio
                                </small>
                            </div>
                            
                            {(!newBlog.title.trim() || !newBlog.content.trim()) && (
                                <div style={{ 
                                    padding: '0.5rem', 
                                    backgroundColor: '#fef2f2', 
                                    border: '1px solid #fca5a5',
                                    borderRadius: '6px', 
                                    marginBottom: '1rem' 
                                }}>
                                    <small style={{ color: '#dc2626' }}>
                                        ⚠️ Please fill in both title and content before saving or publishing.
                                    </small>
                                </div>
                            )}
                            
                            <div className="form-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <Button 
                                    type="submit"
                                    variant="border"
                                    disabled={loading || imageUploading || !newBlog.title.trim() || !newBlog.content.trim()}
                                >
                                    <Save size={16} />
                                    {editingId ? 'Update as Draft' : 'Save as Draft'}
                                </Button>
                                <Button 
                                    type="button"
                                    onClick={() => handlePublishBlog()}
                                    disabled={loading || imageUploading || !newBlog.title.trim() || !newBlog.content.trim()}
                                >
                                    <FaEye size={16} />
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
                        onView={(blog) => {
                            setSelectedBlog(blog);
                            loadBlogComments(blog.id);
                        }}
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
                <div className="stellarion-blog-detail-overlay">
                    <div className="stellarion-blog-detail-modal">
                        <div className="stellarion-modal-header">
                            <h2 className="stellarion-modal-title">{selectedBlog.title}</h2>
                            <button className="stellarion-modal-close" onClick={() => setSelectedBlog(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="stellarion-modal-content">
                            {selectedBlog.image && (
                                <img src={selectedBlog.image} alt={selectedBlog.title} className="stellarion-modal-image" />
                            )}
                            
                            <div className="stellarion-modal-meta">
                                <span className="stellarion-meta-author">By {selectedBlog.author}</span>
                                <span className="stellarion-meta-date">{new Date(selectedBlog.createdAt || selectedBlog.created_at || selectedBlog.date || new Date()).toLocaleDateString()}</span>
                                <div className="stellarion-meta-rating">
                                    {renderStars(selectedBlog.rating || 0)}
                                    <span>{selectedBlog.rating || 0}</span>
                                </div>
                                <span className={`stellarion-meta-status ${selectedBlog.published ? 'stellarion-status-published' : 'stellarion-status-draft'}`}>
                                    {selectedBlog.published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            
                            <div className="stellarion-modal-stats">
                                <span className="stellarion-stat-item"><FaEye size={16} /> {selectedBlog.reach || selectedBlog.view_count || 0} views</span>
                                <span className="stellarion-stat-item"><FaHeart size={16} /> {selectedBlog.likes || selectedBlog.like_count || 0} likes</span>
                                <span className="stellarion-stat-item"><FaComment size={16} /> {selectedBlog.comment_count || 0} comments</span>
                            </div>
                            
                            <div className="stellarion-modal-text">
                                <p>{selectedBlog.content}</p>
                            </div>

                            <div className="stellarion-modal-actions">
                                <Button 
                                    onClick={() => {
                                        setSelectedBlog(null);
                                        handleEdit(selectedBlog.id);
                                    }} 
                                    variant="border"
                                    className="stellarion-action-btn stellarion-action-edit"
                                >
                                    <FaEdit size={16} />
                                    Edit
                                </Button>
                                <Button 
                                    onClick={() => handleTogglePublish(selectedBlog.id)}
                                    variant="border"
                                    className="stellarion-action-btn stellarion-action-publish"
                                >
                                    {selectedBlog.published ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    {selectedBlog.published ? 'Unpublish' : 'Publish'}
                                </Button>
                                <Button 
                                    onClick={() => handleLike(selectedBlog.id)}
                                    variant={selectedBlog.liked ? 'secondary' : 'border'}
                                    className={`stellarion-action-btn stellarion-action-like ${selectedBlog.liked ? 'stellarion-liked' : ''}`}
                                >
                                    <Heart size={16} fill={selectedBlog.liked ? 'currentColor' : 'none'} />
                                    {selectedBlog.liked ? 'Liked' : 'Like'}
                                </Button>
                            </div>
                            
                            <div className="stellarion-comments-section">
                                <h3 className="stellarion-comments-title">
                                    Comments ({selectedBlog.comment_count || 0})
                                    {commentsLoading && <span className="stellarion-loading-text">Loading...</span>}
                                </h3>
                                
                                <div className="stellarion-add-comment">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedBlog.id)}
                                        className="stellarion-comment-input"
                                    />
                                    <Button 
                                        onClick={() => handleAddComment(selectedBlog.id)}
                                        disabled={!newComment.trim()}
                                        className="stellarion-comment-submit"
                                    >
                                        <Send size={16} />
                                    </Button>
                                </div>
                                
                                <div className="stellarion-comments-list">
                                    {(selectedBlog.comments || []).length === 0 ? (
                                         <div className="stellarion-no-comments">
                                            <MessageCircle size={24} />
                                            <p>No comments yet. Be the first to comment!</p>
                                        </div>
                                    ) : (
                                        (selectedBlog.comments || []).map((comment) => (
                                            <div key={comment.id} className="stellarion-comment">
                                                <div className="stellarion-comment-header">
                                                    <div className="stellarion-comment-user-info">
                                                        <span className="stellarion-comment-author">{comment.user}</span>
                                                        <span className="stellarion-comment-timestamp">{comment.date}</span>
                                                    </div>
                                                    {comment.user === 'You' && (
                                                        <Button 
                                                            onClick={() => handleDeleteComment(selectedBlog.id, comment.id)}
                                                            variant="ghost"
                                                            size="small"
                                                            className="stellarion-comment-delete"
                                                        >
                                                            <FaTrash size={14} />
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="stellarion-comment-text">{comment.text}</p>
                                            </div>
                                        ))
                                    )}
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