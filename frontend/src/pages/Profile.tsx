import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { useI18n } from '../i18n/useI18n';
import { profileService, type ProfileData as ApiProfileData, type SettingsData as ApiSettingsData } from '../services/profileService';
import {
  User,
  Settings,
  Camera,
  Star,
  Edit3,
  Mail,
  Shield,
  Crown,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Telescope,
  Rocket,
  Award,
  Users,
  Heart,
  Trash2,
  Bell,
  Lock,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface ProfileData {
  // Basic Info
  profilePicture?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;

  // Community-specific fields
  astronomyExperience?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  favoriteAstronomyFields?: string[];
  telescopeOwned?: boolean;
  telescopeType?: string;
  observationExperience?: number;
  certifications?: string[];

  // Role-specific fields
  // For Mentors/Guides
  mentoringAreas?: string[];
  yearsOfExperience?: number;

  // For Influencers
  socialMediaFollowers?: number;
  contentPlatforms?: string[];

  // For Enthusiasts/Learners
  learningGoals?: string[];
  currentProjects?: string[];

  // Common fields
  achievements?: string[];
  contributions?: string[];
  joinedCommunities?: string[];
}

interface SettingsData {
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  profileVisibility: 'public' | 'private' | 'community-only';
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
}

const Profile: React.FC = () => {
  const { user, userProfile } = useAuth();
  const { t, getCurrentLanguage, changeLanguage, isLanguageReady } = useI18n();
  const currentLang = getCurrentLanguage().code;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRoleUpgradeModal, setShowRoleUpgradeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loadedProfile, setLoadedProfile] = useState<ApiProfileData | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    astronomyExperience: 'beginner',
    favoriteAstronomyFields: [],
    telescopeOwned: false,
    observationExperience: 0,
    certifications: [],
    mentoringAreas: [],
    yearsOfExperience: 0,
    socialMediaFollowers: 0,
    contentPlatforms: [],
    learningGoals: [],
    currentProjects: [],
    achievements: [],
    contributions: [],
    joinedCommunities: []
  });

  const [settings, setSettings] = useState<SettingsData>({
    language: currentLang,
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: 'public',
    allowDirectMessages: true,
    showOnlineStatus: true
  });

  // Update settings language when i18n language changes
  useEffect(() => {
    setSettings(prev => ({ ...prev, language: currentLang }));
  }, [currentLang]);

  // Force re-render when language changes to ensure all text updates
  const [, forceUpdate] = useState({});
  useEffect(() => {
    forceUpdate({});
  }, [currentLang]);

  const [editForm, setEditForm] = useState({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.email || '',
    displayName: user?.displayName || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Add state for role upgrade options
  const [selectedUpgradeRole, setSelectedUpgradeRole] = useState<string>('');
  const [roleUpgradeReason, setRoleUpgradeReason] = useState<string>('');
  const [deleteAccountPassword, setDeleteAccountPassword] = useState<string>('');

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDisplayName = (displayName: string) => {
    return displayName.length >= 3 && displayName.length <= 30 && /^[a-zA-Z0-9_-]+$/.test(displayName);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
  };

  const roleHierarchy = {
    'learner': 0,
    'enthusiast': 1,
    'guide': 2,
    'mentor': 3,
    'influencer': 4,
    'moderator': 5,
    'admin': 6
  };

  const roleIcons = {
    'learner': User,
    'enthusiast': Heart,
    'guide': Users,
    'mentor': Award,
    'influencer': Star,
    'moderator': Shield,
    'admin': Crown
  };

  const getAvailableRoleUpgrades = (currentRole: string) => {
    if (currentRole === 'learner') {
      return ['enthusiast', 'guide', 'influencer'];
    }
    const currentLevel = roleHierarchy[currentRole as keyof typeof roleHierarchy];
    const roleEntries = Object.entries(roleHierarchy);
    const nextRoleEntry = roleEntries.find(([, level]) => level === currentLevel + 1);
    return nextRoleEntry ? [nextRoleEntry[0]] : [];
  };

  const getNextRole = (currentRole: string) => {
    const availableRoles = getAvailableRoleUpgrades(currentRole);
    return availableRoles.length > 0 ? availableRoles[0] : null;
  };

  // API Integration Functions
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.getUserProfile();

      if (response.success && response.data) {
        const apiProfile = response.data;
        setLoadedProfile(apiProfile);

        // Update basic user info
        setEditForm({
          firstName: apiProfile.first_name || '',
          lastName: apiProfile.last_name || '',
          email: apiProfile.email || '',
          displayName: apiProfile.display_name || ''
        });

        // Update profile data - map from API format to component format
        if (apiProfile.profile_data) {
          setProfileData({
            profilePicture: apiProfile.profile_data.profile_picture,
            bio: apiProfile.profile_data.bio || '',
            location: apiProfile.profile_data.location || '',
            website: apiProfile.profile_data.website || '',
            github: apiProfile.profile_data.github || '',
            linkedin: apiProfile.profile_data.linkedin || '',
            astronomyExperience: apiProfile.profile_data.astronomy_experience || 'beginner',
            favoriteAstronomyFields: apiProfile.profile_data.favorite_astronomy_fields || [],
            telescopeOwned: apiProfile.profile_data.telescope_owned || false,
            telescopeType: apiProfile.profile_data.telescope_type || '',
            observationExperience: apiProfile.profile_data.observation_experience || 0,
            certifications: apiProfile.profile_data.certifications || [],
            achievements: apiProfile.profile_data.achievements || [],
            contributions: apiProfile.profile_data.contributions || [],
            joinedCommunities: apiProfile.profile_data.joined_communities || [],
            // Role-specific data
            mentoringAreas: apiProfile.role_specific_data?.mentoring_areas || [],
            yearsOfExperience: apiProfile.role_specific_data?.years_of_experience || 0,
            socialMediaFollowers: apiProfile.role_specific_data?.social_media_followers || 0,
            contentPlatforms: apiProfile.role_specific_data?.content_platforms || [],
            learningGoals: apiProfile.role_specific_data?.learning_goals || [],
            currentProjects: apiProfile.role_specific_data?.current_projects || []
          });
        }
      } else {
        setErrors({ profile: response.message || 'Failed to load profile' });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setErrors({ profile: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const loadUserSettings = async () => {
    try {
      const response = await profileService.getUserSettings();

      if (response.success && response.data) {
        const apiSettings = response.data;
        setSettings({
          language: apiSettings.language,
          emailNotifications: apiSettings.email_notifications,
          pushNotifications: apiSettings.push_notifications,
          profileVisibility: apiSettings.profile_visibility,
          allowDirectMessages: apiSettings.allow_direct_messages,
          showOnlineStatus: apiSettings.show_online_status
        });
      } else {
        setErrors({ settings: response.message || 'Failed to load settings' });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setErrors({ settings: 'Failed to load settings data' });
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadUserSettings();
    }
  }, [user]);

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setUploadProgress(0);

      const response = await profileService.uploadProfilePicture(file);

      if (response.success && response.data) {
        // Update profile picture in state
        setProfileData(prev => ({
          ...prev,
          profilePicture: response.data!.profile_picture_url
        }));
        setUploadProgress(100);
      } else {
        setErrors({ avatar: response.message || 'Failed to upload avatar' });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setErrors({ avatar: 'Failed to upload avatar' });
    } finally {
      setLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSaveProfile = async () => {
    // Validate form data
    if (!validateDisplayName(editForm.displayName)) {
      setErrors({ displayName: 'Display name must be 3-30 characters and contain only letters, numbers, _ and -' });
      return;
    }

    if (!validateEmail(editForm.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare API payload
      const profilePayload: Partial<ApiProfileData> = {
        first_name: editForm.firstName,
        last_name: editForm.lastName,
        display_name: editForm.displayName,
        profile_data: {
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          github: profileData.github,
          linkedin: profileData.linkedin,
          astronomy_experience: profileData.astronomyExperience,
          favorite_astronomy_fields: profileData.favoriteAstronomyFields,
          telescope_owned: profileData.telescopeOwned,
          telescope_type: profileData.telescopeType,
          observation_experience: profileData.observationExperience,
          certifications: profileData.certifications,
          achievements: profileData.achievements,
          contributions: profileData.contributions,
          joined_communities: profileData.joinedCommunities
        },
        role_specific_data: {
          mentoring_areas: profileData.mentoringAreas,
          years_of_experience: profileData.yearsOfExperience,
          social_media_followers: profileData.socialMediaFollowers,
          content_platforms: profileData.contentPlatforms,
          learning_goals: profileData.learningGoals,
          current_projects: profileData.currentProjects
        }
      };

      const response = await profileService.updateUserProfile(profilePayload);

      if (response.success) {
        setIsEditing(false);
        // Optionally reload profile to get updated data
        await loadUserProfile();
      } else {
        setErrors({ profile: response.message || 'Failed to save profile' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ profile: 'Failed to save profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setErrors({});

    try {
      // Prepare API payload - map from component format to API format
      const settingsPayload: Partial<ApiSettingsData> = {
        language: settings.language,
        email_notifications: settings.emailNotifications,
        push_notifications: settings.pushNotifications,
        profile_visibility: settings.profileVisibility,
        allow_direct_messages: settings.allowDirectMessages,
        show_online_status: settings.showOnlineStatus
      };

      const response = await profileService.updateUserSettings(settingsPayload);

      if (response.success) {
        // Update language if changed
        if (settings.language !== currentLang) {
          changeLanguage(settings.language);
        }
      } else {
        setErrors({ settings: response.message || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrors({ settings: 'Failed to save settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrors({ password: 'Passwords do not match' });
      return;
    }

    if (!validatePassword(passwordForm.newPassword)) {
      setErrors({ password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await profileService.changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      });

      if (response.success) {
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        // Show success message
        alert('Password changed successfully');
      } else {
        setErrors({ password: response.message || 'Failed to change password' });
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors({ password: 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccountPassword) {
      setErrors({ account: 'Please enter your password to confirm' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await profileService.deleteAccount({
        confirmation: 'DELETE',
        password: deleteAccountPassword
      });

      if (response.success) {
        // Account deletion successful - redirect to logout
        alert('Account deleted successfully');
        // Add logout logic here if needed
        window.location.href = '/';
      } else {
        setErrors({ account: response.message || 'Failed to delete account' });
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setErrors({ account: 'Failed to delete account' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpgrade = async () => {
    if (!selectedUpgradeRole && currentUserProfile.role === 'learner') {
      setErrors({ roleUpgrade: 'Please select a role to upgrade to' });
      return;
    }

    if (!roleUpgradeReason.trim()) {
      setErrors({ roleUpgrade: 'Please provide a reason for the role upgrade' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const requestedRole = selectedUpgradeRole || getNextRole(currentUserProfile.role || 'learner') || '';

      const response = await profileService.requestRoleUpgrade({
        requested_role: requestedRole,
        reason: roleUpgradeReason,
        supporting_evidence: []
      });

      if (response.success) {
        setShowRoleUpgradeModal(false);
        setSelectedUpgradeRole('');
        setRoleUpgradeReason('');
        alert('Role upgrade request submitted successfully!');
      } else {
        setErrors({ roleUpgrade: response.message || 'Failed to submit role upgrade request' });
      }
    } catch (error) {
      console.error('Error requesting role upgrade:', error);
      setErrors({ roleUpgrade: 'Failed to submit role upgrade request' });
    } finally {
      setLoading(false);
    }
  };

  const handleDataExport = async () => {
    setLoading(true);
    setErrors({});

    try {
      const response = await profileService.exportUserData();

      if (response.success && response.data) {
        // Open download URL in new tab
        window.open(response.data.download_url, '_blank');
      } else {
        setErrors({ export: response.message || 'Failed to export data' });
        alert('Failed to export data: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      setErrors({ export: 'Failed to export data' });
      alert('Failed to export data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const astronomyFields = [
    'Astrophysics', 'Cosmology', 'Planetary Science', 'Stellar Astronomy',
    'Galactic Astronomy', 'Exoplanets', 'Solar System', 'Deep Sky Objects',
    'Astrophotography', 'Radio Astronomy', 'X-ray Astronomy', 'Gravitational Waves'
  ];

  const contentPlatforms = ['YouTube', 'Instagram', 'TikTok', 'Twitter', 'Blog', 'Podcast'];

  if (!user || !userProfile || !isLanguageReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // User profile data - from API or fallback to defaults
  const currentUserProfile = loadedProfile || {
    id: user?.uid || '1',
    first_name: editForm.firstName,
    last_name: editForm.lastName,
    display_name: user?.displayName || userProfile?.displayName || 'John Doe',
    email: user?.email || userProfile?.email || 'john@example.com',
    role: userProfile?.role || 'learner',
    is_active: userProfile?.isActive ?? true,
    created_at: userProfile?.createdAt?.toISOString() || new Date('2024-01-01').toISOString(),
    last_login: userProfile?.lastLogin?.toISOString() || new Date().toISOString(),
  };

  const RoleIcon = roleIcons[currentUserProfile.role as keyof typeof roleIcons] || User;
  const nextRole = getNextRole(currentUserProfile.role || 'learner');

  // Helper function to get display values from profile
  const getDisplayValue = (profile: typeof currentUserProfile) => {
    return {
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      displayName: profile.display_name || '',
      email: profile.email || '',
      role: profile.role || 'learner',
      isActive: profile.is_active ?? true,
      createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
      lastLogin: profile.last_login ? new Date(profile.last_login) : new Date()
    };
  };

  const displayProfile = getDisplayValue(currentUserProfile);

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <h4 className="text-red-400 font-medium mb-2">Errors:</h4>
            <ul className="text-red-300 text-sm space-y-1">
              {Object.entries(errors).map(([key, message]) => (
                <li key={key}>• {message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Upper Layer - Basic Profile Info */}
        <div className="profile-card mb-6">
          <div className="p-8">
            <div className="profile-header flex items-start gap-8">
              {/* Profile Picture */}
              <div className="profile-avatar-container">
                <div className="profile-avatar overflow-hidden">
                  {profileData.profilePicture ? (
                    <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="avatar-upload-btn"
                  title="Change profile picture"
                  aria-label="Change profile picture"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  aria-label="Profile picture upload"
                />
              </div>

              {/* Profile Info */}
              <div className="profile-info flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="profile-name">
                        {userProfile.displayName || `${displayProfile.firstName} ${displayProfile.lastName}`}
                      </h1>
                      <div className={`profile-status ${displayProfile.isActive ? 'status-active' : 'status-inactive'
                        }`}>
                        <div className={`status-dot ${displayProfile.isActive ? 'active' : 'inactive'}`} />
                        {displayProfile.isActive ? t('profile.status.active') : t('profile.status.inactive')}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2 profile-email">
                        <Mail size={16} />
                        <span>{displayProfile.email}</span>
                      </div>
                      <div className="profile-role">
                        <div className={`role-badge role-${currentUserProfile.role}`}>
                          <RoleIcon size={16} />
                          <span>{t(`profile.roles.${currentUserProfile.role}`)}</span>
                        </div>
                        {nextRole && (
                          <button
                            onClick={() => setShowRoleUpgradeModal(true)}
                            className="role-upgrade-btn ml-2"
                            title={`Upgrade to ${nextRole}`}
                          >
                            <Crown size={24} />
                          </button>
                        )}
                      </div>
                    </div>

                    {profileData.bio && (
                      <p className="profile-bio">{profileData.bio}</p>
                    )}

                    <div className="profile-meta">
                      <span>Joined {displayProfile.createdAt.toLocaleDateString()}</span>
                      {displayProfile.lastLogin && (
                        <span>Last active {displayProfile.lastLogin.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="profile-actions">
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "secondary" : "primary"}
                      size="small"
                      icon={<Edit3 size={16} />}
                      iconPosition="left"
                    >
                      {isEditing ? t('profile.cancel') : t('profile.editProfile')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Layer - Tabs */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="profile-tabs">
            <div className="tab-nav">
              <button
                onClick={() => setActiveTab('profile')}
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''
                  }`}
              >
                <User size={18} />
                {t('profile.tabs.details')}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`tab-button ${activeTab === 'settings' ? 'active' : ''
                  }`}
              >
                <Settings size={18} />
                {t('profile.tabs.settings')}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' && (
            <div className="profile-content">
              {/* Basic Information */}
              <div className="profile-card">
                <div className="p-6">
                  <div className="profile-section-profile">
                    <div className="section-header">
                      <User size={20} className="section-icon" />
                      <h3 className="section-title">{t('profile.sections.basicInfo')}</h3>
                    </div>

                    {isEditing ? (
                      <div className="profile-form">
                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.firstName')}</label>
                          <input
                            type="text"
                            id="firstName"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                            className="form-input"
                            placeholder={t('profile.fields.firstName')}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.lastName')}</label>
                          <input
                            type="text"
                            id="lastName"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                            className="form-input"
                            placeholder={t('profile.fields.lastName')}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.displayName')}</label>
                          <input
                            type="text"
                            id="displayName"
                            value={editForm.displayName}
                            onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                            className="form-input"
                            placeholder={t('profile.fields.displayName')}
                          />
                          {errors.displayName && (
                            <div className="text-red-400 text-sm mt-1">{errors.displayName}</div>
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.email')}</label>
                          <input
                            type="email"
                            id="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="form-input"
                            placeholder={t('profile.fields.email')}
                          />
                          {errors.email && (
                            <div className="text-red-400 text-sm mt-1">{errors.email}</div>
                          )}
                        </div>
                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.bio')}</label>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                            className="form-textarea"
                            rows={4}
                            placeholder={t('profile.fields.bioPlaceholder') || 'Tell us about yourself...'}
                          />
                        </div>
                        <Button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          variant="primary"
                          size="medium"
                          fullWidth={true}
                          loading={loading}
                        >
                          {t('profile.saveChanges')}
                        </Button>
                      </div>
                    ) : (
                      <div className="section-content">
                        <div className="field-group">
                          <span className="field-label">{t('profile.fields.firstName')}:</span>
                          <span className="field-value">{displayProfile.firstName} {displayProfile.lastName}</span>
                        </div>
                        <div className="field-group">
                          <span className="field-label">{t('profile.fields.displayName')}:</span>
                          <span className="field-value">{displayProfile.displayName}</span>
                        </div>
                        <div className="field-group">
                          <span className="field-label">{t('profile.fields.email')}:</span>
                          <span className="field-value">{displayProfile.email}</span>
                        </div>
                        {profileData.bio && (
                          <div className="field-group">
                            <span className="field-label">{t('profile.fields.bio')}:</span>
                            <p className="field-value mt-1">{profileData.bio}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Astronomy Experience */}
              <div className="profile-card">
                <div className="p-6">
                  <div className="profile-section-profile">
                    <div className="section-header">
                      <Telescope size={20} className="section-icon" />
                      <h3 className="section-title">{t('profile.sections.astronomyInfo')}</h3>
                    </div>

                    <div className="profile-form">
                      <div className="form-group">
                        <label className="form-label">{t('profile.fields.astronomyExperience')}</label>
                        <select
                          value={profileData.astronomyExperience}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            astronomyExperience: e.target.value as ProfileData['astronomyExperience']
                          }))}
                          className="form-select"
                          disabled={!isEditing}
                          aria-label="Astronomy experience level"
                        >
                          <option value="beginner">{t('profile.experienceLevels.beginner')}</option>
                          <option value="intermediate">{t('profile.experienceLevels.intermediate')}</option>
                          <option value="advanced">{t('profile.experienceLevels.advanced')}</option>
                          <option value="expert">{t('profile.experienceLevels.expert')}</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t('profile.fields.observationExperience')}</label>
                        <input
                          type="number"
                          value={profileData.observationExperience}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            observationExperience: parseInt(e.target.value) || 0
                          }))}
                          className="form-input"
                          disabled={!isEditing}
                          min="0"
                          aria-label="Years of observation experience"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t('profile.fields.favoriteFields')}</label>
                        <div className="tag-selection">
                          {astronomyFields.map(field => (
                            <button
                              key={field}
                              onClick={() => {
                                if (!isEditing) return;
                                setProfileData(prev => ({
                                  ...prev,
                                  favoriteAstronomyFields: prev.favoriteAstronomyFields?.includes(field)
                                    ? prev.favoriteAstronomyFields.filter(f => f !== field)
                                    : [...(prev.favoriteAstronomyFields || []), field]
                                }));
                              }}
                              className={`tag ${profileData.favoriteAstronomyFields?.includes(field)
                                ? 'tag-selected'
                                : 'tag-unselected'
                                }`}
                              disabled={!isEditing}
                            >
                              {t(`profile.astronomyFields.${field.toLowerCase().replace(/\s+/g, '')}`) || field}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="checkbox-group">
                        <input
                          type="checkbox"
                          id="telescopeOwned"
                          checked={profileData.telescopeOwned}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            telescopeOwned: e.target.checked
                          }))}
                          className="form-checkbox"
                          disabled={!isEditing}
                          aria-label="I own a telescope"
                        />
                        <label htmlFor="telescopeOwned" className="checkbox-label">{t('profile.fields.telescopeOwned')}</label>
                      </div>

                      {profileData.telescopeOwned && (
                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.telescopeType')}</label>
                          <input
                            type="text"
                            id="telescopeType"
                            value={profileData.telescopeType || ''}
                            onChange={(e) => setProfileData(prev => ({
                              ...prev,
                              telescopeType: e.target.value
                            }))} disabled={!isEditing}
                            className="form-input"
                            placeholder={t('profile.fields.telescopeType') || 'e.g., Celestron NexStar 8SE'}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role-Specific Information */}
              {(currentUserProfile.role === 'mentor' || currentUserProfile.role === 'guide') && (
                <div className="profile-card">
                  <div className="p-6">
                    <div className="profile-section-profile">
                      <div className="section-header">
                        <Award size={20} className="section-icon" />
                        <h3 className="section-title">{t('profile.sections.roleSpecific')}</h3>
                      </div>

                      <div className="profile-form">
                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.yearsOfExperience')}</label>
                          <input
                            type="number"
                            id="yearsOfExperience"
                            value={profileData.yearsOfExperience?.toString() || ''}
                            onChange={(e) => setProfileData(prev => ({
                              ...prev,
                              yearsOfExperience: parseInt(e.target.value) || 0
                            }))}
                            disabled={!isEditing}
                            min="0"
                            className="form-input"
                            placeholder={t('profile.fields.yearsOfExperience')}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.mentoringAreas')}</label>
                          <textarea
                            value={profileData.mentoringAreas?.join(', ') || ''}
                            onChange={(e) => setProfileData(prev => ({
                              ...prev,
                              mentoringAreas: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            }))} className="form-textarea"
                            rows={3}
                            disabled={!isEditing}
                            placeholder={t('profile.fields.mentoringAreas') || 'Astrophotography, Telescope setup, Observation planning...'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentUserProfile.role === 'influencer' && (
                <div className="profile-card">
                  <div className="p-6">
                    <div className="profile-section-profile">
                      <div className="section-header">
                        <Star size={20} className="section-icon" />
                        <h3 className="section-title">{t('profile.sections.roleSpecific')}</h3>
                      </div>

                      <div className="profile-form">
                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.socialMediaFollowers')}</label>
                          <input
                            type="number"
                            id="socialMediaFollowers"
                            value={profileData.socialMediaFollowers?.toString() || ''}
                            onChange={(e) => setProfileData(prev => ({
                              ...prev,
                              socialMediaFollowers: parseInt(e.target.value) || 0
                            }))}
                            disabled={!isEditing}
                            min="0"
                            className="form-input"
                            placeholder={t('profile.fields.socialMediaFollowers')}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.contentPlatforms')}</label>
                          <div className="tag-selection">
                            {contentPlatforms.map(platform => (
                              <button
                                key={platform}
                                onClick={() => {
                                  if (!isEditing) return;
                                  setProfileData(prev => ({
                                    ...prev,
                                    contentPlatforms: prev.contentPlatforms?.includes(platform)
                                      ? prev.contentPlatforms.filter(p => p !== platform)
                                      : [...(prev.contentPlatforms || []), platform]
                                  }));
                                }}
                                className={`tag ${profileData.contentPlatforms?.includes(platform)
                                  ? 'tag-selected'
                                  : 'tag-unselected'
                                  }`}
                                disabled={!isEditing}
                              >
                                {platform}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(currentUserProfile.role === 'learner' || currentUserProfile.role === 'enthusiast') && (
                <div className="profile-card">
                  <div className="p-6">
                    <div className="profile-section-profile">
                      <div className="section-header">
                        <Rocket size={20} className="section-icon" />
                        <h3 className="section-title">{t('profile.sections.roleSpecific')}</h3>
                      </div>

                      <div className="profile-form">
                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.learningGoals')}</label>
                          <textarea
                            value={profileData.learningGoals?.join(', ') || ''}
                            onChange={(e) => setProfileData(prev => ({
                              ...prev,
                              learningGoals: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            }))} className="form-textarea"
                            rows={3}
                            disabled={!isEditing}
                            placeholder={t('profile.fields.learningGoals') || 'Learn astrophotography, Master telescope operation...'}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">{t('profile.fields.currentProjects')}</label>
                          <textarea
                            value={profileData.currentProjects?.join(', ') || ''}
                            onChange={(e) => setProfileData(prev => ({
                              ...prev,
                              currentProjects: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            }))} className="form-textarea"
                            rows={3}
                            disabled={!isEditing}
                            placeholder={t('profile.fields.currentProjects') || 'Building a telescope, Photographing Orion Nebula...'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="profile-card">
                <div className="p-6">
                  <div className="profile-section-profile">
                    <div className="section-header">
                      <Globe size={20} className="section-icon" />
                      <h3 className="section-title">{t('profile.sections.socialLinks')}</h3>
                    </div>

                    <div className="profile-form">
                      <div className="form-group">
                        <label className="form-label">{t('profile.fields.location')}</label>
                        <div className="input-with-icon">
                          <MapPin size={16} className="input-icon" />
                          <input
                            type="text"
                            id="location"
                            value={profileData.location || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                            disabled={!isEditing}
                            className="form-input"
                            placeholder={t('profile.fields.locationPlaceholder') || 'Your location'}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t('profile.fields.website')}</label>
                        <div className="input-with-icon">
                          <Globe size={16} className="input-icon" />
                          <input
                            type="url"
                            id="website"
                            value={profileData.website || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                            disabled={!isEditing}
                            className="form-input"
                            placeholder={t('profile.fields.websitePlaceholder') || 'Your website'}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t('profile.fields.github')}</label>
                        <div className="input-with-icon">
                          <Github size={16} className="input-icon" />
                          <input
                            type="text"
                            id="github"
                            value={profileData.github || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, github: e.target.value }))}
                            disabled={!isEditing}
                            className="form-input"
                            placeholder={t('profile.fields.githubPlaceholder') || 'GitHub username'}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t('profile.fields.linkedin')}</label>
                        <div className="input-with-icon">
                          <Linkedin size={16} className="input-icon" />
                          <input
                            type="text"
                            id="linkedin"
                            value={profileData.linkedin || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                            disabled={!isEditing}
                            className="form-input"
                            placeholder={t('profile.fields.linkedinPlaceholder') || 'LinkedIn profile'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievements & Contributions */}
              <div className="profile-card">
                <div className="p-6">
                  <div className="profile-section-profile">
                    <div className="section-header">
                      <Award size={20} className="section-icon" />
                      <h3 className="section-title">{t('profile.sections.achievements')}</h3>
                    </div>

                    <div className="profile-form">
                      <div className="form-group">
                        <label className="form-label">{t('profile.fields.achievements')}</label>
                        <textarea
                          value={profileData.achievements?.join('\n') || ''}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            achievements: e.target.value.split('\n').filter(Boolean)
                          }))}
                          className="form-textarea"
                          rows={4}
                          disabled={!isEditing}
                          placeholder={t('profile.fields.achievementsPlaceholder') || 'List your achievements (one per line)'}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t('profile.fields.contributions')}</label>
                        <textarea
                          value={profileData.contributions?.join('\n') || ''}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            contributions: e.target.value.split('\n').filter(Boolean)
                          }))}
                          className="form-textarea"
                          rows={4}
                          disabled={!isEditing}
                          placeholder={t('profile.fields.contributionsPlaceholder') || 'List your contributions (one per line)'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-content">
              {/* General Settings */}
              <div className="profile-card">
                <div className="p-6">
                  <div className="profile-section-profile">
                    <div className="section-header">
                      <Settings size={20} className="section-icon" />
                      <h3 className="section-title">{t('profile.tabs.settings')}</h3>
                    </div>

                    <div className="profile-form">
                      <div className="form-group">
                        <label className="form-label">{t('profile.settings.language')}</label>
                        <select
                          value={settings.language}
                          onChange={(e) => {
                            setSettings(prev => ({ ...prev, language: e.target.value }));
                            // Also update the app language immediately
                            changeLanguage(e.target.value);
                          }}
                          className="form-select"
                          aria-label="Language preference"
                        >
                          <option value="en">English</option>
                          <option value="sin">සිංහල (Sinhala)</option>
                          <option value="ta">தமிழ் (Tamil)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">{t('profile.settings.profileVisibility')}</label>
                        <select
                          value={settings.profileVisibility}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            profileVisibility: e.target.value as SettingsData['profileVisibility']
                          }))}
                          className="form-select"
                          aria-label="Profile visibility setting"
                        >
                          <option value="public">{t('profile.visibility.public')}</option>
                          <option value="community-only">{t('profile.visibility.community')}</option>
                          <option value="private">{t('profile.visibility.private')}</option>
                        </select>
                      </div>

                      <Button
                        onClick={handleSaveSettings}
                        disabled={loading}
                        variant="primary"
                        size="medium"
                        fullWidth={true}
                        loading={loading}
                      >
                        {t('profile.saveSettings')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="profile-card">
                <div className="p-6">
                  <div className="profile-section-profile">
                    <div className="section-header">
                      <Bell size={20} className="section-icon" />
                      <h3 className="section-title">{t('profile.sections.notifications')}</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="settings-toggle">
                        <div className="toggle-info">
                          <div className="toggle-title">{t('profile.settings.emailNotifications')}</div>
                          <div className="toggle-description">{t('profile.settings.emailNotifications')}</div>
                        </div>
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={settings.emailNotifications}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              emailNotifications: e.target.checked
                            }))}
                            aria-label="Email notifications"
                          />
                          <span className="toggle-slider"></span>
                        </div>
                      </div>

                      <div className="settings-toggle">
                        <div className="toggle-info">
                          <div className="toggle-title">{t('profile.settings.pushNotifications')}</div>
                          <div className="toggle-description">{t('profile.settings.pushNotifications')}</div>
                        </div>
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={settings.pushNotifications}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              pushNotifications: e.target.checked
                            }))}
                            aria-label="Push notifications"
                          />
                          <span className="toggle-slider"></span>
                        </div>
                      </div>

                      <div className="settings-toggle">
                        <div className="toggle-info">
                          <div className="toggle-title">{t('profile.settings.showOnlineStatus')}</div>
                          <div className="toggle-description">{t('profile.settings.showOnlineStatus')}</div>
                        </div>
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={settings.showOnlineStatus}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              showOnlineStatus: e.target.checked
                            }))}
                            aria-label="Show online status"
                          />
                          <span className="toggle-slider"></span>
                        </div>
                      </div>

                      <div className="settings-toggle">
                        <div className="toggle-info">
                          <div className="toggle-title">{t('profile.settings.allowDirectMessages')}</div>
                          <div className="toggle-description">{t('profile.settings.allowDirectMessages')}</div>
                        </div>
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={settings.allowDirectMessages}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              allowDirectMessages: e.target.checked
                            }))}
                            aria-label="Allow direct messages"
                          />
                          <span className="toggle-slider"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="profile-card">
                <div className="p-6">
                  <div className="profile-section-profile">
                    <div className="section-header">
                      <Lock size={20} className="section-icon" />
                      <h3 className="section-title">{t('profile.sections.security')}</h3>
                    </div>

                    <div className="profile-form">
                      <Button
                        onClick={() => setShowPasswordModal(true)}
                        variant="secondary"
                        size="small"
                        fullWidth={true}
                        icon={<Lock size={16} />}
                        iconPosition="left"
                      >
                        {t('profile.actions.changePassword')}
                      </Button>

                      <Button
                        onClick={handleDataExport}
                        variant="secondary"
                        size="small"
                        fullWidth={true}
                        icon={<Eye size={16} />}
                        iconPosition="left"
                        disabled={loading}
                      >
                        {t('profile.actions.downloadData')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="profile-card danger-zone">
                <div className="p-6">
                  <div className="danger-header">
                    <AlertTriangle className="danger-icon" size={20} />
                    <h3 className="danger-title">{t('profile.sections.dangerZone')}</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-red-300 mb-2">{t('profile.actions.deleteAccount')}</h4>
                      <p className="text-sm text-gray-400 mb-4">
                        {t('profile.modals.deleteAccount.warning')}
                      </p>
                      <Button
                        onClick={() => setShowDeleteModal(true)}
                        variant="danger"
                        size="small"
                        icon={<Trash2 size={16} />}
                        iconPosition="left"
                      >
                        {t('profile.actions.deleteAccount')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="modal-header">
              <h3 className="modal-title">{t('profile.modals.changePassword.title')}</h3>
            </div>

            <div className="modal-content">
              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">{t('profile.modals.changePassword.currentPassword')}</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="form-input"
                    placeholder={t('profile.modals.changePassword.currentPassword')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('profile.modals.changePassword.newPassword')}</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="form-input"
                    placeholder={t('profile.modals.changePassword.newPassword')}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('profile.modals.changePassword.confirmPassword')}</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="form-input"
                    placeholder={t('profile.modals.changePassword.confirmPassword')}
                  />
                  {errors.password && (
                    <div className="text-red-400 text-sm mt-1">{errors.password}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button
                onClick={() => setShowPasswordModal(false)}
                variant="secondary"
                size="medium"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleChangePassword}
                disabled={loading}
                variant="primary"
                size="medium"
                loading={loading}
              >
                {t('profile.actions.changePassword')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Role Upgrade Modal */}
      {showRoleUpgradeModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="modal-header">
              <h3 className="modal-title">{t('profile.modals.roleUpgrade.title')}</h3>
            </div>

            <div className="modal-content">
              <div className="space-y-4">
                {currentUserProfile.role === 'learner' ? (
                  <>
                    <p className="text-gray-300">
                      {t('profile.modals.roleUpgrade.selectRole')}:
                    </p>
                    <div className="form-group">
                      <label className="form-label">{t('profile.modals.roleUpgrade.selectRole')}</label>
                      <select
                        value={selectedUpgradeRole}
                        onChange={(e) => setSelectedUpgradeRole(e.target.value)}
                        className="form-select"
                        aria-label="Select role for upgrade"
                      >
                        <option value="">{t('profile.modals.roleUpgrade.selectRole')}...</option>
                        {getAvailableRoleUpgrades(currentUserProfile.role).map(role => (
                          <option key={role} value={role}>
                            {t(`profile.roles.${role}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-300">
                    {t('profile.modals.roleUpgrade.description')
                      .replace('{{currentRole}}', t(`profile.roles.${currentUserProfile.role}`))
                      .replace('{{nextRole}}', nextRole ? t(`profile.roles.${nextRole}`) : '')}
                  </p>
                )}

                <div className="form-group">
                  <label className="form-label">{t('profile.modals.roleUpgrade.reason')}</label>
                  <textarea
                    value={roleUpgradeReason}
                    onChange={(e) => setRoleUpgradeReason(e.target.value)}
                    className="form-textarea"
                    rows={4}
                    placeholder={t('profile.modals.roleUpgrade.reasonPlaceholder') || 'Please explain why you want this role upgrade...'}
                  />
                  {errors.roleUpgrade && (
                    <div className="text-red-400 text-sm mt-1">{errors.roleUpgrade}</div>
                  )}
                </div>

                <p className="text-sm text-gray-400">
                  {t('profile.modals.roleUpgrade.reviewNote')}
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <Button
                onClick={() => setShowRoleUpgradeModal(false)}
                variant="secondary"
                size="medium"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleRoleUpgrade}
                disabled={loading}
                variant="primary"
                size="medium"
                loading={loading}
              >
                {t('profile.modals.roleUpgrade.submitRequest')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="modal-header">
              <h3 className="modal-title text-red-400">{t('profile.actions.deleteAccount')}</h3>
            </div>

            <div className="modal-content">
              <div className="space-y-4">
                <p className="text-gray-300">
                  {t('profile.modals.deleteAccount.warning')}
                </p>

                <p className="text-sm text-gray-400">
                  {t('profile.modals.deleteAccount.details')}
                </p>

                <div className="form-group">
                  <label className="form-label">{t('profile.modals.deleteAccount.confirmation')}</label>
                  <input
                    type="text"
                    id="deleteConfirmation"
                    className="form-input"
                    placeholder="DELETE"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    id="deletePassword"
                    value={deleteAccountPassword}
                    onChange={(e) => setDeleteAccountPassword(e.target.value)}
                    className="form-input"
                    placeholder="Enter your password"
                  />
                  {errors.account && (
                    <div className="text-red-400 text-sm mt-1">{errors.account}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
                size="medium"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={loading}
                variant="danger"
                size="medium"
                loading={loading}
              >
                {t('profile.actions.deleteAccount')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
