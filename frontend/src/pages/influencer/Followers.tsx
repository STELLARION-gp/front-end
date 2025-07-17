import React, { useState } from 'react';
import '../../styles/pages/influencer/followers.scss';
import Button from '../../components/Button';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface Follower {
    id: string;
    name: string;
    avatar: string;
    followedDate: string;
    isActive: boolean;
}

interface FollowRequest {
    id: string;
    name: string;
    avatar: string;
    requestDate: string;
    mutualFollowers: number;
}

interface Message {
    id: string;
    sender: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
}

const Followers: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'followers' | 'requests' | 'messages'>('followers');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);
    
    // Mock data - replace with actual API calls
    const followers: Follower[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            followedDate: '2024-01-15',
            isActive: true
        },
        {
            id: '2',
            name: 'Miky Chen',
            avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
            followedDate: '2024-01-10',
            isActive: false
        }
    ];

    const followRequests: FollowRequest[] = [
        {
            id: '1',
            name: 'Alex Turner',
            avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
            requestDate: '2024-01-20',
            mutualFollowers: 5
        }
    ];

    const messages: Message[] = [
        {
            id: '1',
            sender: 'Sarah Johnson',
            avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
            lastMessage: 'Thanks for the amazing astronomy content!',
            timestamp: '2 hours ago',
            unread: true
        }
    ];

    const messageHistories: { [followerId: string]: { sender: string, text: string, timestamp: string }[] } = {
        '1': [
            { sender: 'Sarah Johnson', text: 'Thanks for the amazing astronomy content!', timestamp: '2024-06-01 10:00' },
            { sender: 'You', text: 'Glad you enjoyed it!', timestamp: '2024-06-01 10:05' }
        ],
        '2': [
            { sender: 'Miky Chen', text: 'Can you share more about the next event?', timestamp: '2024-06-02 09:00' },
            { sender: 'You', text: 'Sure, I will post details soon.', timestamp: '2024-06-02 09:10' }
        ]
    };

    const handleAcceptRequest = (requestId: string) => {
        console.log('Accepting request:', requestId);
        // Implement accept logic
    };

    const handleDeclineRequest = (requestId: string) => {
        console.log('Declining request:', requestId);
        // Implement decline logic
    };

    const openChat = (followerId: string) => {
        const history = messageHistories[followerId] || [];
        setModalContent(
            <div>
                <h3>Message History</h3>
                <div style={{
                    maxHeight: '250px',
                    overflowY: 'auto',
                    marginBottom: '1rem',
                    background: '#f3f4f6',
                    padding: '1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    {history.length === 0 ? (
                        <div>No previous messages.</div>
                    ) : (
                        history.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                                    background: msg.sender === 'You' ? '#6366f1' : '#e5e7eb',
                                    color: msg.sender === 'You' ? '#fff' : '#222',
                                    borderRadius: '16px',
                                    padding: '0.5rem 1rem',
                                    maxWidth: '70%',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}
                        >
                            <div style={{fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem'}}>
                                {msg.sender}
                            </div>
                            <div style={{fontSize: '1rem'}}>{msg.text}</div>
                            <div style={{fontSize: '0.75rem', color: msg.sender === 'You' ? '#d1d5db' : '#888', marginTop: '0.25rem', textAlign: 'right'}}>
                                {msg.timestamp}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <textarea rows={3} style={{width: '100%', marginTop: '1rem'}} placeholder="Type your message..." />
            <div style={{marginTop: '1rem', display: 'flex', gap: '1rem'}}>
                <Button onClick={() => alert('Message sent!')}>Send Message</Button>
                <Button onClick={() => setModalOpen(false)}>Close</Button>
            </div>
        </div>
    );
    setModalOpen(true);
};

    const handleNewMessage = () => {
        setModalContent(
            <div>
                <h3>New Message</h3>
                <input type="text" style={{width: '100%', marginBottom: '1rem'}} placeholder="Recipient name..." />
                <textarea rows={3} style={{width: '100%'}} placeholder="Type your message..." />
                <div style={{marginTop: '1rem', display: 'flex', gap: '1rem'}}>
                    <Button onClick={() => alert('Message sent!')}>Send</Button>
                    <Button onClick={() => setModalOpen(false)}>Close</Button>
                </div>
            </div>
        );
        setModalOpen(true);
    };

    const handleReply = (messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        setModalContent(
            <div>
                <h3>Reply to {message?.sender}</h3>
                <textarea rows={3} style={{width: '100%'}} placeholder="Type your reply..." />
                <div style={{marginTop: '1rem', display: 'flex', gap: '1rem'}}>
                    <Button onClick={() => alert('Reply sent!')}>Send Reply</Button>
                    <Button onClick={() => setModalOpen(false)}>Close</Button>
                </div>
            </div>
        );
        setModalOpen(true);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="page-title">Community Management</h1>
                    <p className="page-subtitle">
                        Manage and engage with your astronomy community
                    </p>
                </div>
            </div>
            
            <div className="stats-container">
                <div className="stats-grid">
                    <div className="stat-card primary">
                        <div className="stat-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{followers.length}</h3>
                            <p className="stat-label">Total Followers</p>
                        </div>
                    </div>
                    <div className="stat-card secondary">
                        <div className="stat-icon">
                            <i className="fas fa-user-plus"></i>
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{followRequests.length}</h3>
                            <p className="stat-label">Pending Requests</p>
                        </div>
                    </div>
                    <div className="stat-card accent">
                        <div className="stat-icon">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{messages.filter(m => m.unread).length}</h3>
                            <p className="stat-label">Unread Messages</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="content-container">
                <div className="tab-navigation">
                    <Button 
                        className={`tab-btn ${activeTab === 'followers' ? 'primary' : 'secondary'}`}
                        onClick={() => setActiveTab('followers')}
                    >
                        <i className="fas fa-users"></i>
                        My Followers ({followers.length})
                    </Button>
                    <Button  
                        className={`tab-btn ${activeTab === 'requests' ? 'primary' : 'secondary'}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <i className="fas fa-user-clock"></i>
                        Follow Requests ({followRequests.length})
                    </Button>
                    <Button  
                        className={`tab-btn ${activeTab === 'messages' ? 'primary' : 'secondary'}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        <i className="fas fa-comments"></i>
                        Messages ({messages.filter(m => m.unread).length})
                    </Button>
                </div>

                <div className="tab-content">
                    {activeTab === 'followers' && (
                        <div className="followers-section">
                            <div className="section-header">
                                <h2 className="section-title">My Followers</h2>
                                <div className="section-actions">
                                    <Button>
                                        <i className="fas fa-download"></i>
                                        Export List
                                    </Button>
                                </div>
                            </div>
                            {followers.length > 0 ? (
                                <div className="card-grid">
                                    {followers.map(follower => (
                                        <div key={follower.id} className="user-card">
                                            <div className="user-avatar">
                                                {follower.avatar ? (
                                                    <img
                                                        src={follower.avatar}
                                                        alt={follower.name}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: '50%',
                                                            background: '#667eea',
                                                            color: 'white',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 700,
                                                            fontSize: '1.25rem',
                                                            textTransform: 'uppercase'
                                                        }}
                                                    >
                                                        {follower.name.slice(0,2)}
                                                    </div>
                                                )}
                                                
                                            </div>
                                            <div className="user-info">
                                                <h4 className="user-name">{follower.name}</h4>
                                                <p className="user-meta">Followed on {new Date(follower.followedDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="user-actions">
                                                <Button onClick={() => openChat(follower.id)}>
                                                    <i className="fas fa-message"></i>
                                                    Message
                                                </Button>
                                                <Button>
                                                    <i className="fas fa-user"></i>
                                                    Profile
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">
                                        <i className="fas fa-users"></i>
                                    </div>
                                    <h3>No followers yet</h3>
                                    <p>Start creating amazing astronomy content to build your community!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'requests' && (
                        <div className="requests-section">
                            <div className="section-header">
                                <h2 className="section-title">Follow Requests</h2>
                            </div>
                            {followRequests.length > 0 ? (
                                <div className="request-list">
                                    {followRequests.map(request => (
                                        <div key={request.id} className="request-item">
                                            <div className="request-user">
                                                <div className="user-avatar">
                                                    <img src={request.avatar} alt={request.name} />
                                                </div>
                                                <div className="user-info">
                                                    <h4 className="user-name">{request.name}</h4>
                                                    <p className="user-meta">
                                                        {request.mutualFollowers} mutual followers • 
                                                        Requested {new Date(request.requestDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="request-actions">
                                                <Button 
                                                    className="btn-accept btn-sm"
                                                    onClick={() => handleAcceptRequest(request.id)}
                                                >
                                                   
                                                    Accept
                                                </Button>
                                                <Button  
                                                    className="btn-decline btn-sm"
                                                    onClick={() => handleDeclineRequest(request.id)}
                                                >
                                                   
                                                    Decline
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">
                                        <i className="fas fa-user-clock"></i>
                                    </div>
                                    <h3>No pending requests</h3>
                                    <p>You're all caught up! No new follow requests at this time.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div className="messages-section">
                            <div className="section-header">
                                <h2 className="section-title">Messenger Center</h2>
                                <div className="section-actions">
                                    <Button onClick={handleNewMessage}>
                                        <i className="fas fa-plus"></i>
                                        New Message
                                    </Button>
                                </div>
                            </div>
                            {messages.length > 0 ? (
                                <div className="message-list">
                                    {messages.map(message => (
                                        <div 
                                            key={message.id} 
                                            className={`message-item ${message.unread ? 'unread' : ''}`}
                                            onClick={() => openChat(message.id)}
                                        >
                                            <div className="message-user">
                                                <div className="user-avatar">
                                                    <img src={message.avatar} alt={message.sender} />
                                                    {message.unread && <span className="unread-dot"></span>}
                                                </div>
                                                <div className="message-content">
                                                    <div className="message-header">
                                                        <h4 className="sender-name">{message.sender}</h4>
                                                        <span className="message-time">{message.timestamp}</span>
                                                    </div>
                                                    <p className="message-preview">{message.lastMessage}</p>
                                                </div>
                                            </div>
                                            <div className="message-actions">
                                                <Button className="btn-ghost btn-sm" onClick={e => {e.stopPropagation(); handleReply(message.id);}}>
                                                    <i className="fas fa-reply"></i>
                                                    Reply
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-icon">
                                        <i className="fas fa-comments"></i>
                                    </div>
                                    <h3>No messages yet</h3>
                                    <p>Start conversations with your followers to build engagement!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* Modal for message/reply/new message */}
            {modalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: '#fff',
                        padding: '2rem',
                        borderRadius: '12px',
                        minWidth: '320px',
                        maxWidth: '90vw',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                    }}>
                        {modalContent}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Followers;
