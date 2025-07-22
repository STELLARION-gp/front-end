# Firebase Storage Setup & Troubleshooting Guide

## The Error You're Seeing
```
POST https://firebasestorage.googleapis.com/v0/b/stellarion-b76d6.firebasestorage.app/o?name=blog-images%2Ftemp%2F... net::ERR_FAILED
```

This indicates Firebase Storage is not properly configured or enabled.

## Quick Fix Steps

### 1. Enable Firebase Storage
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `stellarion-b76d6`
3. Click **Storage** in the left sidebar
4. Click **Get started**
5. Choose **Start in test mode** (for now)
6. Select a location (choose closest to your users)

### 2. Update Storage Rules (Temporary - for testing)
In Firebase Console > Storage > Rules, replace with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // TEMPORARY - for testing only
    }
  }
}
```

### 3. Production Storage Rules (Use after testing)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Blog images
    match /blog-images/{blogId}/{filename} {
      allow read: if true; // Public read
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024 // 5MB limit
                   && request.resource.contentType.matches('image/.*'); // Images only
      allow delete: if request.auth != null;
    }
    
    // Temp uploads
    match /blog-images/temp/{filename} {
      allow read, write, delete: if request.auth != null
                                 && request.resource.size < 5 * 1024 * 1024
                                 && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 4. Test the Setup
1. Open your app in the browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. You should see: `✅ Firebase Storage is properly configured`
5. If you see errors, check the console output

## Debugging Steps

### Check Firebase Configuration
1. In browser console, run:
```javascript
// Check if Firebase is properly initialized
console.log('Firebase app:', firebase.app());
console.log('Storage bucket:', firebase.app().options.storageBucket);
```

### Check Network Tab
1. Open Developer Tools > Network tab
2. Try uploading an image
3. Look for any failed requests to `firebasestorage.googleapis.com`
4. Check the response for specific error messages

### Common Issues & Solutions

#### Issue: "Firebase Storage is not enabled"
**Solution:** Enable Storage in Firebase Console

#### Issue: "Permission denied" 
**Solution:** Update Storage rules to allow writes

#### Issue: "CORS error"
**Solution:** This is usually fixed by proper Firebase configuration

#### Issue: "Auth required"
**Solution:** Make sure user is signed in, or adjust rules for unauthenticated uploads

#### Issue: "Quota exceeded"
**Solution:** Check Firebase Storage usage in console

## Test Upload Function
Add this to your browser console to test:
```javascript
// Test Firebase Storage upload
const testUpload = async () => {
  try {
    const config = await window.FirebaseStorageService?.checkConfiguration();
    console.log('Configuration:', config);
  } catch (error) {
    console.error('Test failed:', error);
  }
};
testUpload();
```

## Expected Behavior After Setup
1. ✅ Create blog without image → Uses default image URL
2. ✅ Create blog with image → Uploads to Firebase Storage
3. ✅ Edit blog → Replaces old image in Firebase Storage
4. ✅ Delete blog → Removes image from Firebase Storage

## Next Steps
1. Enable Firebase Storage in console
2. Set up test rules
3. Try uploading an image
4. Check browser console for any remaining errors
5. Switch to production rules when ready

## Support
If you continue having issues:
1. Check the browser console for detailed error messages
2. Verify your Firebase project settings
3. Ensure you have the correct permissions in Firebase Console
