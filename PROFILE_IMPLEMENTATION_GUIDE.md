# STELLARION Profile System - Implementation Guide

## Overview

This document provides a comprehensive guide to the Profile system implemented for the STELLARION platform. The system includes a modern, two-layer profile page design with extensive customization options based on user roles.

## Features Implemented

### ✅ Upper Layer - Profile Header
- **Profile Picture**: Upload/change avatar with file validation
- **Active Status**: Visual indicator of user's active state
- **Basic Information**: First name, last name, email, display name
- **User Role**: Current role with upgrade option icon
- **Edit Profile Button**: Toggle edit mode for profile information

### ✅ Lower Layer - Tabbed Interface

#### Profile Details Tab
1. **Basic Information Section**
   - Editable personal details
   - Bio/description field
   - Contact information

2. **Astronomy Experience Section**
   - Experience level (Beginner → Expert)
   - Years of observation experience
   - Favorite astronomy fields (multi-select)
   - Telescope ownership and details

3. **Role-Specific Sections**
   - **Mentors/Guides**: Mentoring areas, years of experience
   - **Influencers**: Social media followers, content platforms
   - **Learners/Enthusiasts**: Learning goals, current projects

4. **Social Links Section**
   - Location, website, GitHub, LinkedIn
   - External profile connections

5. **Achievements & Contributions**
   - Personal achievements
   - Community contributions
   - Recognition and badges

#### Settings Tab
1. **General Settings**
   - Language preference (10+ languages supported)
   - Profile visibility (Public/Community/Private)
   - Theme preferences

2. **Notification Settings**
   - Email notifications toggle
   - Push notifications toggle
   - Online status visibility
   - Direct messages permissions

3. **Security Settings**
   - Change password functionality
   - Data export option
   - Two-factor authentication (planned)

4. **Danger Zone**
   - Account deletion with confirmation flow
   - Data download before deletion

### ✅ Advanced Features

#### Role Management
- **Role Hierarchy**: Learner → Enthusiast → Guide → Mentor → Influencer → Moderator → Admin
- **Upgrade Requests**: Users can request role upgrades
- **Permission System**: Role-based access control

#### Security & Privacy
- **Data Validation**: Comprehensive input validation
- **File Upload Security**: Type and size validation for avatars
- **Privacy Controls**: Granular visibility settings
- **Data Export**: GDPR-compliant data download

#### User Experience
- **Responsive Design**: Works on all device sizes
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Accessibility**: ARIA labels and keyboard navigation
- **Modern UI**: Glass-morphism effects and modern styling

## Technical Implementation

### File Structure
```
src/
├── pages/
│   └── Profile.tsx                 # Main profile page component
├── types/
│   └── profile.ts                  # TypeScript interfaces
├── utils/
│   └── profileUtils.ts            # Utility functions
├── hooks/
│   └── useProfile.ts              # Custom React hooks
└── components/
    ├── Card.tsx                   # Reused from existing
    ├── Button.tsx                 # Reused from existing
    ├── InputField.tsx             # Reused from existing
    └── LoadingSpinner.tsx         # Reused from existing
```

### Key Components

#### Profile.tsx
- **Size**: 1,135+ lines of well-structured code
- **Features**: Complete profile management interface
- **State Management**: Local state with React hooks
- **Validation**: Real-time form validation
- **Modals**: Password change, role upgrade, account deletion

#### Types System (profile.ts)
- **Comprehensive Types**: 300+ lines of TypeScript definitions
- **Role-Based Types**: Specific interfaces for different user roles
- **Validation Rules**: Built-in validation schemas
- **API Interfaces**: Complete request/response types

#### Utility Functions (profileUtils.ts)
- **Validation**: Email, password, username validation
- **File Handling**: Avatar upload validation and processing
- **Role Management**: Permission checking and role utilities
- **UI Helpers**: Color generation, formatting functions

#### Custom Hooks (useProfile.ts)
- **useProfile**: Profile data management
- **useSettings**: Settings management
- **useRoleUpgrade**: Role upgrade request handling
- **useFormValidation**: Generic form validation
- **useFileUpload**: File upload with progress
- **useProfileCompletion**: Profile completion tracking

## User Attributes & Database Schema

### Core User Fields
```typescript
interface User {
  id: number;
  firebase_uid: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  last_login: Date;
}
```

### Extended Profile Data (JSONB)
```typescript
interface ProfileData {
  // Basic Info
  profile_picture: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  
  // Astronomy Experience
  astronomy_experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  favorite_astronomy_fields: string[];
  telescope_owned: boolean;
  telescope_type: string;
  observation_experience: number;
  certifications: string[];
  
  // Community Data
  achievements: string[];
  contributions: string[];
  joined_communities: string[];
}
```

### Role-Specific Data
```typescript
interface RoleSpecificData {
  // Mentors/Guides
  mentoring_areas?: string[];
  years_of_experience?: number;
  
  // Influencers
  social_media_followers?: number;
  content_platforms?: string[];
  
  // Learners/Enthusiasts
  learning_goals?: string[];
  current_projects?: string[];
}
```

### Settings Schema
```typescript
interface UserSettings {
  language: string;
  email_notifications: boolean;
  push_notifications: boolean;
  profile_visibility: 'public' | 'private' | 'community-only';
  allow_direct_messages: boolean;
  show_online_status: boolean;
  theme: 'light' | 'dark';
  timezone: string;
}
```

## API Requirements

### Required Endpoints

1. **Profile Management**
   - `GET /api/user/profile` - Get complete profile
   - `PUT /api/user/profile` - Update profile data
   - `POST /api/user/profile/avatar` - Upload profile picture

2. **Settings Management**
   - `GET /api/user/settings` - Get user settings
   - `PUT /api/user/settings` - Update settings

3. **Security & Authentication**
   - `PUT /api/user/password` - Change password
   - `DELETE /api/user/account` - Delete account
   - `GET /api/user/data-export` - Export user data

4. **Role Management**
   - `POST /api/user/role-upgrade` - Request role upgrade
   - `GET /api/user/role-upgrade/status` - Check upgrade status

### Database Tables Required

```sql
-- Users table (existing, may need modifications)
ALTER TABLE users ADD COLUMN profile_data JSONB;
ALTER TABLE users ADD COLUMN role_specific_data JSONB;

-- User settings table (new)
CREATE TABLE user_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'en',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    profile_visibility VARCHAR(20) DEFAULT 'public',
    allow_direct_messages BOOLEAN DEFAULT true,
    show_online_status BOOLEAN DEFAULT true,
    theme VARCHAR(10) DEFAULT 'dark',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Role upgrade requests table (new)
CREATE TABLE role_upgrade_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current_role VARCHAR(20) NOT NULL,
    requested_role VARCHAR(20) NOT NULL,
    reason TEXT,
    supporting_evidence JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    reviewer_id INTEGER REFERENCES users(id),
    reviewer_notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

-- User avatars table (new)
CREATE TABLE user_avatars (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, is_active) WHERE is_active = true
);
```

## Community-Specific Features

### Astronomy Fields
- Astrophysics, Cosmology, Planetary Science
- Stellar Astronomy, Galactic Astronomy, Exoplanets
- Solar System, Deep Sky Objects, Astrophotography
- Radio Astronomy, X-ray Astronomy, Gravitational Waves

### User Roles & Progression
1. **Learner**: New to astronomy, learning basics
2. **Enthusiast**: Active participant with basic knowledge
3. **Guide**: Helps newcomers navigate the community
4. **Mentor**: Expert providing guidance and education
5. **Influencer**: Content creator and community leader
6. **Moderator**: Maintains community standards
7. **Admin**: Platform administrator

### Role-Specific Features
- **Mentors**: Can set mentoring areas and availability
- **Influencers**: Track social media presence and content
- **Guides**: Showcase areas of expertise
- **Learners**: Set learning goals and track progress

## Design Consistency

### Visual Elements
- **Color Scheme**: Dark theme with indigo accents
- **Glass Morphism**: Backdrop blur effects on cards
- **Modern Typography**: Clean, readable font hierarchy
- **Icons**: Lucide React icons for consistency
- **Spacing**: Consistent padding and margins
- **Responsive**: Mobile-first design approach

### Components Used
- **Card Component**: Consistent card styling
- **Button Component**: Various button styles
- **InputField Component**: Standardized form inputs
- **LoadingSpinner**: Consistent loading states

## Security Considerations

### Input Validation
- Email format validation
- Password strength requirements
- File type and size validation
- XSS prevention through input sanitization

### Privacy & Data Protection
- GDPR-compliant data export
- Secure account deletion
- Privacy controls for profile visibility
- Audit logging for sensitive operations

### File Upload Security
- Allowed file types: JPEG, PNG, WebP
- Maximum file size: 5MB
- Malware scanning (to be implemented)
- Secure CDN storage

## Future Enhancements

### Planned Features
1. **Social Features**
   - Follow/unfollow other users
   - Activity feed for profile updates
   - Peer recognition and endorsements

2. **Advanced Settings**
   - Two-factor authentication
   - API key management
   - Integration with external services

3. **Gamification**
   - Achievement system
   - Progress tracking
   - Community challenges

4. **Analytics**
   - Profile view statistics
   - Community engagement metrics
   - Personal progress dashboard

## Implementation Timeline

### Phase 1: Backend API Development (2-3 weeks)
- Database schema implementation
- API endpoint development
- Authentication middleware
- File upload handling

### Phase 2: Testing & Integration (1-2 weeks)
- API testing
- Frontend-backend integration
- Security testing
- Performance optimization

### Phase 3: Deployment & Monitoring (1 week)
- Production deployment
- Monitoring setup
- User feedback collection
- Bug fixes and improvements

## Documentation Files Created

1. **PROFILE_API_DOCUMENTATION.md** - Complete API specification
2. **src/types/profile.ts** - TypeScript interfaces and types
3. **src/utils/profileUtils.ts** - Utility functions
4. **src/hooks/useProfile.ts** - React hooks
5. **src/pages/Profile.tsx** - Main profile component

## Getting Started

1. **Review the API documentation** to understand required endpoints
2. **Implement the database schema** as specified
3. **Develop the backend APIs** following the provided specifications
4. **Test the frontend integration** with mock data first
5. **Replace mock API calls** in hooks with actual endpoints
6. **Deploy and monitor** the complete system

The profile system is now ready for backend implementation and provides a solid foundation for the STELLARION community platform.
