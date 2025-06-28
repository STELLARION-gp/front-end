# User Database Schema for STELLARION Platform

## Users Table Structure

```sql
CREATE TABLE users (
    -- Primary identifiers
    uid VARCHAR(128) PRIMARY KEY,  -- Firebase UID
    email VARCHAR(255) NOT NULL UNIQUE,
    
    -- Basic user information
    display_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    
    -- Role and permissions
    role ENUM('admin', 'moderator', 'mentor', 'learner', 'guide', 'influencer', 'enthusiast') NOT NULL DEFAULT 'learner',
    
    -- Status and activity
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Profile information
    avatar_url VARCHAR(500),
    bio TEXT,
    
    -- Skills and interests (JSON arrays)
    skills JSON,  -- ["astronomy", "astrophotography", "telescopes"]
    interests JSON,  -- ["deep_sky", "planets", "moon", "nebulae"]
    
    -- Location (optional)
    country VARCHAR(100),
    city VARCHAR(100),
    timezone VARCHAR(50),
    
    -- Social links
    website_url VARCHAR(500),
    social_links JSON,  -- {"twitter": "username", "instagram": "username"}
    
    -- Statistics
    reputation_score INT DEFAULT 0,
    total_posts INT DEFAULT 0,
    total_sessions_conducted INT DEFAULT 0,  -- For mentors
    total_sessions_attended INT DEFAULT 0,   -- For learners
    
    -- Preferences
    notification_preferences JSON,  -- {"email": true, "push": false, "sms": false}
    privacy_settings JSON,  -- {"profile_visibility": "public", "email_visibility": "private"}
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    last_active TIMESTAMP,
    
    -- Soft delete
    deleted_at TIMESTAMP NULL,
    
    -- Indexes
    INDEX idx_role (role),
    INDEX idx_active (is_active),
    INDEX idx_created_at (created_at),
    INDEX idx_last_active (last_active),
    INDEX idx_reputation (reputation_score)
);
```

## Role-specific Tables

### Mentors Table (for users with mentor role)
```sql
CREATE TABLE mentors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_uid VARCHAR(128) NOT NULL,
    
    -- Mentor specific information
    specializations JSON,  -- ["telescope_usage", "astrophotography", "observation_techniques"]
    experience_years INT,
    certification_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
    
    -- Availability
    available_hours JSON,  -- {"monday": ["09:00-17:00"], "tuesday": ["10:00-16:00"]}
    max_students_per_session INT DEFAULT 5,
    session_rate DECIMAL(10,2),  -- Price per hour (if paid sessions)
    
    -- Statistics
    total_sessions INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    
    -- Status
    is_accepting_students BOOLEAN DEFAULT TRUE,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_uid) REFERENCES users(uid) ON DELETE CASCADE,
    INDEX idx_specializations (specializations),
    INDEX idx_rating (average_rating),
    INDEX idx_accepting (is_accepting_students)
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    
    -- Participants
    mentor_uid VARCHAR(128) NOT NULL,
    learner_uid VARCHAR(128) NOT NULL,
    
    -- Session details
    title VARCHAR(200) NOT NULL,
    description TEXT,
    session_type ENUM('one_on_one', 'group', 'workshop') DEFAULT 'one_on_one',
    
    -- Scheduling
    scheduled_start TIMESTAMP NOT NULL,
    scheduled_end TIMESTAMP NOT NULL,
    actual_start TIMESTAMP,
    actual_end TIMESTAMP,
    
    -- Status
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    
    -- Meeting details
    meeting_url VARCHAR(500),
    meeting_password VARCHAR(100),
    
    -- Feedback
    mentor_rating INT CHECK (mentor_rating >= 1 AND mentor_rating <= 5),
    learner_rating INT CHECK (learner_rating >= 1 AND learner_rating <= 5),
    mentor_feedback TEXT,
    learner_feedback TEXT,
    
    -- Resources shared
    shared_resources JSON,  -- [{"type": "link", "url": "...", "title": "..."}]
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (mentor_uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (learner_uid) REFERENCES users(uid) ON DELETE CASCADE,
    INDEX idx_mentor (mentor_uid),
    INDEX idx_learner (learner_uid),
    INDEX idx_status (status),
    INDEX idx_scheduled_start (scheduled_start)
);
```

### User Achievements Table
```sql
CREATE TABLE user_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_uid VARCHAR(128) NOT NULL,
    
    achievement_type ENUM('first_session', 'mentor_graduate', '10_sessions', '50_sessions', 'expert_level') NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    achievement_description TEXT,
    
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_uid) REFERENCES users(uid) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_uid, achievement_type),
    INDEX idx_user (user_uid),
    INDEX idx_type (achievement_type)
);
```

## API Endpoints for User Management

### User Registration/Profile Management
```typescript
// POST /api/users - Create new user profile
interface CreateUserRequest {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  country?: string;
  city?: string;
  timezone?: string;
}

// PUT /api/users/:uid - Update user profile
interface UpdateUserRequest {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  avatarUrl?: string;
  socialLinks?: Record<string, string>;
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

// GET /api/users/:uid - Get user profile
interface UserProfileResponse {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  profileData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatarUrl?: string;
    skills?: string[];
    interests?: string[];
    country?: string;
    city?: string;
  };
  statistics: {
    reputationScore: number;
    totalPosts: number;
    totalSessionsConducted: number;
    totalSessionsAttended: number;
  };
  createdAt: Date;
  lastLogin: Date;
}
```

### Role-based Data Sync
When a user signs up or updates their profile, the frontend should send this data to your backend:

```typescript
// This is what gets sent from your AuthContext to the backend
const userDataToSync = {
  uid: userProfile.uid,
  email: userProfile.email,
  displayName: userProfile.displayName,
  role: userProfile.role,
  createdAt: userProfile.createdAt,
  lastLogin: userProfile.lastLogin,
  isActive: userProfile.isActive,
  profileData: userProfile.profileData
};

// Backend should handle:
// 1. Creating/updating user record
// 2. Setting up role-specific data (mentor table if role is mentor)
// 3. Initializing default preferences
// 4. Creating welcome achievements
// 5. Setting up notification preferences
```

## Additional Considerations

### 1. Data Privacy & GDPR Compliance
- Include consent tracking
- Data retention policies
- Right to deletion (soft delete implementation)

### 2. Security
- Encrypt sensitive data
- Regular security audits
- Rate limiting on API endpoints

### 3. Scalability
- Consider sharding by user region
- Implement caching for frequently accessed data
- Use read replicas for analytics

### 4. Analytics
- User engagement tracking
- Feature usage analytics
- Conversion funnel analysis
