// Test script to verify backend registration behavior
console.log('🔍 Testing backend registration endpoint...');

async function testBackendRegistration() {
    const API_BASE_URL = 'http://localhost:5000/api';
    
    // Test 1: Registration without token (should fail)
    console.log('\n1. Testing registration without token...');
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                displayName: 'Test User',
                firstName: 'Test',
                lastName: 'User',
                role: 'learner'
            })
        });
        
        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', text);
        console.log('Content-Type:', response.headers.get('content-type'));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    // Test 2: Registration with fake token (should fail with specific error)
    console.log('\n2. Testing registration with fake token...');
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer fake-token-123'
            },
            body: JSON.stringify({
                displayName: 'Test User',
                firstName: 'Test',
                lastName: 'User',
                role: 'learner'
            })
        });
        
        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', text);
        console.log('Content-Type:', response.headers.get('content-type'));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    // Test 3: Check if registration endpoint exists
    console.log('\n3. Testing if registration endpoint exists...');
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'OPTIONS'
        });
        
        console.log('Status:', response.status);
        console.log('Allowed methods:', response.headers.get('allow'));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    console.log('\n🎯 Analysis:');
    console.log('If you see 404 errors, the registration endpoint does not exist');
    console.log('If you see 401 with "User not found or inactive", the endpoint exists but has the bug');
    console.log('If you see 401 with "Invalid token", the endpoint exists and is working correctly');
}

testBackendRegistration();
