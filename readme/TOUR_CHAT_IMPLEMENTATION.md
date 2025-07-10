# Tour Chat Page Implementation Guide

## Overview
The Tour Chat Page is a real-time, futuristic communication interface that allows guides to chat with their confirmed tour members. It provides a centralized communication hub for astronomy tours and stargazing sessions.

## Features

### 🌌 Futuristic Design
- **Glassmorphic UI**: Translucent cards with backdrop blur effects
- **Cosmic Theme**: Space-inspired color scheme with purple gradients
- **Animated Backgrounds**: Floating starfield with twinkling effects
- **Smooth Animations**: Framer Motion powered transitions and interactions

### 💬 Chat Functionality
- **Real-time Messaging**: Live chat interface for guides and tour members
- **Role-based Avatars**: Distinct styling for guides (with star badges) and members
- **Message Timestamps**: Clear time indicators for all messages
- **Typing Indicators**: Shows when members are typing (prepared for real-time)
- **Message History**: Scrollable chat history with date separators

### 👥 Member Management
- **Online Status**: Real-time online/offline indicators for all members
- **Member List Panel**: Expandable sidebar showing all tour participants
- **Guide Identification**: Special guide badges and highlighting
- **Last Seen Information**: Shows when offline members were last active

### 📅 Tour Information
- **Tour Details Panel**: Comprehensive tour information sidebar
- **Status Tracking**: Visual status badges (upcoming/in-progress/completed)
- **Location & Time**: Clear display of tour schedule and location
- **Participant Count**: Live count of online vs total members

## Technical Implementation

### Components Structure
```
TourChat.tsx
├── Header (Navigation & Tour Info)
├── Chat Layout
│   ├── Main Chat Area
│   │   ├── Messages Container
│   │   ├── Message Input Area
│   │   └── Send Button
│   ├── Members Panel (Toggleable)
│   └── Tour Info Panel (Toggleable)
```

### Key Technologies
- **React**: Functional components with hooks
- **TypeScript**: Full type safety and interface definitions
- **Framer Motion**: Smooth animations and transitions
- **React Router**: Navigation and URL parameters
- **SCSS**: Advanced styling with theme variables
- **Lucide React**: Modern icon library

### State Management
```typescript
// Core chat state
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [newMessage, setNewMessage] = useState('');
const [members, setMembers] = useState<TourMember[]>([]);
const [tourInfo, setTourInfo] = useState<TourInfo | null>(null);

// UI state
const [showMembersList, setShowMembersList] = useState(false);
const [showTourInfo, setShowTourInfo] = useState(false);
```

## Integration Points

### From Confirmed Bookings
- Each booking row includes a "Chat" button
- Clicking navigates to `/dashboard/tour-chat?tourId={bookingId}`
- Seamless integration with existing booking management

### Navigation Integration
- Added to Guide sidebar menu as "Tour Chat"
- Accessible via `/dashboard/tour-chat` route
- Protected by role-based access control (guides only)

### Route Configuration
```typescript
// In DashboardRoutes.tsx
<Route
  path="tour-chat"
  element={
    <RoleGuard allowedRoles={['guide', 'admin']}>
      <TourChat />
    </RoleGuard>
  }
/>
```

## Styling Architecture

### SCSS Structure
```scss
.tour-chat-page
├── Background Effects (animated starfield)
├── Header Styling (glassmorphic header bar)
├── Chat Layout (flexible grid system)
├── Messages (bubble styling with role-based colors)
├── Side Panels (expandable sidebar styling)
└── Responsive Design (mobile-first approach)
```

### Theme Integration
- Uses existing color variables from `_variables.scss`
- Consistent with system-wide theme (purple/blue cosmic palette)
- Glassmorphic effects with backdrop blur
- Smooth hover states and transitions

### Responsive Design
- **Desktop**: Full layout with expandable sidebars
- **Tablet**: Stacked layout with collapsible panels
- **Mobile**: Single-column layout with overlay panels

## Data Models

### Core Interfaces
```typescript
interface TourMember {
  id: string;
  name: string;
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
```

## Future Enhancements

### Real-time Features (Ready for Implementation)
- WebSocket integration for live messaging
- Push notifications for new messages
- Live typing indicators
- Online presence updates

### Advanced Features
- Image/file sharing capabilities
- Location sharing for meetup points
- Voice messages for guides
- Tour announcements and alerts
- Message reactions and emoji support

### Analytics Integration
- Message engagement tracking
- Popular tour discussion topics
- Member participation metrics

## User Experience Flow

### Guide Workflow
1. Navigate to "Confirmed Bookings"
2. Click "Chat" button for any confirmed tour
3. Access real-time chat with all tour members
4. Use side panels for member management and tour details
5. Send messages, announcements, and updates

### Accessibility Features
- Keyboard navigation support
- Screen reader compatible
- High contrast mode support
- Focus management for modals and panels

## Security Considerations
- Role-based access control (guides only)
- Tour-specific chat isolation
- Message content validation
- User authentication required

## Performance Optimizations
- Lazy loading of chat history
- Virtualized scrolling for large message lists
- Optimized re-renders with React.memo
- Efficient state updates with proper dependency arrays

## Troubleshooting

### SCSS Import Errors
If you encounter SCSS import errors like "Can't find stylesheet to import", ensure the import paths are correct:

```scss
// Correct import paths for guide pages
@import '../../abstracts/variables';
@import '../../abstracts/mixins';
```

### Browser Compatibility
The Tour Chat page uses modern CSS features with proper fallbacks:
- All `backdrop-filter` properties include `-webkit-backdrop-filter` prefixes for Safari support
- CSS Grid and Flexbox with fallback layouts
- Modern color functions with hex fallbacks

This implementation provides a solid foundation for tour communication while maintaining the futuristic, space-themed aesthetic of the STELLARION platform.
