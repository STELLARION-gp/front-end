/**
 * Profile API Integration Test Script
 * 
 * Open browser console on http://localhost:5174 and run:
 * fetch('/profile-test.js').then(r => r.text()).then(eval)
 * 
 * Or copy-paste this script directly into the browser console
 */

console.log('🚀 Starting Profile API Integration Test...');

// Test 1: Check if user is authenticated
async function testAuth() {
    console.log('\n=== Test 1: Authentication Status ===');
    
    // Access Firebase auth from the global scope
    const { auth } = window.firebase || {};
    
    if (!auth) {
        console.error('❌ Firebase auth not available. Make sure user is on the app page.');
        return false;
    }
    
    const user = auth.currentUser;
    console.log('🔍 Current user:', {
        exists: !!user,
        email: user?.email,
        uid: user?.uid,
        displayName: user?.displayName
    });
    
    if (!user) {
        console.error('❌ No user logged in. Please log in first.');
        return false;
    }
    
    // Test getting Firebase ID token
    try {
        const token = await user.getIdToken();
        console.log('✅ Firebase ID token obtained:', token.substring(0, 50) + '...');
        return true;
    } catch (error) {
        console.error('❌ Error getting Firebase ID token:', error);
        return false;
    }
}

// Test 2: Direct API call to backend
async function testBackendHealth() {
    console.log('\n=== Test 2: Backend Health Check ===');
    
    try {
        const response = await fetch('http://localhost:5000/api/health');
        const data = await response.json();
        console.log('✅ Backend health check:', { status: response.status, data });
        return response.ok;
    } catch (error) {
        console.error('❌ Backend health check failed:', error);
        return false;
    }
}

// Test 3: Test profile API call with auth
async function testProfileAPI() {
    console.log('\n=== Test 3: Profile API Test ===');
    
    const { auth } = window.firebase || {};
    if (!auth?.currentUser) {
        console.error('❌ No authenticated user for profile API test');
        return false;
    }
    
    try {
        const token = await auth.currentUser.getIdToken();
        console.log('🔑 Using token:', token.substring(0, 50) + '...');
        
        const response = await fetch('http://localhost:5000/api/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📨 Profile API response status:', response.status);
        
        const data = await response.json();
        console.log('📋 Profile API response data:', data);
        
        if (response.ok) {
            console.log('✅ Profile API call successful');
            return true;
        } else {
            console.error('❌ Profile API call failed:', data);
            return false;
        }
    } catch (error) {
        console.error('❌ Profile API call error:', error);
        return false;
    }
}

// Test 4: Test CORS and network connectivity
async function testCORS() {
    console.log('\n=== Test 4: CORS and Network Test ===');
    
    try {
        // Test without authentication first
        const response = await fetch('http://localhost:5000/api/health', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ CORS test successful. Status:', response.status);
        return true;
    } catch (error) {
        console.error('❌ CORS or network error:', error);
        console.log('💡 Possible issues:');
        console.log('   - Backend not running on port 5000');
        console.log('   - CORS not properly configured on backend');
        console.log('   - Network connectivity issues');
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🧪 Running Profile API Integration Tests...\n');
    
    const results = {
        auth: await testAuth(),
        backend: await testBackendHealth(),
        cors: await testCORS(),
        profile: false
    };
    
    if (results.auth && results.backend && results.cors) {
        results.profile = await testProfileAPI();
    }
    
    console.log('\n=== Test Results Summary ===');
    console.log('🔐 Authentication:', results.auth ? '✅ PASS' : '❌ FAIL');
    console.log('🏥 Backend Health:', results.backend ? '✅ PASS' : '❌ FAIL');
    console.log('🌐 CORS/Network:', results.cors ? '✅ PASS' : '❌ FAIL');
    console.log('👤 Profile API:', results.profile ? '✅ PASS' : '❌ FAIL');
    
    if (Object.values(results).every(Boolean)) {
        console.log('\n🎉 All tests passed! Profile integration is working correctly.');
    } else {
        console.log('\n⚠️ Some tests failed. Check the details above for troubleshooting.');
        
        if (!results.auth) {
            console.log('💡 To fix auth: Make sure you are logged in to the application');
        }
        if (!results.backend) {
            console.log('💡 To fix backend: Make sure the server is running on port 5000');
        }
        if (!results.cors) {
            console.log('💡 To fix CORS: Check backend CORS configuration');
        }
        if (!results.profile) {
            console.log('💡 To fix profile: Check authentication token and backend user setup');
        }
    }
    
    return results;
}

// Auto-run tests
runAllTests().catch(console.error);
