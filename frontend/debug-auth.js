// Debug token script for frontend
// Run this in the browser console to check Firebase authentication

console.log('🔍 Firebase Auth Debug');
console.log('Current user:', auth.currentUser);

if (auth.currentUser) {
  console.log('📧 User email:', auth.currentUser.email);
  console.log('🆔 User UID:', auth.currentUser.uid);
  
  // Try to get the ID token
  auth.currentUser.getIdToken().then(token => {
    console.log('🔑 Token obtained successfully');
    console.log('📏 Token length:', token.length);
    console.log('🧩 Token parts:', token.split('.').length);
    console.log('🔤 Token preview:', token.substring(0, 50) + '...');
    
    // Decode the payload to check content
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('📦 Token payload:', {
        iss: payload.iss,
        aud: payload.aud,
        exp: new Date(payload.exp * 1000),
        iat: new Date(payload.iat * 1000),
        sub: payload.sub,
        email: payload.email
      });
    } catch (e) {
      console.error('❌ Failed to decode token payload:', e);
    }
    
  }).catch(error => {
    console.error('❌ Failed to get token:', error);
  });
} else {
  console.log('❌ No user is currently signed in');
  console.log('🔄 Checking authentication state...');
  
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log('✅ User signed in:', user.email);
    } else {
      console.log('❌ User is signed out');
    }
  });
}
