import { useState, useRef, useEffect } from "react";
import "../../styles/pages/mentor/GroupChatPage.scss";
import { 
  PaperAirplaneIcon, 
  PaperClipIcon,  
  PhoneIcon,
  VideoCameraIcon,
  PhoneXMarkIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  CameraIcon,
  MicrophoneIcon as MicIcon,
  CheckCircleIcon as CheckCircleSolid,
  SpeakerXMarkIcon
} from "@heroicons/react/24/outline";

const topics = [
  { name: "Deep expedition" },
  { name: "Solar rays" },
];
const previousChats = [
  { sender: "Mentor", text: "Welcome to the previous chat!" },
  { sender: "Ashley", text: "Thank you!" },
];
const groupCallMembers = [
  { name: "Mentor", id: 1 },
  { name: "Ashley", id: 2 },
  { name: "Heshan", id: 3 },
  { name: "Zoy", id: 4 },
];

const attachmentOptions = [
  { type: "document", label: "Document", icon: <DocumentTextIcon width={24} /> },
  { type: "image", label: "Image", icon: <PhotoIcon width={24} /> },
  { type: "video", label: "Video", icon: <FilmIcon width={24} /> },
  { type: "audio", label: "Audio", icon: <MusicalNoteIcon width={24} /> },
];

const emojiGrid = [
    "😀","🙌","👏","👋","💪","🥳","👩‍🎓","👨‍🎓","👩‍🏫","👨‍🏫","❤️","💜","🚀","🌕","🥇","📚","👩‍🚀","👨‍🚀","⭐","💫","🌟","✨","🌠","🌃","😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥺", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"
  ];

interface Message {
  id: number;
  sender: string;
  role: string;
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  isVoiceMessage?: boolean;
}

const GroupChatPage: React.FC = () => {
  const [input, setInput] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showTopicMenu, setShowTopicMenu] = useState<number | null>(null);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showGroupCall, setShowGroupCall] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchMsg, setSearchMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      sender: "Heshan", 
      role: "H", 
      text: "Hello Sir !!", 
      time: "10:30 AM" 
    },
    { 
      id: 2, 
      sender: "Ashley", 
      role: "A", 
      text: "What's topic today Sir?", 
      time: "10:31 AM" 
    },
    { 
      id: 3, 
      sender: "Mentor", 
      role: "M", 
      text: "Hi children today we going to learn solar...", 
      time: "10:32 AM",
      status: "read"
    },
    { 
      id: 4, 
      sender: "Zoy", 
      role: "Z", 
      text: "Wow 😊!!", 
      time: "10:32 AM" 
    },
  ]);

  // Scroll management
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const scrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollDown(scrolledUp);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Message sending
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "Mentor",
      role: "M",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };

    setMessages([...messages, newMessage]);
    setInput("");
    setShowEmoji(false);
    
    // Simulate response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const randomMember = groupCallMembers[Math.floor(Math.random() * (groupCallMembers.length - 1)) + 1];
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            sender: randomMember.name,
            role: randomMember.name[0],
            text: "Thanks for the explanation!",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
      }, 2000);
    }, 1000);
  };

  // Voice recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setShowAttach(false);
    setShowEmoji(false);
    
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    
    const duration = recordingTime;
    setRecordingTime(0);
    
    if (duration > 0) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "Mentor",
        role: "M",
        text: `🎤 Voice message (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sent",
        isVoiceMessage: true
      };
      
      setMessages(prev => [...prev, newMessage]);
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

  const handleVideoCall = () => {
    setShowGroupCall(true);
    setIsVideoCall(true);
  };

  // Add PlusIcon component
//     const PlusIcon = ({ width }: { width: number }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" width={width} height={width} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//     </svg>
//   );

  return (
    <div className="group-chat-page dark">
      {/* Sidebar */}
      <aside className="group-chat__sidebar">
        <div className="group-chat__sidebar-header">
          <span>Group Chat</span>
          <button className="group-chat__new-chat-btn lavender-outline">
                +
          </button>
        </div>
        <div className="group-chat__topics">
          {topics.map((t, i) => (
            <div className="group-chat__topic small" key={i}>
              <span>{t.name}</span>
              <div className="group-chat__topic-actions">
                <button 
                  className="group-chat__topic-menu" 
                  onClick={() => setShowTopicMenu(showTopicMenu === i ? null : i)}
                >
                  <EllipsisVerticalIcon width={20} />
                </button>
                {showTopicMenu === i && (
                  <div className="group-chat__menu-dropdown">
                    <div>Edit Topic</div>
                    <div>Delete Topic</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <button 
          className="group-chat__prev-btn" 
          onClick={() => setShowPrev(v => !v)}
        >
          Previous Topics
        </button>
        {showPrev && (
          <div className="group-chat__previous-chats">
            {previousChats.map((c, i) => (
              <div className="group-chat__previous-chat-msg" key={i}>
                <b>{c.sender}:</b> {c.text}
              </div>
            ))}
          </div>
        )}
        <div className="group-chat__mentor">
          <span className="group-chat__mentor-icon">M</span>
          <span>Mentor</span>
        </div>
      </aside>
      
      {/* Main Chat Area */}
      <main className="group-chat__main">
        <div className="group-chat__header">
          <div className="chat-header-left">
            <div className="avatar-container">
              <div className="group-chat__mentor-icon">M</div>
              <div className="status-indicator online" />
            </div>
            <div className="chat-header-info">
              <span className="group-chat__current-topic">Solar rays</span>
              <div className="group-chat__mentee-status">
                online • 4 participants
              </div>
            </div>
          </div>
          
          <div className="group-chat__header-search">
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
          
          <div className="group-chat__header-actions">
            <button 
              className="action-btn"
              onClick={() => {
                setShowGroupCall(true);
                setIsVideoCall(false);
              }}
            >
              <PhoneIcon width={28} height={28} />
            </button>
            <button 
              className="action-btn"
              onClick={handleVideoCall}
            >
              <VideoCameraIcon width={28} height={28} />
            </button>
            <div className="options-container">
              <button 
                className="action-btn"
                onClick={() => setShowChatMenu(!showChatMenu)}
              >
                <EllipsisVerticalIcon width={28} height={28} />
              </button>
              {showChatMenu && (
                <div className="options-dropdown">
                  <button>Mute Notifications</button>
                  <button>Leave Group</button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div 
          className="group-chat__messages"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {messages.map((msg) => (
            <div 
              className={`group-chat__message ${msg.role === "M" ? "group-chat__message--mentor" : "group-chat__message--user"}`} 
              key={msg.id}
            >
              <div className="message-sender">
                <span className="group-chat__message-sender">{msg.role}</span>
                <span className="sender-name">{msg.sender}</span>
              </div>
              <span className="group-chat__message-text">
                {highlightSearch(msg.text)}
              </span>
              {msg.isVoiceMessage && (
                <button className="play-audio-btn">
                  ▶️ Play Voice Message
                </button>
              )}
              <div className="message-meta">
                <span className="message-time">{msg.time}</span>
                {msg.role === "M" && (
                  <span className="message-status">
                    {msg.status === "read" ? (
                      <CheckCircleSolid className="status-icon read" width={16} />
                    ) : (
                      <CheckCircleIcon className="status-icon" width={16} />
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="group-chat__message group-chat__message--user">
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
        
        {/* Input Bar with reduced icon sizes */}
        <form className="group-chat__input-bar" onSubmit={handleSend}>
          <div className="group-chat__input-bar-left">
            <button 
              type="button" 
              className={`group-chat__emoji ${showEmoji ? 'active' : ''}`}
              onClick={() => {
                setShowEmoji(v => !v);
                setShowAttach(false);
              }}
            >
              😊
            </button>
            
            {showEmoji && (
              <div className="group-chat__emoji-list custom-emoji-grid">
                <div className="emoji-header">
                  <span>Emojis</span>
                  <button onClick={() => setShowEmoji(false)}>
                    <XMarkIcon width={24} />
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
            className="group-chat__input"
            type="text"
            placeholder="Message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => {
              setShowEmoji(false);
              setShowAttach(false);
            }}
          />
          
          <div className="group-chat__input-bar-right">
            <div className="input-actions">
              <button 
                type="button" 
                className={`group-chat__attach ${showAttach ? 'active' : ''}`}
                onClick={() => setShowAttach(!showAttach)}
              >
                <PaperClipIcon width={24} height={24} />
              </button>
              
              <button 
                type="button"
                className={`microphone-btn ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                <MicIcon width={24} height={24} />
                {isRecording && (
                  <span className="recording-indicator">
                    {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </button>
              
              <button 
                type="button"
                className="camera-btn"
                onClick={() => setShowCamera(true)}
              >
                <CameraIcon width={24} height={24} />
              </button>
              
              <button
                type="submit"
                className="group-chat__send"
                disabled={!input.trim()}
              >
                <PaperAirplaneIcon width={24} height={24} />
              </button>
            </div>
            
            {showAttach && (
              <div className="attachment-options">
                {attachmentOptions.map((option) => (
                  <button
                    key={option.type}
                    type="button"
                    className="attachment-option"
                    onClick={() => alert(`Selected: ${option.label}`)}
                  >
                    <span className="attachment-icon">{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>
        
        {/* Camera Preview */}
        {showCamera && (
          <div className="group-chat__camera-modal popup-modal">
            <div className="camera-preview">
              <div className="camera-placeholder">Camera Feed</div>
            </div>
            <button className="group-chat__close-camera" onClick={() => setShowCamera(false)}>
              Close Camera
            </button>
          </div>
        )}
        
        {/* Enhanced Group Call Interface */}
        {showGroupCall && (
          <div className="group-chat__group-call-overlay popup-modal">
            <div className="popup-content">
              <div className="call-header">
                <h2>{isVideoCall ? "Video Call" : "Voice Call"}</h2>
                <button onClick={() => setShowGroupCall(false)}>
                  <XMarkIcon width={32} />
                </button>
              </div>
              
              <div className="call-body">
                <div className="video-container">
                  <div className="remote-video">
                    <div className="user-avatar">
                      <div className="group-avatar">GC</div>
                    </div>
                    <div className="call-status">Group Call - 4 participants</div>
                  </div>
                  
                  {isVideoCall && (
                    <div className={`local-video ${cameraActive ? 'active' : ''}`}>
                      {cameraActive ? (
                        <div className="camera-feed">Your Camera</div>
                      ) : (
                        <div className="camera-placeholder">Camera Off</div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="call-controls">
                  {isVideoCall && (
                    <button 
                      className={`control-btn camera ${cameraActive ? 'active' : ''}`} 
                      onClick={() => setCameraActive(!cameraActive)}
                    >
                      <CameraIcon width={32} />
                    </button>
                  )}
                  
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
                  
                  <button 
                    className="control-btn switch-mode"
                    onClick={() => setIsVideoCall(!isVideoCall)}
                  >
                    {isVideoCall ? (
                      <PhoneIcon width={32} />
                    ) : (
                      <VideoCameraIcon width={32} />
                    )}
                  </button>
                  
                  <button 
                    className="control-btn decline" 
                    onClick={() => setShowGroupCall(false)}
                  >
                    <PhoneXMarkIcon width={32} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GroupChatPage;