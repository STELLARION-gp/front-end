# Media Upload Panel Component

A comprehensive media upload and management component designed for astronomy guides to showcase photos and videos from their tours.

## Features

### 🎯 Core Functionality
- **Drag & Drop Interface**: Intuitive drag-and-drop file upload
- **Multiple File Support**: Upload multiple images and videos simultaneously
- **File Type Validation**: Supports JPEG, PNG, WebP, MP4, WebM, and MOV formats
- **File Size Limits**: Configurable maximum file size (default: 50MB)
- **Upload Progress**: Real-time upload progress indicators
- **Preview & Management**: Grid and list view options for media gallery

### 🌟 Astronomy Guide Features
- **Tour Documentation**: Add descriptions, tour names, and locations to media
- **Tag System**: Organize media with custom tags
- **Professional Portfolio**: Build a visual portfolio of astronomy tours
- **Location Tracking**: Document where each photo/video was taken
- **Search & Filter**: Find media by name, description, tour, or location

### 🎨 UI/UX Features
- **Dark Theme**: Matches the astronomy-focused design
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Polished transitions and hover effects
- **Modal Preview**: Full-screen media preview with editing capabilities
- **Gradient Accents**: Consistent with the project's cosmic theme

## Usage

### Basic Implementation

```tsx
import MediaUploadPanel from './MediaUploadPanel';

const MyComponent = () => {
  const handleMediaUploaded = (newMedia) => {
    console.log('New media uploaded:', newMedia);
    // Handle the uploaded media (save to database, update state, etc.)
  };

  return (
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
  );
};
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onMediaUploaded` | `(media: MediaFile[]) => void` | `undefined` | Callback when media is successfully uploaded |
| `maxFileSize` | `number` | `50` | Maximum file size in MB |
| `allowedTypes` | `string[]` | `['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']` | Allowed MIME types |

### MediaFile Interface

```tsx
interface MediaFile {
  id: string;           // Unique identifier
  file: File;           // Original File object
  url: string;          // Blob URL for preview
  type: 'image' | 'video'; // Media type
  name: string;         // Original filename
  size: number;         // File size in bytes
  uploadDate: Date;     // Upload timestamp
  description?: string; // User-added description
  tourName?: string;    // Associated tour name
  location?: string;    // Photo/video location
  tags?: string[];      // Custom tags
}
```

## Component Structure

```
MediaUploadPanel/
├── Upload Area (Drag & Drop)
├── Upload Progress Tracker
├── Media Controls
│   ├── Filter Tabs (All/Images/Videos)
│   ├── View Toggle (Grid/List)
│   └── Search Bar
├── Media Gallery
│   ├── Grid View
│   ├── List View
│   ├── Media Items with Hover Effects
│   └── Delete Functionality
└── Media Preview Modal
    ├── Large Preview
    ├── Metadata Editing
    └── Tour Information Form
```

## Styling

The component uses SCSS with the project's design system:

- **Colors**: Follows the cosmic theme with dark backgrounds and blue accents
- **Typography**: Uses Outfit font family
- **Spacing**: Consistent with the project's spacing system
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first approach with breakpoints

### Key Style Classes

- `.media-upload-panel` - Main container
- `.upload-area` - Drag & drop zone
- `.media-gallery` - Media grid/list container
- `.media-item` - Individual media cards
- `.media-modal` - Full-screen preview modal

## Integration Examples

### In a Guide Dashboard

```tsx
import MediaUploadPanel from '../guide/MediaUploadPanel';

const GuideDashboard = () => {
  return (
    <div className="dashboard">
      <h1>My Astronomy Tours</h1>
      <MediaUploadPanel 
        onMediaUploaded={(media) => {
          // Save to backend
          saveTourMedia(media);
          // Update local state
          setTourMedia(prev => [...prev, ...media]);
        }}
      />
    </div>
  );
};
```

### With Backend Integration

```tsx
const handleMediaUpload = async (mediaFiles) => {
  try {
    const formData = new FormData();
    
    mediaFiles.forEach((media, index) => {
      formData.append(`file-${index}`, media.file);
      formData.append(`metadata-${index}`, JSON.stringify({
        description: media.description,
        tourName: media.tourName,
        location: media.location,
        tags: media.tags
      }));
    });

    await fetch('/api/upload-tour-media', {
      method: 'POST',
      body: formData,
    });
    
    // Show success notification
    showNotification('Media uploaded successfully!');
  } catch (error) {
    console.error('Upload failed:', error);
    showNotification('Upload failed. Please try again.', 'error');
  }
};
```

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Focus Management**: Clear focus indicators
- **Alt Text**: Image descriptions for accessibility
- **Color Contrast**: High contrast for better visibility

## Performance Considerations

- **File Size Validation**: Prevents large file uploads
- **Lazy Loading**: Thumbnails loaded on demand
- **Memory Management**: Proper cleanup of blob URLs
- **Debounced Search**: Optimized search performance
- **Virtual Scrolling**: Efficient rendering for large galleries

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **File API**: Required for drag & drop functionality
- **CSS Grid**: Used for responsive layout
- **ES6+**: Modern JavaScript features

## Future Enhancements

- **Cloud Storage Integration**: Direct upload to AWS S3/Google Cloud
- **Image Editing**: Basic crop and filter capabilities
- **Batch Operations**: Select and delete multiple files
- **Export Options**: Download media as ZIP files
- **Analytics**: Track most popular tour media
- **Social Sharing**: Share tour highlights to social media
