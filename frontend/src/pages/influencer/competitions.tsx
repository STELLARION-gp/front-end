import React, { useEffect, useState } from 'react';
import '../../styles/pages/influencer/Competitions.scss'

type Competition = {
    id: string;
    title: string;
    content: string;
    description: string;
    deadline: string;
    prizes: string;
    requirements: string;
    applicationLink?: string;
    likes: number;
    replies: Reply[];
    isLiked: boolean;
    timestamp: string;
};

type Reply = {
    id: string;
    competitionId: string;
    content: string;
    authorName: string;
    likes: number;
    timestamp: string;
    isLiked: boolean;
};

const mockFetchCompetitions = (): Promise<Competition[]> =>
    Promise.resolve([
        { 
            id: '1', 
            title: 'Space Photography Contest 2025', 
            content: 'Show us your best astrophotography! Capture the beauty of the night sky.',
            description: 'We are looking for stunning photographs of celestial objects, star trails, or astronomical phenomena. This is your chance to showcase your astrophotography skills!',
            deadline: '2025-08-15',
            prizes: '$500 First Prize, $300 Second Prize, $200 Third Prize',
            requirements: 'Original photos only, high resolution (min 2048x2048), include capture details',
            applicationLink: 'https://example.com/apply-photo-contest',
            likes: 24,
            replies: [],
            isLiked: false,
            timestamp: new Date().toISOString()
        },
        { 
            id: '2', 
            title: 'Constellation Knowledge Challenge', 
            content: 'Test your knowledge of constellations and win amazing prizes!',
            description: 'Join our weekly constellation quiz and prove you are a true astronomy enthusiast. Questions will cover constellation mythology, star patterns, and celestial navigation.',
            deadline: '2025-07-20',
            prizes: 'Telescope, Star Charts, Astronomy Books',
            requirements: 'Open to all ages, basic astronomy knowledge helpful',
            applicationLink: 'https://example.com/apply-constellation-quiz',
            likes: 18,
            replies: [],
            isLiked: false,
            timestamp: new Date().toISOString()
        },
    ]);

const mockAddCompetition = (competition: Omit<Competition, 'id' | 'likes' | 'isLiked' | 'timestamp'>): Promise<Competition> =>
    Promise.resolve({ 
        ...competition, 
        id: Math.random().toString(36).substr(2, 9), 
        likes: 0,
        isLiked: false,
        timestamp: new Date().toISOString()
    });

const mockUpdateCompetition = (competition: Competition): Promise<Competition> =>
    Promise.resolve(competition);

const mockDeleteCompetition = (): Promise<void> =>
    Promise.resolve();

const mockAddReply = (reply: Omit<Reply, 'id' | 'likes' | 'timestamp' | 'isLiked'>): Promise<Reply> =>
    Promise.resolve({ 
        ...reply, 
        id: Math.random().toString(36).substr(2, 9),
        likes: 0,
        isLiked: false,
        timestamp: new Date().toISOString()
    });

const mockUpdateReply = (reply: Reply): Promise<Reply> =>
    Promise.resolve(reply);

const mockDeleteReply = (): Promise<void> =>
    Promise.resolve();

const mockLikeCompetition = (competitionId: string): Promise<void> =>
    Promise.resolve();

const mockLikeReply = (replyId: string): Promise<void> =>
    Promise.resolve();

const CompetitionsPage: React.FC = () => {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [editing, setEditing] = useState<Competition | null>(null);
    const [editingReply, setEditingReply] = useState<Reply | null>(null);
    const [form, setForm] = useState<{ 
        title: string; 
        content: string; 
        description: string;
        deadline: string;
        prizes: string;
        requirements: string;
        applicationLink: string;
    }>({ 
        title: '', 
        content: '', 
        description: '',
        deadline: '',
        prizes: '',
        requirements: '',
        applicationLink: ''
    });
    const [replyForms, setReplyForms] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        setLoading(true);
        mockFetchCompetitions().then(data => {
            setCompetitions(data);
            setLoading(false);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleReplyFormChange = (competitionId: string, value: string) => {
        setReplyForms({ ...replyForms, [competitionId]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (editing) {
            const updated = await mockUpdateCompetition({ ...editing, ...form });
            setCompetitions(comps =>
                comps.map(c => (c.id === updated.id ? updated : c))
            );
            setEditing(null);
        } else {
            const added = await mockAddCompetition({ ...form, replies: [] });
            setCompetitions(comps => [added, ...comps]);
        }
        setForm({ 
            title: '', 
            content: '', 
            description: '',
            deadline: '',
            prizes: '',
            requirements: '',
            applicationLink: ''
        });
        setShowAddForm(false);
        setLoading(false);
    };

    const handleEdit = (competition: Competition) => {
        setEditing(competition);
        setForm({ 
            title: competition.title, 
            content: competition.content,
            description: competition.description,
            deadline: competition.deadline,
            prizes: competition.prizes,
            requirements: competition.requirements,
            applicationLink: competition.applicationLink || ''
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this competition?')) {
            setLoading(true);
            await mockDeleteCompetition();
            setCompetitions(comps => comps.filter(c => c.id !== id));
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditing(null);
        setForm({ 
            title: '', 
            content: '', 
            description: '',
            deadline: '',
            prizes: '',
            requirements: '',
            applicationLink: ''
        });
        setShowAddForm(false);
    };

    const handleLikeCompetition = async (competitionId: string) => {
        setLoading(true);
        await mockLikeCompetition(competitionId);
        setCompetitions(comps =>
            comps.map(c =>
                c.id === competitionId 
                    ? { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked }
                    : c
            )
        );
        setLoading(false);
    };

    const handleReply = async (competitionId: string, content: string) => {
        if (!content.trim()) return;
        
        setLoading(true);
        const reply = await mockAddReply({ 
            competitionId, 
            content,
            authorName: 'User' // In a real app, this would come from the authenticated user
        });
        setCompetitions(comps =>
            comps.map(c =>
                c.id === competitionId ? { ...c, replies: [...c.replies, reply] } : c
            )
        );
        setReplyForms({ ...replyForms, [competitionId]: '' });
        setLoading(false);
    };

    const handleEditReply = (reply: Reply) => {
        setEditingReply(reply);
        setReplyForms({ ...replyForms, [reply.competitionId]: reply.content });
    };

    const handleUpdateReply = async (competitionId: string, replyId: string, content: string) => {
        if (!content.trim()) return;
        
        setLoading(true);
        const updatedReply = await mockUpdateReply({ 
            ...editingReply!, 
            content 
        });
        setCompetitions(comps =>
            comps.map(c =>
                c.id === competitionId 
                    ? { ...c, replies: c.replies.map(r => r.id === replyId ? updatedReply : r) }
                    : c
            )
        );
        setEditingReply(null);
        setReplyForms({ ...replyForms, [competitionId]: '' });
        setLoading(false);
    };

    const handleDeleteReply = async (competitionId: string, replyId: string) => {
        if (window.confirm('Are you sure you want to delete this reply?')) {
            setLoading(true);
            await mockDeleteReply();
            setCompetitions(comps =>
                comps.map(c =>
                    c.id === competitionId 
                        ? { ...c, replies: c.replies.filter(r => r.id !== replyId) }
                        : c
                )
            );
            setLoading(false);
        }
    };

    const handleLikeReply = async (competitionId: string, replyId: string) => {
        setLoading(true);
        await mockLikeReply(replyId);
        setCompetitions(comps =>
            comps.map(c =>
                c.id === competitionId 
                    ? { ...c, replies: c.replies.map(r => 
                        r.id === replyId 
                            ? { ...r, likes: r.isLiked ? r.likes - 1 : r.likes + 1, isLiked: !r.isLiked }
                            : r
                    )}
                    : c
            )
        );
        setLoading(false);
    };

    const handleCancelReplyEdit = (competitionId: string) => {
        setEditingReply(null);
        setReplyForms({ ...replyForms, [competitionId]: '' });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isDeadlinePassed = (deadline: string) => {
        return new Date(deadline) < new Date();
    };

    return (
        <div className="competitions-page">
            <div className="header">
                <h1>Competitions</h1>
                <button 
                    className="btn-primary"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? 'Cancel' : 'Add New Competition'}
                </button>
            </div>

            {showAddForm && (
                <div className="add-competition-form">
                    <h2>{editing ? 'Edit Competition' : 'Add New Competition'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                name="title"
                                placeholder="Competition Title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        
                        <div className="form-group">
                            <textarea
                                name="content"
                                placeholder="Brief Description"
                                value={form.content}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-group">
                            <textarea
                                name="description"
                                placeholder="Detailed Description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-group">
                            <label>Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={form.deadline}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <textarea
                                name="prizes"
                                placeholder="Prizes (e.g., $500 First Prize, $300 Second Prize)"
                                value={form.prizes}
                                onChange={handleChange}
                                required
                                rows={2}
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-group">
                            <textarea
                                name="requirements"
                                placeholder="Requirements and Rules"
                                value={form.requirements}
                                onChange={handleChange}
                                required
                                rows={3}
                                className="form-textarea"
                            />
                        </div>

                        <div className="form-group">
                            <input
                                name="applicationLink"
                                placeholder="Application Link (optional)"
                                value={form.applicationLink}
                                onChange={handleChange}
                                className="form-input"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" disabled={loading} className="btn-primary">
                                {editing ? 'Update Competition' : 'Add Competition'}
                            </button>
                            <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading && <div className="loading">Loading...</div>}

            <div className="competitions-list">
                {competitions.map(competition => (
                    <div key={competition.id} className="competition-card">
                        <div className="competition-header">
                            <h3>{competition.title}</h3>
                            <div className="competition-meta">
                                <span className="timestamp">
                                    {formatDate(competition.timestamp)}
                                </span>
                                <div className="admin-actions">
                                    <button onClick={() => handleEdit(competition)} className="btn-edit">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(competition.id)} className="btn-delete">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="competition-content">
                            <p className="brief-content">{competition.content}</p>
                            <div className="competition-details">
                                <p><strong>Description:</strong> {competition.description}</p>
                                <p className={`deadline ${isDeadlinePassed(competition.deadline) ? 'expired' : ''}`}>
                                    <strong>Deadline:</strong> {formatDate(competition.deadline)}
                                    {isDeadlinePassed(competition.deadline) && <span className="expired-badge">Expired</span>}
                                </p>
                                <p><strong>Prizes:</strong> {competition.prizes}</p>
                                <p><strong>Requirements:</strong> {competition.requirements}</p>
                            </div>
                        </div>

                        <div className="competition-actions">
                            <button 
                                onClick={() => handleLikeCompetition(competition.id)} 
                                className={`btn-like ${competition.isLiked ? 'liked' : ''}`}
                                disabled={loading}
                            >
                                ⭐ {competition.likes}
                            </button>
                            
                            <button className="btn-learn-more">
                                Learn More
                            </button>
                            
                            {competition.applicationLink && !isDeadlinePassed(competition.deadline) && (
                                <a 
                                    href={competition.applicationLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn-apply"
                                >
                                    Apply Now
                                </a>
                            )}
                        </div>

                        <div className="replies-section">
                            <form onSubmit={e => { 
                                e.preventDefault(); 
                                if (editingReply && editingReply.competitionId === competition.id) {
                                    handleUpdateReply(competition.id, editingReply.id, replyForms[competition.id] || '');
                                } else {
                                    handleReply(competition.id, replyForms[competition.id] || '');
                                }
                            }} className="reply-form">
                                <textarea
                                    placeholder={editingReply && editingReply.competitionId === competition.id ? "Edit reply" : "Share your thoughts..."}
                                    value={replyForms[competition.id] || ''}
                                    onChange={(e) => handleReplyFormChange(competition.id, e.target.value)}
                                    required
                                    rows={2}
                                    className="reply-textarea"
                                />
                                <div className="reply-actions">
                                    <button type="submit" disabled={loading} className="btn-reply">
                                        {editingReply && editingReply.competitionId === competition.id ? 'Update' : 'Reply'}
                                    </button>
                                    {editingReply && editingReply.competitionId === competition.id && (
                                        <button type="button" onClick={() => handleCancelReplyEdit(competition.id)} className="btn-secondary">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div className="replies-list">
                                {competition.replies.map(reply => (
                                    <div key={reply.id} className="reply-item">
                                        <div className="reply-header">
                                            <strong className="reply-author">{reply.authorName}</strong>
                                            <span className="reply-timestamp">
                                                {formatDate(reply.timestamp)}
                                            </span>
                                        </div>
                                        <p className="reply-content">{reply.content}</p>
                                        <div className="reply-item-actions">
                                            <button 
                                                onClick={() => handleLikeReply(competition.id, reply.id)} 
                                                className={`btn-like-reply ${reply.isLiked ? 'liked' : ''}`}
                                                disabled={loading}
                                            >
                                                ⭐ {reply.likes}
                                            </button>
                                            <button 
                                                onClick={() => handleEditReply(reply)} 
                                                className="btn-edit-reply"
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteReply(competition.id, reply.id)} 
                                                className="btn-delete-reply"
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompetitionsPage;