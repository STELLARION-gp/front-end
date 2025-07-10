// Test script to check backend API responses
console.log('🔍 Testing backend API responses...');

// Simple fetch test
async function testBackendAPI() {
    const API_BASE_URL = 'http://localhost:5000/api';
    
    console.log('\n1. Testing profile endpoint without token...');
    try {
        const response = await fetch(`${API_BASE_URL}/user/profile`);
        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', text);
        console.log('Content-Type:', response.headers.get('content-type'));
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    console.log('\n2. Testing profile endpoint with fake token...');
    try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            headers: {
                'Authorization': 'Bearer fake-token-123'
            }
        });
        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', text);
        console.log('Content-Type:', response.headers.get('content-type'));
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    console.log('\n3. Testing chatbot endpoint (should work)...');
    try {
        const response = await fetch(`${API_BASE_URL}/chatbot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Hello',
                conversation_id: 'test-123'
            })
        });
        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', text);
        console.log('Content-Type:', response.headers.get('content-type'));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testBackendAPI();
