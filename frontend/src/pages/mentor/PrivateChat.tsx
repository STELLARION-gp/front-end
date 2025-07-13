import React, { useState, useRef, useEffect, useCallback } from "react";
import "../../styles/pages/mentor/PrivateChat.scss";
import { 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  PhoneIcon, 
  VideoCameraIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  CameraIcon,
  MicrophoneIcon,
  SpeakerXMarkIcon,
  MicrophoneIcon as MicIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import menteeImg from '../../assets/signup.jpg';

interface Message {
  id: number;
  sender: "mentor" | "mentee";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  audioUrl?: string; // Add audio URL for voice messages
  isVoiceMessage?: boolean;
}

const mentee = {
  name: "Luna Skywatchet",
  img: menteeImg,
  status: "online",
  lastSeen: "Just now"
};

const initialMessages: Message[] = [
  { id: 1, sender: "mentor", text: "Hi Luna! Ready for today's session?", time: "10:30 AM", status: "read" },
  { id: 2, sender: "mentee", text: "Yes, I'm excited!", time: "10:31 AM" },
  { id: 3, sender: "mentor", text: "Great! Let's start with some questions.", time: "10:32 AM", status: "delivered" },
  { id: 4, sender: "mentee", text: "Sure!", time: "10:32 AM" },
  { 
    id: 5, 
    sender: "mentee", 
    text: "I've been working on the project you suggested and made some good progress.", 
    time: "10:33 AM" 
  },
  { 
    id: 6, 
    sender: "mentor", 
    text: "That's fantastic news! Would love to see what you've accomplished.", 
    time: "10:35 AM",
    status: "sent"
  },
];

const emojiGrid = [
  "😀","🙌","👏","👋","💪","🥳","👩‍🎓","👨‍🎓","👩‍🏫","👨‍🏫","❤️","💜","🚀","🌕","🥇","📚","👩‍🚀","👨‍🚀","⭐","💫","🌟","✨","🌠","🌃","😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥺", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"
];

const attachmentOptions = [
  { type: "document", label: "Document", icon: <DocumentTextIcon width={24} /> },
  { type: "image", label: "Image", icon: <PhotoIcon width={24} /> },
  { type: "video", label: "Video", icon: <FilmIcon width={24} /> },
  { type: "audio", label: "Audio", icon: <MusicalNoteIcon width={24} /> },
];

// Call popup components
const VoiceCallPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  
  return (
    <div className="call-popup voice-call">
      <div className="popup-content">
        <div className="call-header">
          <h2>Voice Call</h2>
          <button onClick={onClose}><XMarkIcon width={32} /></button>
        </div>
        <div className="call-body">
          <div className="user-avatar">
            <img src={menteeImg} alt={mentee.name} />
            <div className="user-name">{mentee.name}</div>
            <div className="call-status">Ringing...</div>
          </div>
          <div className="call-controls">
            <button 
              className={`control-btn mic ${!isMicOn ? 'off' : ''}`} 
              onClick={() => setIsMicOn(!isMicOn)}
            >
              <MicIcon width={32} />
            </button>
            <button 
              className={`control-btn mute ${isMuted ? 'muted' : ''}`} 
              onClick={() => setIsMuted(!isMuted)}
            >
              <SpeakerXMarkIcon width={32} />
            </button>
            <button className="control-btn decline" onClick={onClose}>
              <PhoneIcon width={32} />
            </button>
            {/* <button className="control-btn accept">
              <PhoneIcon width={32} />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoCallPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  
  return (
    <div className="call-popup video-call">
      <div className="popup-content">
        <div className="call-header">
          <h2>Video Call</h2>
          <button onClick={onClose}><XMarkIcon width={32} /></button>
        </div>
        <div className="call-body">
          <div className="video-container">
            <div className="remote-video">
              <div className="user-avatar">
                <img src={menteeImg} alt={mentee.name} />
              </div>
              <div className="user-name">{mentee.name}</div>
              <div className="call-status">Ringing...</div>
            </div>
            <div className={`local-video ${cameraActive ? 'active' : ''}`}>
              {cameraActive ? (
                <div className="camera-feed">Camera Feed</div>
              ) : (
                <div className="camera-placeholder">Camera Off</div>
              )}
            </div>
          </div>
          <div className="call-controls">
            <button className="control-btn camera" onClick={() => setCameraActive(!cameraActive)}>
              <CameraIcon width={32} />
            </button>
            <button 
              className={`control-btn mic ${!isMicOn ? 'off' : ''}`} 
              onClick={() => setIsMicOn(!isMicOn)}
            >
              <MicIcon width={32} />
            </button>
            <button 
              className={`control-btn mute ${isMuted ? 'muted' : ''}`} 
              onClick={() => setIsMuted(!isMuted)}
            >
              <SpeakerXMarkIcon width={32} />
            </button>
            <button className="control-btn decline" onClick={onClose}>
              <PhoneIcon width={32} />
            </button>
            {/* <button className="control-btn accept">
              <VideoCameraIcon width={32} />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const PrivateChat: React.FC = () => {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [searchMsg, setSearchMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showVoiceCall, setShowVoiceCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Simulate typing indicator
  useEffect(() => {
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
    
    return () => clearTimeout(typingTimer);
  }, [isTyping]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll position
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const scrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollDown(scrolledUp);
    }
  }, []);

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle send message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "mentor",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setShowEmoji(false);
    
    // Simulate mentee response after delay
    setTimeout(() => {
      setIsTyping(true);
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "mentee",
            text: "Thanks for your feedback!",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      }, 2000);
    }, 1000);
  };

  // Handle attachment selection
  const handleAttachment = (type: string) => {
    setShowAttach(false);
    alert(`Selected attachment type: ${type}`);
  };

  // Handle voice recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setShowAttach(false);
    setShowEmoji(false);
    
    // Start recording timer
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // In a real app, this would start actual audio recording
    alert("Voice recording started! In a real app, this would record audio.");
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    
    // In a real app, this would stop recording and send the audio
    const duration = recordingTime;
    setRecordingTime(0);
    
    if (duration > 0) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "mentor",
        text: `🎤 Voice message (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sent",
        isVoiceMessage: true
      };
      
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  // Play audio message
  const playAudioMessage = (audioUrl: string) => {
    alert("Playing voice message! In a real app, this would play the recorded audio.");
  };

  // Activate camera
  const activateCamera = () => {
    setCameraActive(true);
    alert("Camera activated! In a real app, this would show your camera feed.");
  };

  // Render message status icon
  const renderStatusIcon = (status?: string) => {
    switch (status) {
      case "sent":
        return <CheckCircleIcon className="status-icon" width={16} />;
      case "delivered":
        return <CheckCircleIcon className="status-icon delivered" width={16} />;
      case "read":
        return <CheckCircleSolid className="status-icon read" width={16} />;
      default:
        return null;
    }
  };

  // Highlight search matches
  const highlightSearch = (text: string) => {
    if (!searchMsg.trim()) return text;
    
    const regex = new RegExp(`(${searchMsg})`, "gi");
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) 
        ? <mark key={i} className="search-highlight">{part}</mark> 
        : part
    );
  };

  return (
    <div className="private-chat-page dark">
      {/* Voice Call Popup */}
      {showVoiceCall && <VoiceCallPopup onClose={() => setShowVoiceCall(false)} />}
      
      {/* Video Call Popup */}
      {showVideoCall && <VideoCallPopup onClose={() => setShowVideoCall(false)} />}
      
      {/* Main Chat Area */}
      <main className="private-chat__main">
        <div className="private-chat__header">
          <div className="chat-header-left">
            <div className="avatar-container">
              <img src={mentee.img} alt={mentee.name} className="private-chat__mentee-avatar" />
              <div className={`status-indicator ${mentee.status}`} />
            </div>
            <div className="chat-header-info">
              <span className="private-chat__chat-title">{mentee.name}</span>
              <div className="private-chat__mentee-status">
                {mentee.status} • {mentee.lastSeen}
              </div>
            </div>
          </div>
          
          <div className="private-chat__header-search">
            <MagnifyingGlassIcon width={24} height={24} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search messages"
              value={searchMsg}
              onChange={e => setSearchMsg(e.target.value)}
            />
            {searchMsg && (
              <button 
                className="clear-search"
                onClick={() => setSearchMsg("")}
              >
                <XMarkIcon width={20} />
              </button>
            )}
          </div>
          
          <div className="private-chat__header-actions">
            <button onClick={() => setShowVoiceCall(true)}>
              <PhoneIcon width={36} height={36} className="action-icon" />
            </button>
            <button onClick={() => setShowVideoCall(true)}>
              <VideoCameraIcon width={36} height={36} className="action-icon" />
            </button>
            <div className="options-container">
              <button onClick={() => setShowOptions(!showOptions)}>
                <EllipsisVerticalIcon width={36} height={36} className="action-icon" />
              </button>
              {showOptions && (
                <div className="options-dropdown">
                  <button>View Profile</button>
                  <button>Clear Chat</button>
                  <button>Mute Notifications</button>
                  <button>Report</button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div 
          className="private-chat__messages"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {messages.map((msg) => (
            <div 
              className={`private-chat__message private-chat__message--${msg.sender}`} 
              key={msg.id}
            >
              <span className="private-chat__message-text">
                {highlightSearch(msg.text)}
              </span>
              {msg.isVoiceMessage && (
                <button 
                  className="play-audio-btn"
                  onClick={() => playAudioMessage("")}
                >
                  ▶️ Play Voice Message
                </button>
              )}
              <div className="message-meta">
                <span className="message-time">{msg.time}</span>
                {msg.sender === "mentor" && (
                  <span className="message-status">
                    {renderStatusIcon(msg.status)}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="private-chat__message private-chat__message--mentee">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {showScrollDown && (
          <button 
            className="scroll-down-button"
            onClick={scrollToBottom}
          >
            ↓ New Messages
          </button>
        )}
        
        <form className="private-chat__input-bar" onSubmit={handleSend}>
          <div className="private-chat__input-bar-left">
            <button 
              type="button" 
              className={`private-chat__emoji ${showEmoji ? 'active' : ''}`}
              onClick={() => {
                setShowEmoji(v => !v);
                setShowAttach(false);
              }}
            >
              😊
            </button>
            
            {showEmoji && (
              <div className="private-chat__emoji-list custom-emoji-grid">
                <div className="emoji-header">
                  <span>Emojis</span>
                  <button onClick={() => setShowEmoji(false)}>
                    <XMarkIcon width={24} className="action-icon" />
                  </button>
                </div>
                <div className="emoji-grid">
                  {emojiGrid.map((em, i) => (
                    <span
                      key={i}
                      className="custom-emoji-item"
                      onClick={() => { 
                        setInput(input + em); 
                        setShowEmoji(false);
                      }}
                    >
                      {em}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <input
            className="private-chat__input"
            type="text"
            placeholder="Message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => {
              setShowEmoji(false);
              setShowAttach(false);
            }}
            ref={inputRef}
          />
          
          <div className="private-chat__input-bar-right">
            <div className="input-actions">
              <button 
                type="button" 
                className={`private-chat__attach ${showAttach ? 'active' : ''}`}
                onClick={() => {
                  setShowAttach(v => !v);
                  setShowEmoji(false);
                }}
              >
                <PaperClipIcon width={36} height={36} className="action-icon" />
              </button>
              
              <button 
                type="button"
                className={`microphone-btn ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
                onMouseDown={!isRecording ? startRecording : undefined}
                onMouseUp={!isRecording ? stopRecording : undefined}
              >
                <MicrophoneIcon width={36} height={36} className="action-icon" />
                {isRecording && (
                  <span className="recording-indicator">
                    {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </button>
              
              <button 
                type="button"
                className="camera-btn"
                onClick={activateCamera}
              >
                <CameraIcon width={36} height={36} className="action-icon" />
              </button>
              
              <button
                type="submit"
                className="private-chat__send"
                disabled={!input.trim()}
              >
                <PaperAirplaneIcon width={36} height={36} className="action-icon" />
              </button>
            </div>
            
            {showAttach && (
              <div className="attachment-options">
                {attachmentOptions.map((option) => (
                  <button
                    key={option.type}
                    type="button"
                    className="attachment-option"
                    onClick={() => handleAttachment(option.type)}
                  >
                    <span className="attachment-icon">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default PrivateChat;