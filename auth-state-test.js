const { spawn } = require('child_process');

// Test current authentication state
console.log('🔍 Testing authentication state...');

// Test 1: Check if user is logged in (via localStorage or Firebase)
console.log('\n📱 Testing frontend authentication state...');

// Create a simple Node.js script to test backend directly
const testScript = `
const fetch = require('node-fetch');

async function testBackendAuth() {
    console.log('🔧 Testing backend authentication...');
    
    // Test 1: Health endpoint (should work without auth)
    try {
        const healthResponse = await fetch('http://localhost:5000/api/health');
        const healthText = await healthResponse.text();
        console.log('✅ Health endpoint:', healthResponse.status, healthText);
    } catch (error) {
        console.error('❌ Health endpoint failed:', error.message);
    }
    
    // Test 2: Profile endpoint without auth (should return 401)
    try {
        const profileResponse = await fetch('http://localhost:5000/api/user/profile');
        const profileText = await profileResponse.text();
        console.log('📋 Profile endpoint (no auth):', profileResponse.status, profileText);
    } catch (error) {
        console.error('❌ Profile endpoint (no auth) failed:', error.message);
    }
    
    // Test 3: Profile endpoint with fake token (should return 401/403)
    try {
        const fakeTokenResponse = await fetch('http://localhost:5000/api/user/profile', {
            headers: {
                'Authorization': 'Bearer fake-token-123'
            }
        });
        const fakeTokenText = await fakeTokenResponse.text();
        console.log('🔐 Profile endpoint (fake token):', fakeTokenResponse.status, fakeTokenText);
    } catch (error) {
        console.error('❌ Profile endpoint (fake token) failed:', error.message);
    }
}

testBackendAuth();
`;

// Write and run the test script
const fs = require('fs');
fs.writeFileSync('temp-auth-test.js', testScript);

console.log('🚀 Running backend authentication test...');
const child = spawn('node', ['temp-auth-test.js'], { stdio: 'inherit' });

child.on('close', (code) => {
    console.log(`\n✅ Backend test completed with code: ${code}`);
    
    // Clean up
    try {
        fs.unlinkSync('temp-auth-test.js');
    } catch (e) {
        // Ignore cleanup errors
    }
});
