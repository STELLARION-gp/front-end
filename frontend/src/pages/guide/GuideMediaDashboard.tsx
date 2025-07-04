import React from 'react';
import MediaUploadPanel from './MediaUploadPanel';

// Example of how to integrate the MediaUploadPanel into a Guide Dashboard
const GuideMediaDashboard: React.FC = () => {
  
  const handleMediaUploaded = (newMedia: any[]) => {
    console.log('New media uploaded:', newMedia);
    // Here you would typically:
    // 1. Send the media to your backend API
    // 2. Update your global state/context
    // 3. Show success notification
    // 4. Refresh the user's media gallery
  };

  return (
    <div className="guide-dashboard-page">
      <div className="page-header">
        <h1>Media Gallery</h1>
        <p>Manage photos and videos from your astronomy tours</p>
      </div>
      
      <MediaUploadPanel 
        onMediaUploaded={handleMediaUploaded}
        maxFileSize={50} // 50MB limit
        allowedTypes={[
          'image/jpeg', 
          'image/png', 
          'image/webp', 
          'video/mp4', 
          'video/webm', 
          'video/quicktime'
        ]}
      />
    </div>
  );
};

export default GuideMediaDashboard;
