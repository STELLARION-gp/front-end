import React, { useState } from 'react';
import { Star, MessageCircle, Share2, Bookmark, MoreHorizontal, Camera, Edit3, Check, X, User, Calendar, MapPin, Plus, Image } from 'lucide-react';
import { color } from 'framer-motion';

// Enhanced feed data with more realistic social media content
const enhancedFeed = [
    {
        id: 1,
        content: "Captured the Orion Nebula last night! 🌌 The detail you can see in the trapezium cluster is absolutely breathtaking. This 3-hour exposure really paid off!",
        image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=400&fit=crop",
        likes: 1847,
        comments: 23,
        timestamp: "2 hours ago",
        liked: false,
        bookmarked: false
    },
    {
        id: 2,
        content: "Exploring the surface of Mars through my telescope. Can you spot Olympus Mons? 🔴 The atmospheric conditions tonight are perfect for planetary observation!",
        image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&h=400&fit=crop",
        likes: 934,
        comments: 15,
        timestamp: "6 hours ago",
        liked: true,
        bookmarked: true
    },
    {
        id: 3,
        content: "Live Q&A about black holes this Friday! 🕳️ Drop your questions below and I'll answer them during the stream. From event horizons to Hawking radiation - let's explore the cosmos together!",
        image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=500&h=400&fit=crop",
        likes: 2156,
        comments: 89,
        timestamp: "1 day ago",
        liked: false,
        bookmarked: false
    },
    {
        id: 4,
        content: "Saturn's rings are looking absolutely stunning tonight! 🪐 The Cassini Division is clearly visible. Perfect seeing conditions for anyone with a telescope!",
        image: "https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=500&h=400&fit=crop",
        likes: 1523,
        comments: 31,
        timestamp: "2 days ago",
        liked: true,
        bookmarked: false
    }
];

function ProfilePage() {
    // Profile state
    const [profilePic, setProfilePic] = useState("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face");
    const [editingPic, setEditingPic] = useState(false);
    const [name, setName] = useState("StellarExplorer");
    const [editingName, setEditingName] = useState(false);
    const [bio, setBio] = useState("Astronomy influencer sharing the wonders of the universe. Stargazer, astrophotographer, and science communicator.");
    const [editingBio, setEditingBio] = useState(false);
    const [followers, setFollowers] = useState(12800);
    const [following, setFollowing] = useState(847);
    const [posts, setPosts] = useState(156);
    const [isFollowing, setIsFollowing] = useState(false);
    
    // Feed state
    const [feedData, setFeedData] = useState(enhancedFeed);
    
    // Post creation state
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostImage, setNewPostImage] = useState(null);

    // Handlers
    const handlePicChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setProfilePic(ev.target.result);
            reader.readAsDataURL(e.target.files[0]);
        }
        setEditingPic(false);
    };

    const handleLike = (postId) => {
        setFeedData(prevFeed => 
            prevFeed.map(post => 
                post.id === postId 
                    ? { 
                        ...post, 
                        liked: !post.liked, 
                        likes: post.liked ? post.likes - 1 : post.likes + 1 
                    }
                    : post
            )
        );
    };

    const handleBookmark = (postId) => {
        setFeedData(prevFeed => 
            prevFeed.map(post => 
                post.id === postId 
                    ? { ...post, bookmarked: !post.bookmarked }
                    : post
            )
        );
    };

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        setFollowers(prev => isFollowing ? prev - 1 : prev + 1);
    };

    const handleCreatePost = () => {
        if (newPostContent.trim()) {
            const newPost = {
                id: Date.now(),
                content: newPostContent,
                image: newPostImage || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 9999999999999)}?w=500&h=400&fit=crop`,
                likes: 0,
                comments: 0,
                timestamp: "now",
                liked: false,
                bookmarked: false
            };
            setFeedData(prev => [newPost, ...prev]);
            setPosts(prev => prev + 1);
            setNewPostContent('');
            setNewPostImage(null);
            setShowCreatePost(false);
        }
    };

    const handlePostImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setNewPostImage(ev.target.result);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div style={{ 
            maxWidth: 600, 
            margin: "0 auto", 
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            backgroundColor: "transparent",
            minHeight: "100vh"
        }}>
            {/* Header */}
            <div style={{ 
                backgroundColor: "transparent", 
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                padding: "16px 24px",
                position: "sticky",
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: "white" }}>
                        {name}
                    </h1>
                    <button 
                        onClick={() => setShowCreatePost(true)}
                        style={{
                            backgroundColor: "transparent",
                            color: "white",
                            border: '2px solid white',
                            padding: "8px 16px",
                            borderRadius: 10,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                        }}
                    >
                        <Plus size={16} />
                        Create Post
                    </button>
                </div>
            </div>

            {/* Profile Section */}
            <div style={{ 
                backgroundColor: "transparent", 
                backdropFilter: "blur(10px)",
                padding: 24, 
                borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                marginBottom: 0
            }}>
                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 20 }}>
                    {/* Profile Picture */}
                    <div style={{ position: "relative", marginRight: 24 }}>
                        <img
                            src={profilePic}
                            alt="Profile"
                            style={{ 
                                width: 120, 
                                height: 120, 
                                borderRadius: "50%", 
                                objectFit: "cover",
                                border: "3px solid #e0e0e0"
                            }}
                        />
                        {editingPic && (
                            <div style={{ 
                                position: "absolute", 
                                bottom: 0, 
                                right: 0, 
                                backgroundColor: "white", 
                                borderRadius: "50%",
                                padding: 8,
                                border: "2px solid #e0e0e0"
                            }}>
                                <Camera size={16} style={{ color: "#666" }} />
                            </div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                            {editingName ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        style={{ 
                                            fontSize: 20, 
                                            fontWeight: 600,
                                            border: "1px solid #ddd",
                                            borderRadius: 4,
                                            padding: "6px 12px"
                                        }}
                                    />
                                    <button 
                                        onClick={() => setEditingName(false)}
                                        style={{ 
                                            background: "none", 
                                            border: "none", 
                                            cursor: "pointer",
                                            color: "#0095f6"
                                        }}
                                    >
                                        <Check size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#262626" }}>
                                        {name}
                                    </h2>
                                    <button 
                                        onClick={() => setEditingName(true)}
                                        style={{ 
                                            background: "none", 
                                            border: "none", 
                                            cursor: "pointer",
                                            color: "#666"
                                        }}
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontWeight: 600, color: "#262626" }}>{posts}</div>
                                <div style={{ fontSize: 14, color: "#8e8e8e" }}>posts</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontWeight: 600, color: "#262626" }}>{followers.toLocaleString()}</div>
                                <div style={{ fontSize: 14, color: "#8e8e8e" }}>followers</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontWeight: 600, color: "#262626" }}>{following}</div>
                                <div style={{ fontSize: 14, color: "#8e8e8e" }}>following</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: 8 }}>
                            <button 
                                onClick={handleFollow}
                                style={{
                                    backgroundColor: isFollowing ? "#fafafa" : "#0095f6",
                                    color: isFollowing ? "#262626" : "white",
                                    border: isFollowing ? "1px solid #ddd" : "none",
                                    padding: "8px 16px",
                                    borderRadius: 4,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                            <button 
                                onClick={() => setEditingPic(!editingPic)}
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#262626",
                                    border: "1px solid #ddd",
                                    padding: "8px 16px",
                                    borderRadius: 4,
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer"
                                }}
                            >
                                Edit Profile
                            </button>
                        </div>

                        {editingPic && (
                            <div style={{ marginTop: 12 }}>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handlePicChange}
                                    style={{ fontSize: 12 }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Bio */}
                <div style={{ marginBottom: 16 }}>
                    {editingBio ? (
                        <div>
                            <textarea
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                rows={3}
                                style={{ 
                                    width: "100%", 
                                    border: "1px solid #ddd",
                                    borderRadius: 4,
                                    padding: 8,
                                    fontSize: 14,
                                    resize: "vertical"
                                }}
                            />
                            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                                <button 
                                    onClick={() => setEditingBio(false)}
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "white",
                                        border: "none",
                                        padding: "6px 12px",
                                        borderRadius: 4,
                                        fontSize: 12,
                                        cursor: "pointer"
                                    }}
                                >
                                    Save
                                </button>
                                <button 
                                    onClick={() => setEditingBio(false)}
                                    style={{
                                        backgroundColor: "transparent",
                                        color: "#262626",
                                        border: "1px solid #ddd",
                                        padding: "6px 12px",
                                        borderRadius: 4,
                                        fontSize: 12,
                                        cursor: "pointer"
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p style={{ 
                                margin: 0, 
                                fontSize: 14, 
                                lineHeight: 1.4, 
                                color: "#262626",
                                marginBottom: 8
                            }}>
                                {bio}
                            </p>
                            <button 
                                onClick={() => setEditingBio(true)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#0095f6",
                                    fontSize: 12,
                                    cursor: "pointer",
                                    padding: 0
                                }}
                            >
                                Edit bio
                            </button>
                        </div>
                    )}
                </div>

                {/* Profile Details */}
                <div style={{ fontSize: 14, color: "#8e8e8e", display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} />
                        <span>Los Angeles, CA</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Calendar size={14} />
                        <span>Joined March 2020</span>
                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            {showCreatePost && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "transparent",
                        borderRadius: 12,
                        padding: 24,
                        width: "90%",
                        maxWidth: 500,
                        maxHeight: "80vh",
                        overflow: "auto"
                    }}>
                        <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "space-between",
                            marginBottom: 20
                        }}>
                            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#262626" }}>
                                Create New Post
                            </h2>
                            <button 
                                onClick={() => setShowCreatePost(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#8e8e8e"
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                                <img
                                    src={profilePic}
                                    alt="Profile"
                                    style={{ 
                                        width: 40, 
                                        height: 40, 
                                        borderRadius: "50%", 
                                        objectFit: "cover",
                                        marginRight: 12
                                    }}
                                />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 14, color: "#262626" }}>
                                        {name}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#8e8e8e" }}>
                                        Public post
                                    </div>
                                </div>
                            </div>

                            <textarea
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                placeholder="What's on your mind about the cosmos?"
                                style={{
                                    width: "100%",
                                    minHeight: 120,
                                    border: "none",
                                    outline: "none",
                                    fontSize: 16,
                                    resize: "none",
                                    fontFamily: "inherit"
                                }}
                            />
                        </div>

                        {newPostImage && (
                            <div style={{ marginBottom: 16 }}>
                                <img
                                    src={newPostImage}
                                    alt="Post preview"
                                    style={{
                                        width: "100%",
                                        maxHeight: 200,
                                        objectFit: "cover",
                                        borderRadius: 8
                                    }}
                                />
                                <button
                                    onClick={() => setNewPostImage(null)}
                                    style={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        background: "rgba(0, 0, 0, 0.5)",
                                        color: "transparent",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 24,
                                        height: 24,
                                        cursor: "pointer"
                                    }}
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}

                        <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "space-between",
                            padding: "12px 16px",
                            border: "1px solid #e0e0e0",
                            borderRadius: 8,
                            marginBottom: 16
                        }}>
                            <span style={{ fontSize: 14, color: "#262626" }}>
                                Add to your post
                            </span>
                            <label style={{ cursor: "pointer" }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePostImageChange}
                                    style={{ display: "none" }}
                                />
                                <Image size={20} style={{ color: "#42b883" }} />
                            </label>
                        </div>

                        <button
                            onClick={handleCreatePost}
                            disabled={!newPostContent.trim()}
                            style={{
                                width: "100%",
                                backgroundColor: newPostContent.trim() ? "#0095f6" : "transparent",
                                color: newPostContent.trim() ? "white" : "#8e8e8e",
                                border: "none",
                                padding: "12px",
                                borderRadius: 6,
                                fontSize: 16,
                                fontWeight: 600,
                                cursor: newPostContent.trim() ? "pointer" : "not-allowed"
                            }}
                        >
                            Post
                        </button>
                    </div>
                </div>
            )}

            {/* Feed */}
            <div style={{ backgroundColor: "transparent" }}>
                {feedData.map(post => (
                    <div key={post.id} style={{ 
                        backgroundColor: "transparent", 
                        backdropFilter: "blur(10px)",
                        marginBottom: 12,
                        border: "1px solid rgba(224, 224, 224, 0.5)",
                        borderRadius: 8
                    }}>
                        {/* Post Header */}
                        <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            padding: "12px 16px",
                            borderBottom: "1px solid #f0f0f0"
                        }}>
                            <img
                                src={profilePic}
                                alt="Profile"
                                style={{ 
                                    width: 32, 
                                    height: 32, 
                                    borderRadius: "50%", 
                                    objectFit: "cover",
                                    marginRight: 12
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: "#262626" }}>
                                    {name}
                                </div>
                                <div style={{ fontSize: 12, color: "#8e8e8e" }}>
                                    {post.timestamp}
                                </div>
                            </div>
                            <button style={{ 
                                background: "none", 
                                border: "none", 
                                cursor: "pointer",
                                color: "#8e8e8e"
                            }}>
                                <MoreHorizontal size={16} />
                            </button>
                        </div>

                        {/* Post Image */}
                        <div style={{ position: "relative" }}>
                            <img
                                src={post.image}
                                alt="Post"
                                style={{ 
                                    width: "100%", 
                                    height: 400, 
                                    objectFit: "cover",
                                    display: "block"
                                }}
                            />
                        </div>

                        {/* Post Actions */}
                        <div style={{ padding: "12px 16px" }}>
                            <div style={{ 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "space-between",
                                marginBottom: 12
                            }}>
                                <div style={{ display: "flex", gap: 16 }}>
                                    <button 
                                        onClick={() => handleLike(post.id)}
                                        style={{ 
                                            background: "none", 
                                            border: "none", 
                                            cursor: "pointer",
                                            color: post.liked ? "#ed4956" : "#262626"
                                        }}
                                    >
                                        <Star size={24} fill={post.liked ? "#ed4956" : "none"} />
                                    </button>
                                    <button style={{ 
                                        background: "transparent", 
                                        border: "none", 
                                        cursor: "pointer",
                                        color: "white"
                                    }}>
                                        <MessageCircle size={24} />
                                    </button>
                                    <button style={{ 
                                        background: "transparent", 
                                        border: "none", 
                                        cursor: "pointer",
                                        color: "white"
                                    }}>
                                        <Share2 size={24} />
                                    </button>
                                </div>
                                <button 
                                    onClick={() => handleBookmark(post.id)}
                                    style={{ 
                                        background: "transparent", 
                                        border: "none", 
                                        cursor: "pointer",
                                        color: "white"
                                    }}
                                >
                                    <Bookmark size={24} fill={post.bookmarked ? "#262626" : "none"} />
                                </button>
                            </div>

                            {/* Likes */}
                            <div style={{ 
                                fontWeight: 600, 
                                fontSize: 14, 
                                color: "transparent",
                                marginBottom: 8
                            }}>
                                {post.likes.toLocaleString()} likes
                            </div>

                            {/* Caption */}
                            <div style={{ fontSize: 14, color: "white", lineHeight: 1.4 }}>
                                <span style={{ fontWeight: 600 }}>{name}</span> {post.content}
                            </div>

                            {/* Comments */}
                            <div style={{ 
                                fontSize: 14, 
                                color: "#8e8e8e",
                                marginTop: 8,
                                cursor: "pointer"
                            }}>
                                View all {post.comments} comments
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProfilePage;