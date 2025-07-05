// Debug utilities for authentication issues
import { auth, googleProvider } from '../firebase';

export const debugAuthConfiguration = () => {
  console.log('🔧 Auth Debug Information:');
  console.log('Current domain:', window.location.hostname);
  console.log('Current port:', window.location.port);
  console.log('Current protocol:', window.location.protocol);
  console.log('Auth domain:', auth.app.options.authDomain);
  console.log('Project ID:', auth.app.options.projectId);
  console.log('API Key present:', !!auth.app.options.apiKey);
  console.log('Google provider configured:', !!googleProvider);
  
  // Check if we're in a secure context
  console.log('Secure context:', window.isSecureContext);
  console.log('HTTPS:', window.location.protocol === 'https:');
  
  // Check if localStorage is available
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('localStorage available:', true);
  } catch {
    console.log('localStorage available:', false);
  }
  
  // Check if cookies are enabled
  const cookieEnabled = navigator.cookieEnabled;
  console.log('Cookies enabled:', cookieEnabled);
  
  // Check user agent
  console.log('User agent:', navigator.userAgent);
};

export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Test if we can access the auth instance
    const currentUser = auth.currentUser;
    console.log('Current user:', currentUser?.email || 'None');
    
    // Test if we can get the auth domain
    const authDomain = auth.app.options.authDomain;
    console.log('Auth domain accessible:', authDomain);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return false;
  }
};
