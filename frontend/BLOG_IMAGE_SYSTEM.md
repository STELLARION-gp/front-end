# Blog Image Upload System

## Overview
This system handles blog featured images using Firebase Storage with automatic fallback to a default image.

## How it works

### 1. Image Upload Process
- When creating a blog, users can optionally select a featured image
- If an image is selected, it's uploaded to Firebase Storage in the path: `/blog-images/{blogId}/{timestamp}_{filename}`
- If no image is selected, the system uses the default image URL: `https://charleslittleton.wordpress.com/wp-content/uploads/2022/01/cropped-pexels-photo-110854-1.jpeg`

### 2. Image Storage Structure
```
Firebase Storage
└── blog-images/
    ├── temp/           # Temporary uploads during blog creation
    │   └── {timestamp}_{filename}
    └── {blogId}/       # Final images organized by blog ID
        └── {timestamp}_{filename}
```

### 3. Database Storage
- The `blogs` table has an `image_url` field (VARCHAR 500)
- This stores either:
  - Firebase Storage download URL (for uploaded images)
  - Default image URL (when no image is uploaded)

### 4. Image Management
- **Upload**: New images are uploaded to Firebase Storage
- **Update**: When editing a blog with a new image:
  - New image is uploaded
  - Old image is deleted (unless it's the default image)
  - Database is updated with new URL
- **Delete**: When deleting a blog, associated images are removed from Firebase Storage

### 5. Security Rules
Firebase Storage rules ensure:
- Anyone can read blog images (public access)
- Only authenticated users can upload images
- File size limit: 5MB
- Only image files are allowed
- Only authenticated users can delete images

### 6. Error Handling
- Upload failures are gracefully handled
- Fallback to local preview if Firebase upload fails
- Old images are cleaned up on update/delete failures
- Default image is used when upload fails

### 7. UI Features
- Image preview before upload
- Upload progress indication
- File validation
- Drag and drop support (can be added)
- Image compression (can be added)

## Usage

### Creating a Blog with Image
1. Click "Create New Blog"
2. Fill in title and content
3. Optionally select a featured image
4. Click "Publish Blog" or "Save as Draft"

### Updating Blog Image
1. Edit an existing blog
2. Select a new image (optional)
3. Save changes
4. Old image is automatically replaced

### Default Image
If no image is selected, the system automatically uses a beautiful astronomy image as the default featured image.

## File Structure
```
src/
├── services/
│   └── firebaseStorage.ts    # Firebase Storage service
├── pages/
│   └── influencer/
│       └── myblogs.tsx       # Blog management component
└── firebase.ts               # Firebase configuration
```

## Configuration Required

### 1. Firebase Console
1. Enable Firebase Storage in your Firebase project
2. Set up the security rules (see `storage.rules` file)

### 2. Environment Variables
Ensure your Firebase configuration is properly set in `src/firebase.ts`

### 3. Backend API
The backend should handle the `image_url` field in:
- `POST /api/blogs` (create blog)
- `PUT /api/blogs/:id` (update blog)
- `DELETE /api/blogs/:id` (delete blog)

## Best Practices
- Images are automatically optimized for storage
- Unique filenames prevent conflicts
- Proper error handling and user feedback
- Clean up unused images
- Use appropriate image sizes (recommended: 1200x600px or 2:1 aspect ratio)
