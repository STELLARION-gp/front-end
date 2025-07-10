// API Test Script for Profile Endpoints
// Run this in browser console to test API connectivity

const API_BASE_URL = 'http://localhost:5000/api';

// Test basic connectivity
async function testHealth() {
    try {
        const response = await fetch('http://localhost:5000/health');
        const data = await response.json();
        console.log('✅ Health check:', data);
        return true;
    } catch (error) {
        console.error('❌ Health check failed:', error);
        return false;
    }
}

// Test CORS and basic API structure
async function testCORS() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📨 CORS Test Response Status:', response.status);
        const data = await response.json();
        console.log('📨 CORS Test Response:', data);
        
        // Should return 401 unauthorized, not a CORS error
        if (response.status === 401) {
            console.log('✅ CORS working correctly (401 unauthorized as expected)');
            return true;
        } else {
            console.log('⚠️ Unexpected response status');
            return false;
        }
    } catch (error) {
        console.error('❌ CORS test failed:', error);
        return false;
    }
}

// Test with fake token
async function testWithFakeAuth() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer fake-token-for-testing'
            }
        });
        
        console.log('📨 Fake Auth Test Status:', response.status);
        const data = await response.json();
        console.log('📨 Fake Auth Test Response:', data);
        
        // Should return 401 or 403, not a network error
        if (response.status === 401 || response.status === 403) {
            console.log('✅ Authentication flow working correctly');
            return true;
        } else {
            console.log('⚠️ Unexpected auth response');
            return false;
        }
    } catch (error) {
        console.error('❌ Auth test failed:', error);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('🧪 Starting API connectivity tests...\n');
    
    const healthOk = await testHealth();
    console.log('');
    
    const corsOk = await testCORS();
    console.log('');
    
    const authOk = await testWithFakeAuth();
    console.log('');
    
    console.log('📊 Test Results:');
    console.log(`Health Check: ${healthOk ? '✅' : '❌'}`);
    console.log(`CORS: ${corsOk ? '✅' : '❌'}`);
    console.log(`Auth Flow: ${authOk ? '✅' : '❌'}`);
    
    if (healthOk && corsOk && authOk) {
        console.log('\n🎉 All tests passed! API is ready for frontend integration.');
        console.log('The "failed to fetch" errors are likely due to authentication issues.');
        console.log('Make sure users are properly logged in through Firebase.');
    } else {
        console.log('\n⚠️ Some tests failed. Check the specific errors above.');
    }
}

// Export for easy access
window.apiTests = {
    testHealth,
    testCORS,
    testWithFakeAuth,
    runAllTests
};

console.log('🔧 API Test utilities loaded!');
console.log('Run: apiTests.runAllTests() to test all endpoints');
console.log('Or run individual tests: apiTests.testHealth(), apiTests.testCORS(), etc.');
