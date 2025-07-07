import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Users, 
  MapPin, 
  Calendar, 
  Star, 
  MessageCircle, 
  Settings,
  Info
} from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import '../../styles/pages/guide/_tourChat.scss';

// Types
interface TourMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'guide' | 'member';
  isOnline: boolean;
  lastSeen?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'guide' | 'member';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'location' | 'system';
  isRead: boolean;
}

interface TourInfo {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  memberCount: number;
  status: 'upcoming' | 'in-progress' | 'completed';
}

const TourChat: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // State
  const [tourId] = useState(searchParams.get('tourId') || '1');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [members, setMembers] = useState<TourMember[]>([]);
  const [tourInfo, setTourInfo] = useState<TourInfo | null>(null);
  const [isTyping] = useState<string[]>([]);
  const [showMembersList, setShowMembersList] = useState(false);
  const [showTourInfo, setShowTourInfo] = useState(false);

  // Mock data initialization
  useEffect(() => {
    // Mock tour info
    const mockTourInfo: TourInfo = {
      id: tourId,
      name: 'Deep Space Observation Tour',
      date: '2025-07-05',
      startTime: '20:00',
      endTime: '23:00',
      location: 'Mount Stellar Observatory',
      memberCount: 8,
      status: 'upcoming'
    };
    setTourInfo(mockTourInfo);

    // Mock members
    const mockMembers: TourMember[] = [
      {
        id: 'guide-1',
        name: 'Dr. Sarah Mitchell',
        role: 'guide',
        isOnline: true,
      },
      {
        id: 'member-1',
        name: 'Emily Chen',
        role: 'member',
        isOnline: true,
      },
      {
        id: 'member-2',
        name: 'Marcus Rodriguez',
        role: 'member',
        isOnline: true,
      },
      {
        id: 'member-3',
        name: 'Sarah Thompson',
        role: 'member',
        isOnline: false,
        lastSeen: '2 minutes ago'
      },
      {
        id: 'member-4',
        name: 'Alex Kim',
        role: 'member',
        isOnline: true,
      },
      {
        id: 'member-5',
        name: 'Lisa Wong',
        role: 'member',
        isOnline: false,
        lastSeen: '1 hour ago'
      },
      {
        id: 'member-6',
        name: 'David Johnson',
        role: 'member',
        isOnline: true,
      },
      {
        id: 'member-7',
        name: 'Maya Patel',
        role: 'member',
        isOnline: false,
        lastSeen: '5 minutes ago'
      }
    ];
    setMembers(mockMembers);

    // Mock messages
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: 'guide-1',
        senderName: 'Dr. Sarah Mitchell',
        senderRole: 'guide',
        content: 'Welcome everyone to our Deep Space Observation Tour chat! I\'m excited to explore the cosmos with you all tonight. 🌌',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        isRead: true
      },
      {
        id: '2',
        senderId: 'member-1',
        senderName: 'Emily Chen',
        senderRole: 'member',
        content: 'Thank you Dr. Mitchell! I\'ve been looking forward to this all week. What equipment should we bring?',
        timestamp: new Date(Date.now() - 3500000),
        type: 'text',
        isRead: true
      },
      {
        id: '3',
        senderId: 'guide-1',
        senderName: 'Dr. Sarah Mitchell',
        senderRole: 'guide',
        content: 'Great question Emily! Bring warm clothes, a red flashlight if you have one, and a notebook. All telescopes and advanced equipment will be provided. ✨',
        timestamp: new Date(Date.now() - 3400000),
        type: 'text',
        isRead: true
      },
      {
        id: '4',
        senderId: 'member-2',
        senderName: 'Marcus Rodriguez',
        senderRole: 'member',
        content: 'Should we meet at the main observatory entrance?',
        timestamp: new Date(Date.now() - 3200000),
        type: 'text',
        isRead: true
      },
      {
        id: '5',
        senderId: 'guide-1',
        senderName: 'Dr. Sarah Mitchell',
        senderRole: 'guide',
        content: 'Yes Marcus! Meet at the main entrance. I\'ll be there 15 minutes early to set up. Looking for Saturn\'s rings tonight - the conditions are perfect! 🪐',
        timestamp: new Date(Date.now() - 3000000),
        type: 'text',
        isRead: true
      },
      {
        id: '6',
        senderId: 'member-4',
        senderName: 'Alex Kim',
        senderRole: 'member',
        content: 'This is my first stargazing tour! Any tips for a beginner?',
        timestamp: new Date(Date.now() - 2800000),
        type: 'text',
        isRead: true
      },
      {
        id: '7',
        senderId: 'guide-1',
        senderName: 'Dr. Sarah Mitchell',
        senderRole: 'guide',
        content: 'Welcome Alex! Perfect timing - tonight is ideal for beginners. We\'ll start with easy targets like the Moon and Jupiter before moving to more challenging deep-sky objects. Don\'t worry, I\'ll guide you through everything! 🔭',
        timestamp: new Date(Date.now() - 2700000),
        type: 'text',
        isRead: true
      }
    ];
    setMessages(mockMessages);
  }, [tourId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'guide-1', // Current user (guide)
      senderName: 'Dr. Sarah Mitchell',
      senderRole: 'guide',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Focus back to input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const onlineMembers = members.filter(m => m.isOnline);

  return (
    <div className="tour-chat-page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="tour-chat-header"
      >
        <div className="header-left">
          <Button
            variant="secondary"
            size="small"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
            className="back-button"
          >
            Back
          </Button>
          
          <div className="tour-header-info">
            <h1 className="tour-title">{tourInfo?.name}</h1>
            <div className="tour-meta">
              <div className="tour-meta-item">
                <Calendar className="w-4 h-4" />
                <span>{tourInfo?.date} • {tourInfo?.startTime}-{tourInfo?.endTime}</span>
              </div>
              <div className="tour-meta-item">
                <MapPin className="w-4 h-4" />
                <span>{tourInfo?.location}</span>
              </div>
              <div className="tour-meta-item">
                <Users className="w-4 h-4" />
                <span>{onlineMembers.length}/{tourInfo?.memberCount} online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <Button
            variant="ghost"
            size="small"
            icon={<Users className="w-4 h-4" />}
            onClick={() => setShowMembersList(!showMembersList)}
            className={showMembersList ? 'active' : ''}
          >
            Members
          </Button>
          <Button
            variant="ghost"
            size="small"
            icon={<Info className="w-4 h-4" />}
            onClick={() => setShowTourInfo(!showTourInfo)}
            className={showTourInfo ? 'active' : ''}
          >
            Info
          </Button>
        </div>
      </motion.div>

      <div className="tour-chat-layout">
        {/* Main Chat Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="chat-main"
        >
          <Card className="chat-container" variant="outlined">
            {/* Messages */}
            <div className="chat-messages">
              {messages.length > 0 ? (
                messages.map((message, index) => {
                  const showDateSeparator = index === 0 || 
                    formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);
                  
                  return (
                    <div key={message.id}>
                      {showDateSeparator && (
                        <div className="date-separator">
                          <span>{formatDate(message.timestamp)}</span>
                        </div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`message ${message.senderRole === 'guide' ? 'own-message' : 'other-message'}`}
                      >
                        <div className="message-avatar">
                          <div className={`avatar ${message.senderRole}`}>
                            {getInitials(message.senderName)}
                            {message.senderRole === 'guide' && (
                              <div className="guide-badge">
                                <Star className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="message-content">
                          <div className="message-header">
                            <span className={`sender-name ${message.senderRole}`}>
                              {message.senderName}
                            </span>
                            <span className="message-time">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div className="message-text">
                            {message.content}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })
              ) : (
                <div className="chat-empty">
                  <MessageCircle className="w-12 h-12 text-slate-400" />
                  <h3>Start the conversation</h3>
                  <p>Send a message to begin chatting with your tour members</p>
                </div>
              )}
              
              {/* Typing indicators */}
              {isTyping.length > 0 && (
                <div className="typing-indicators">
                  {isTyping.map(memberName => (
                    <div key={memberName} className="typing-indicator">
                      <span>{memberName} is typing</span>
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="chat-input-area">
              <div className="input-container">
                <textarea
                  ref={inputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message to the tour group..."
                  className="message-input"
                  rows={1}
                  disabled={tourInfo?.status === 'completed'}
                />
                <Button
                  variant="primary"
                  size="small"
                  icon={<Send className="w-4 h-4" />}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || tourInfo?.status === 'completed'}
                  className="send-button"
                >
                  Send
                </Button>
              </div>
              {tourInfo?.status === 'completed' && (
                <div className="chat-disabled-notice">
                  This tour has ended. Chat is now read-only.
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Side Panels */}
        <AnimatePresence>
          {/* Members List */}
          {showMembersList && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="members-panel"
            >
              <Card className="members-container" variant="outlined">
                <div className="panel-header">
                  <h3>Tour Members</h3>
                  <span className="member-count">{members.length}</span>
                </div>
                
                <div className="members-list">
                  {members.map(member => (
                    <div key={member.id} className="member-item">
                      <div className="member-avatar">
                        <div className={`avatar ${member.role}`}>
                          {getInitials(member.name)}
                          {member.role === 'guide' && (
                            <div className="guide-badge">
                              <Star className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className={`status-dot ${member.isOnline ? 'online' : 'offline'}`} />
                      </div>
                      
                      <div className="member-info">
                        <span className="member-name">{member.name}</span>
                        <span className={`member-role ${member.role}`}>
                          {member.role === 'guide' ? 'Tour Guide' : 'Participant'}
                        </span>
                        {!member.isOnline && member.lastSeen && (
                          <span className="last-seen">Last seen {member.lastSeen}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Tour Info Panel */}
          {showTourInfo && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="tour-info-panel"
            >
              <Card className="tour-info-container" variant="outlined">
                <div className="panel-header">
                  <h3>Tour Information</h3>
                  <div className={`status-badge ${tourInfo?.status}`}>
                    {tourInfo?.status?.replace('-', ' ')}
                  </div>
                </div>
                
                <div className="tour-details">
                  <div className="detail-item">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <label>Date & Time</label>
                      <span>{tourInfo?.date}</span>
                      <span>{tourInfo?.startTime} - {tourInfo?.endTime}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <MapPin className="w-5 h-5" />
                    <div>
                      <label>Location</label>
                      <span>{tourInfo?.location}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <Users className="w-5 h-5" />
                    <div>
                      <label>Participants</label>
                      <span>{tourInfo?.memberCount} members</span>
                      <span>{onlineMembers.length} currently online</span>
                    </div>
                  </div>
                </div>

                <div className="tour-actions">
                  <Button variant="secondary" size="small" className="tour-action-btn">
                    <Settings className="w-4 h-4" />
                    Tour Settings
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TourChat;
