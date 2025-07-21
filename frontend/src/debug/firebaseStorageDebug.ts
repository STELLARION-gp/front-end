// Firebase Storage Debug Helper
// Run this in the browser console to debug Firebase Storage issues

import { FirebaseStorageService } from '../services/firebaseStorage';

export async function debugFirebaseStorage() {
    console.log('=== Firebase Storage Debug ===');
    
    // Check configuration
    const config = await FirebaseStorageService.checkConfiguration();
    console.log('Configuration check:', config);
    
    if (!config.isConfigured) {
        console.error('❌ Firebase Storage is not properly configured:');
        config.errors.forEach((error: string) => console.error('  -', error));
        return;
    }
    
    console.log('✅ Firebase Storage is properly configured');
    
    // Test connection
    const canConnect = await FirebaseStorageService.testConnection();
    console.log('Connection test:', canConnect ? '✅ Success' : '❌ Failed');
    
    return config;
}

// Instructions for manual testing
export function getManualTestInstructions() {
    return `
=== Manual Firebase Storage Testing ===

1. Open browser console
2. Run: debugFirebaseStorage()
3. Check the output for errors

Common Issues:
- Firebase Storage not enabled in Firebase Console
- Security rules blocking uploads
- CORS issues
- Authentication problems

Firebase Console Checklist:
1. Go to Firebase Console > Storage
2. Click "Get Started" if not enabled
3. Choose "Start in test mode" or set up proper rules
4. Check the storage bucket URL matches your config

Security Rules for Testing:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // WARNING: Use only for testing
    }
  }
}

Production Security Rules:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /blog-images/{blogId}/{filename} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null;
    }
  }
}
`;
}
