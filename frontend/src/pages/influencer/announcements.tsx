import React, { useEffect, useState } from 'react';
import '../../styles/pages/influencer/Announcements.scss';
type Announcement = {
    id: string;
    title: string;
    content: string;
    replies: Reply[];
};

type Reply = {
    id: string;
    announcementId: string;
    content: string;
    authorName: string;
    likes: number;
    timestamp: string;
};

const mockFetchAnnouncements = (): Promise<Announcement[]> =>
    Promise.resolve([
        { id: '1', title: 'Welcome to Space&Me!', content: 'Hi! This is my official account.', replies: [] },
        { id: '2', title: 'Session on Constellations', content: 'Would you like a session on contellations this Sunday?', replies: [] },
    ]);

const mockAddAnnouncement = (announcement: Omit<Announcement, 'id'>): Promise<Announcement> =>
    Promise.resolve({ ...announcement, id: Math.random().toString(36).substr(2, 9), replies: [] });

const mockUpdateAnnouncement = (announcement: Announcement): Promise<Announcement> =>
    Promise.resolve(announcement);

const mockDeleteAnnouncement = (): Promise<void> =>
    Promise.resolve();

const mockAddReply = (reply: Omit<Reply, 'id' | 'likes' | 'timestamp'>): Promise<Reply> =>
    Promise.resolve({ 
        ...reply, 
        id: Math.random().toString(36).substr(2, 9),
        likes: 0,
        timestamp: new Date().toISOString()
    });

const mockUpdateReply = (reply: Reply): Promise<Reply> =>
    Promise.resolve(reply);

const mockDeleteReply = (): Promise<void> =>
    Promise.resolve();

const mockLikeReply = (replyId: string): Promise<void> =>
    Promise.resolve();

const AnnouncementsPage: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [editing, setEditing] = useState<Announcement | null>(null);
    const [editingReply, setEditingReply] = useState<Reply | null>(null);
    const [form, setForm] = useState<{ title: string; content: string }>({ title: '', content: '' });
    const [replyForms, setReplyForms] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        mockFetchAnnouncements().then(data => {
            setAnnouncements(data);
            setLoading(false);
        });
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleReplyFormChange = (announcementId: string, value: string) => {
        setReplyForms({ ...replyForms, [announcementId]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (editing) {
            const updated = await mockUpdateAnnouncement({ ...editing, ...form });
            setAnnouncements(anns =>
                anns.map(a => (a.id === updated.id ? updated : a))
            );
            setEditing(null);
        } else {
            const added = await mockAddAnnouncement({ ...form, replies: [] });
            setAnnouncements(anns => [added, ...anns]);
        }
        setForm({ title: '', content: '' });
        setLoading(false);
    };

    const handleEdit = (announcement: Announcement) => {
        setEditing(announcement);
        setForm({ title: announcement.title, content: announcement.content });
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        await mockDeleteAnnouncement();
        setAnnouncements(anns => anns.filter(a => a.id !== id));
        setLoading(false);
    };

    const handleCancelEdit = () => {
        setEditing(null);
        setForm({ title: '', content: '' });
    };

    const handleReply = async (announcementId: string, content: string) => {
        if (!content.trim()) return;
        
        setLoading(true);
        const reply = await mockAddReply({ 
            announcementId, 
            content,
            authorName: 'User' // In a real app, this would come from the authenticated user
        });
        setAnnouncements(anns =>
            anns.map(a =>
                a.id === announcementId ? { ...a, replies: [...a.replies, reply] } : a
            )
        );
        setReplyForms({ ...replyForms, [announcementId]: '' });
        setLoading(false);
    };

    const handleEditReply = (reply: Reply) => {
        setEditingReply(reply);
        setReplyForms({ ...replyForms, [reply.announcementId]: reply.content });
    };

    const handleUpdateReply = async (announcementId: string, replyId: string, content: string) => {
        if (!content.trim()) return;
        
        setLoading(true);
        const updatedReply = await mockUpdateReply({ 
            ...editingReply!, 
            content 
        });
        setAnnouncements(anns =>
            anns.map(a =>
                a.id === announcementId 
                    ? { ...a, replies: a.replies.map(r => r.id === replyId ? updatedReply : r) }
                    : a
            )
        );
        setEditingReply(null);
        setReplyForms({ ...replyForms, [announcementId]: '' });
        setLoading(false);
    };

    const handleDeleteReply = async (announcementId: string, replyId: string) => {
        setLoading(true);
        await mockDeleteReply();
        setAnnouncements(anns =>
            anns.map(a =>
                a.id === announcementId 
                    ? { ...a, replies: a.replies.filter(r => r.id !== replyId) }
                    : a
            )
        );
        setLoading(false);
    };

    const handleLikeReply = async (announcementId: string, replyId: string) => {
        setLoading(true);
        await mockLikeReply(replyId);
        setAnnouncements(anns =>
            anns.map(a =>
                a.id === announcementId 
                    ? { ...a, replies: a.replies.map(r => r.id === replyId ? { ...r, likes: r.likes + 1 } : r) }
                    : a
            )
        );
        setLoading(false);
    };

    const handleCancelReplyEdit = (announcementId: string) => {
        setEditingReply(null);
        setReplyForms({ ...replyForms, [announcementId]: '' });
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
            <h1>Add Announcements</h1> <br/>
            <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', marginBottom: 8, padding: 8, backgroundColor: 'transparent', color: 'white', border: '1px solid white' }}
                /> 
                <textarea
                    name="content"
                    placeholder="Content"
                    value={form.content}
                    onChange={handleChange}
                    required
                    rows={4}
                    style={{ width: '100%', marginBottom: 8, padding: 8, backgroundColor: 'transparent', color: 'white', border: '1px solid white' }}
                    
                />
                <button type="submit" disabled={loading} style={{ marginRight: 8, backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}>
                    {editing ? 'Update' : 'Add'} Announcement
                </button>

                <br/>
                <br/>
                <h1>Placed Announcements</h1>
                {editing && (
                    <button type="button" onClick={handleCancelEdit} disabled={loading}>
                        Cancel
                    </button>
                )}
            </form>
            {loading && <div>Loading...</div>}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {announcements.map(a => (
                    <li key={a.id} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 12 }}>
                        <h3>{a.title}</h3>
                        <p>{a.content}</p>
                        <button onClick={() => handleEdit(a)} style={{ marginRight: 8, backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}>
                            Edit
                        </button>
                        <button onClick={() => handleDelete(a.id)} style={{ marginRight: 8, backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}>
                            Delete
                        </button>
                        <br/>
                        <br/>
                        <form onSubmit={e => { 
                            e.preventDefault(); 
                            if (editingReply && editingReply.announcementId === a.id) {
                                handleUpdateReply(a.id, editingReply.id, replyForms[a.id] || '');
                            } else {
                                handleReply(a.id, replyForms[a.id] || '');
                            }
                        }} style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
                            <textarea
                                placeholder={editingReply && editingReply.announcementId === a.id ? "Edit reply" : "Reply"}
                                value={replyForms[a.id] || ''}
                                onChange={(e) => handleReplyFormChange(a.id, e.target.value)}
                                required
                                rows={2}
                                style={{ width: '100%', marginBottom: 8, padding: 8, backgroundColor: 'transparent', color: 'white', border: '1px solid white' }}
                            />
                            <button type="submit" disabled={loading} style={{ marginRight: 8, backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}>
                                {editingReply && editingReply.announcementId === a.id ? 'Update' : 'Reply'}
                            </button>
                            {editingReply && editingReply.announcementId === a.id && (
                                <button type="button" onClick={() => handleCancelReplyEdit(a.id)} disabled={loading} style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}>
                                    Cancel
                                </button>
                            )}
                        </form>
                        <br/>
                        <br/>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {a.replies.map(r => (
                                <li key={r.id} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <strong style={{ color: 'white' }}>{r.authorName}</strong>
                                        <small style={{ color: '#ccc' }}>{new Date(r.timestamp).toLocaleDateString()}</small>
                                    </div>
                                    <p>{r.content}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                        <button 
                                            onClick={() => handleLikeReply(a.id, r.id)} 
                                            disabled={loading}
                                            style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', fontSize: '12px' }}
                                        >
                                            ❤️ {r.likes}
                                        </button>
                                        <button 
                                            onClick={() => handleEditReply(r)} 
                                            disabled={loading}
                                            style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', fontSize: '12px' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteReply(a.id, r.id)} 
                                            disabled={loading}
                                            style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', fontSize: '12px' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnnouncementsPage;