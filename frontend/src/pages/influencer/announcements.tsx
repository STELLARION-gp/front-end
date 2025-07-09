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

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Mock function to add a reply to an announcement
 * @param reply The reply to add
 * @returns A promise that resolves with the added reply
 */
/*******  e4f4db86-8415-4748-a2dc-43e5c3bd5641  *******/
const mockAddReply = (reply: Omit<Reply, 'id'>): Promise<Reply> =>
    Promise.resolve({ ...reply, id: Math.random().toString(36).substr(2, 9) });

const AnnouncementsPage: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [editing, setEditing] = useState<Announcement | null>(null);
    const [form, setForm] = useState<{ title: string; content: string }>({ title: '', content: '' });
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
        setLoading(true);
        const reply = await mockAddReply({ announcementId, content });
        setAnnouncements(anns =>
            anns.map(a =>
                a.id === announcementId ? { ...a, replies: [...a.replies, reply] } : a
            )
        );
        setLoading(false);
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
                        <form onSubmit={e => { e.preventDefault(); handleReply(a.id, form.content); }} style={{ marginBottom: 24 }}>
                            <textarea
                                name="content"
                                placeholder="Reply"
                                value={form.content}
                                onChange={handleChange}
                                required
                                rows={2}
                                style={{ width: '100%', marginBottom: 8, padding: 8, backgroundColor: 'transparent', color: 'white', border: '1px solid white' }}
                            />
                            <button type="submit" disabled={loading} style={{ marginRight: 8, backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}>
                                Reply
                            </button>
                        </form>
                        <br/>
                        <br/>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {a.replies.map(r => (
                                <li key={r.id} style={{ border: '1px solid #ccc', padding: 8, marginBottom: 8 }}>
                                    <p>{r.content}</p>
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
