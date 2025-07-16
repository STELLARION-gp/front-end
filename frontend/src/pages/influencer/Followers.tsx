import React, { useState } from 'react';
import '../../styles/pages/influencer/Followers.scss';

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
    
    // Mock data - replace with actual API calls
    const followers: Follower[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            avatar: '/avatars/sarah.jpg',
            followedDate: '2024-01-15',
            isActive: true
        },
        {
            id: '2',
            name: 'Mike Chen',
            avatar: '/avatars/mike.jpg',
            followedDate: '2024-01-10',
            isActive: false
        }
    ];

    const followRequests: FollowRequest[] = [
        {
            id: '1',
            name: 'Alex Turner',
            avatar: '/avatars/alex.jpg',
            requestDate: '2024-01-20',
            mutualFollowers: 5
        }
    ];

    const messages: Message[] = [
        {
            id: '1',
            sender: 'Sarah Johnson',
            avatar: '/avatars/sarah.jpg',
            lastMessage: 'Thanks for the amazing astronomy content!',
            timestamp: '2 hours ago',
            unread: true
        }
    ];

    const handleAcceptRequest = (requestId: string) => {
        console.log('Accepting request:', requestId);
        // Implement accept logic
    };

    const handleDeclineRequest = (requestId: string) => {
        console.log('Declining request:', requestId);
        // Implement decline logic
    };

    const openChat = (messageId: string) => {
        console.log('Opening chat:', messageId);
        // Implement chat opening logic
    };

    return (
        <div className="followers-page">
            <div className="followers-header">
                <h1 className="followers-headline">Community Management</h1>
                <p className="followers-subtitle">
                    Manage and engage with your astronomy community
                </p>
            </div>
            
            <div className="followers-stats">
                <div className="stat-card">
                    <h3>Total Followers</h3>
                    <span className="stat-number">{followers.length}</span>
                </div>
                <div className="stat-card">
                    <h3>Pending Requests</h3>
                    <span className="stat-number">{followRequests.length}</span>
                </div>
                <div className="stat-card">
                    <h3>Unread Messages</h3>
                    <span className="stat-number">{messages.filter(m => m.unread).length}</span>
                </div>
            </div>

            <div className="followers-tabs">
                <button 
                    className={`tab-button ${activeTab === 'followers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('followers')}
                >
                    My Followers ({followers.length})
                </button>
                <button 
                    className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Follow Requests ({followRequests.length})
                </button>
                <button 
                    className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
                    onClick={() => setActiveTab('messages')}
                >
                    Messenger Center ({messages.filter(m => m.unread).length})
                </button>
            </div>

            <div className="followers-content">
                {activeTab === 'followers' && (
                    <div className="followers-list">
                        <h2>My Followers</h2>
                        {followers.length > 0 ? (
                            <div className="followers-grid">
                                {followers.map(follower => (
                                    <div key={follower.id} className="follower-card">
                                        <div className="follower-avatar">
                                            <img src={follower.avatar} alt={follower.name} />
                                            <span className={`status-indicator ${follower.isActive ? 'online' : 'offline'}`}></span>
                                        </div>
                                        <div className="follower-info">
                                            <h4>{follower.name}</h4>
                                            <p>Followed on {new Date(follower.followedDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="follower-actions">
                                            <button className="btn-message" onClick={() => openChat(follower.id)}>
                                                Message
                                            </button>
                                            <button className="btn-view-profile">
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-followers">
                                <p>No followers yet. Start creating amazing astronomy content to build your community!</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="follow-requests">
                        <h2>Follow Requests</h2>
                        {followRequests.length > 0 ? (
                            <div className="requests-list">
                                {followRequests.map(request => (
                                    <div key={request.id} className="request-card">
                                        <div className="request-avatar">
                                            <img src={request.avatar} alt={request.name} />
                                        </div>
                                        <div className="request-info">
                                            <h4>{request.name}</h4>
                                            <p>{request.mutualFollowers} mutual followers</p>
                                            <span className="request-date">Requested {new Date(request.requestDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="request-actions">
                                            <button 
                                                className="btn-accept"
                                                onClick={() => handleAcceptRequest(request.id)}
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                className="btn-decline"
                                                onClick={() => handleDeclineRequest(request.id)}
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-requests">
                                <p>No pending follow requests.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="messenger-center">
                        <h2>Messenger Center</h2>
                        {messages.length > 0 ? (
                            <div className="messages-list">
                                {messages.map(message => (
                                    <div 
                                        key={message.id} 
                                        className={`message-card ${message.unread ? 'unread' : ''}`}
                                        onClick={() => openChat(message.id)}
                                    >
                                        <div className="message-avatar">
                                            <img src={message.avatar} alt={message.sender} />
                                            {message.unread && <span className="unread-indicator"></span>}
                                        </div>
                                        <div className="message-info">
                                            <h4>{message.sender}</h4>
                                            <p className="last-message">{message.lastMessage}</p>
                                            <span className="message-time">{message.timestamp}</span>
                                        </div>
                                        <div className="message-actions">
                                            <button className="btn-reply">Reply</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-messages">
                                <p>No messages yet. Start conversations with your followers!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Followers;
