import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Eye, Heart, Plus, Save, X, Send, MessageCircle, Video } from 'lucide-react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import '../../styles/pages/influencer/myblogs.scss';

type Comment = {
    id: number;
    user: string;
    text: string;
    date: string;
};

type Vlog = {
    id: number;
    title: string;
    description: string;
    video: string | null;
    author: string;
    date: string;
    views: number;
    likes: number;
    comments: Comment[];
    liked: boolean;
};

const mockVlogs: Vlog[] = [
    {
        id: 1,
        title: 'Journey Through the Milky Way',
        description: 'Explore the wonders of our galaxy in this immersive video tour. From the spiral arms to the galactic core, discover the secrets of the Milky Way.',
        video: 'https://www.youtube.com/watch?v=knuQHuYlhd0&list=RDknuQHuYlhd0&start_radio=1',
        author: 'Astro Influencer',
        date: '2025-06-20',
        views: 1547,
        likes: 120,
        liked: false,
        comments: [
            { id: 1, user: 'Alice Cooper', text: 'Amazing visuals and narration!', date: '2025-06-21' },
            { id: 2, user: 'Bob Universe', text: 'Loved the explanation of the galactic core.', date: '2025-06-22' },
        ],
    },
    {
        id: 2,
        title: 'Black Holes Explained',
        description: 'Dive into the mysterious world of black holes. Learn how they form, what happens inside, and their role in the universe.',
        video: 'https://www.w3schools.com/html/movie.mp4',
        author: 'Astro Influencer',
        date: '2025-06-18',
        views: 982,
        likes: 87,
        liked: false,
        comments: [
            { id: 3, user: 'Maria Galaxy', text: 'Very informative and easy to understand!', date: '2025-06-19' },
        ],
    },
];

export default function Vlogs() {
    const [vlogs, setVlogs] = useState<Vlog[]>([]);
    const [newVlog, setNewVlog] = useState<{ title: string; description: string; video: File | null }>({ title: '', description: '', video: null });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedVlog, setSelectedVlog] = useState<Vlog | null>(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        setVlogs(mockVlogs);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const files = (e.target as HTMLInputElement).files;
        setNewVlog((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleCreateVlog = (e: React.FormEvent) => {
        e.preventDefault();
        const newId = vlogs.length ? Math.max(...vlogs.map(v => v.id)) + 1 : 1;
        const newVlogPost: Vlog = {
            ...newVlog,
            id: newId,
            author: 'You',
            date: new Date().toISOString().split('T')[0],
            views: 0,
            likes: 0,
            comments: [],
            liked: false,
            video: newVlog.video ? URL.createObjectURL(newVlog.video) : null,
        };
        setVlogs([newVlogPost, ...vlogs]);
        setNewVlog({ title: '', description: '', video: null });
        setShowCreateForm(false);
    };

    const handleDelete = (id: number) => {
        setVlogs(vlogs.filter((v) => v.id !== id));
        if (selectedVlog?.id === id) {
            setSelectedVlog(null);
        }
    };

    const handleEdit = (id: number) => {
        setEditingId(id);
        const vlog = vlogs.find((v) => v.id === id);
        if (vlog) {
            setNewVlog({ title: vlog.title, description: vlog.description, video: null });
            setShowCreateForm(true);
        }
    };

    const handleUpdateVlog = (e: React.FormEvent) => {
        e.preventDefault();
        setVlogs(
            vlogs.map((v) =>
                v.id === editingId
                    ? {
                        ...v,
                        title: newVlog.title,
                        description: newVlog.description,
                        video: newVlog.video ? URL.createObjectURL(newVlog.video) : v.video,
                    }
                    : v
            )
        );
        setEditingId(null);
        setNewVlog({ title: '', description: '', video: null });
        setShowCreateForm(false);
    };

    const handleLike = (id: number) => {
        setVlogs(vlogs.map(vlog =>
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

    const handleAddComment = (vlogId: number) => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            user: 'You',
            text: newComment,
            date: new Date().toISOString().split('T')[0]
        };

        setVlogs(vlogs.map(vlog =>
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

    const handleDeleteComment = (vlogId: number, commentId: number) => {
        setVlogs(vlogs.map(vlog =>
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

    return (
        <div className="blogs-container">
            <div className="blogs-header">
                <h1>My Astronomy Vlogs</h1>
                <p>Share your cosmic journeys and video explorations with the world.</p>
                <Button onClick={() => setShowCreateForm(true)}>
                    <Plus size={20} />
                    Upload New Vlog
                </Button>
            </div>

            {showCreateForm && (
                <div className="blog-form-overlay">
                    <div className="blog-form">
                        <div className="form-header">
                            <h2>{editingId ? 'Edit Vlog' : 'Upload New Vlog'}</h2>
                            <Button
                                onClick={() => {
                                    setShowCreateForm(false);
                                    setEditingId(null);
                                    setNewVlog({ title: '', description: '', video: null });
                                }}
                            >
                                <X size={20} />
                            </Button>
                        </div>

                        <form onSubmit={editingId ? handleUpdateVlog : handleCreateVlog}>
                            <div className="form-group">
                                <label>Vlog Title</label>
                                <InputField
                                    type="text"
                                    name="title"
                                    placeholder="Enter your vlog title..."
                                    value={newVlog.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Describe your astronomical vlog..."
                                    value={newVlog.description}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                />
                            </div>

                            <div className="form-group">
                                <label>Upload Video</label>
                                <input
                                    type="file"
                                    name="video"
                                    accept="video/*"
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-actions">
                                <Button type="submit">
                                    <Save size={16} />
                                    {editingId ? 'Update Vlog' : 'Publish Vlog'}
                                </Button>
                                <Button type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setEditingId(null);
                                        setNewVlog({ title: '', description: '', video: null });
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
                {vlogs.map((vlog) => (
                    <div key={vlog.id} className="blog-card">
                        <div className="blog-image">
                            {vlog.video && (
                                <video src={vlog.video} controls width="100%" height="180" />
                            )}
                            <div className="blog-actions">
                                <Button onClick={() => handleEdit(vlog.id)}>
                                    <Edit2 size={16} />
                                </Button>
                                <Button onClick={() => handleDelete(vlog.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </div>

                        <div className="blog-content">
                            <h3>{vlog.title}</h3>

                            <div className="blog-meta">
                                <span className="author">{vlog.author}</span>
                                <span className="date">{vlog.date}</span>
                            </div>

                            <p className="blog-excerpt">
                                {vlog.description.substring(0, 120)}...
                            </p>

                            <div className="blog-stats">
                                <span className="stat">
                                    <Eye size={16} />
                                    {vlog.views}
                                </span>
                                <span className="stat">
                                    <Heart size={16} />
                                    {vlog.likes}
                                </span>
                                <span className="stat">
                                    <MessageCircle size={16} />
                                    {vlog.comments.length}
                                </span>
                            </div>

                            <div className="blog-actions-bottom">
                                <Button
                                    onClick={() => handleLike(vlog.id)}
                                    variant={vlog.liked ? 'secondary' : 'outline'}
                                >
                                    <Heart size={16} fill={vlog.liked ? 'currentColor' : 'none'} />
                                    {vlog.liked ? 'Liked' : 'Like'}
                                </Button>
                                <Button
                                    onClick={() => setSelectedVlog(vlog)}
                                    variant="outline"
                                >
                                    Watch Vlog
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {vlogs.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon"><Video size={32} /></div>
                    <h3>No vlogs yet</h3>
                    <p>Start sharing your astronomical journeys with the world!</p>
                    <Button onClick={() => setShowCreateForm(true)}>
                        Upload Your First Vlog
                    </Button>
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
                            {selectedVlog.video && (
                                <video src={selectedVlog.video} controls className="modal-image" width="100%" />
                            )}

                            <div className="modal-meta">
                                <span className="author">By {selectedVlog.author}</span>
                                <span className="date">{selectedVlog.date}</span>
                            </div>

                            <div className="modal-stats">
                                <span><Eye size={16} /> {selectedVlog.views} views</span>
                                <span><Heart size={16} /> {selectedVlog.likes} likes</span>
                                <span><MessageCircle size={16} /> {selectedVlog.comments.length} comments</span>
                            </div>

                            <div className="modal-text">
                                <p>{selectedVlog.description}</p>
                            </div>

                            <div className="comments-section">
                                <h3>Comments ({selectedVlog.comments.length})</h3>

                                <div className="add-comment">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedVlog.id)}
                                    />
                                    <Button onClick={() => handleAddComment(selectedVlog.id)}>
                                        <Send size={16} />
                                    </Button>
                                </div>

                                <div className="comments-list">
                                    {selectedVlog.comments.map((comment) => (
                                        <div key={comment.id} className="comment">
                                            <div className="comment-header">
                                                <span className="comment-author">{comment.user}</span>
                                                <span className="comment-timestamp">{comment.date}</span>
                                                <Button
                                                    onClick={() => handleDeleteComment(selectedVlog.id, comment.id)}
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
}