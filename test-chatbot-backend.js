#!/usr/bin/env node

/**
 * Test script for STELLARION Chatbot Backend
 * This script tests the backend API endpoints to ensure they're working correctly
 */

const testBackendEndpoints = async () => {
    const BASE_URL = 'http://localhost:5000';
    
    console.log('🤖 Testing STELLARION Chatbot Backend...\n');
    
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    try {
        const response = await fetch(`${BASE_URL}/api/chatbot/health`);
        const data = await response.json();
        
        if (response.ok) {
            console.log('   ✅ Health check passed');
            console.log('   📊 Status:', data.status);
            console.log('   🤖 AI Provider:', data.aiProvider);
            console.log('   📅 Timestamp:', data.timestamp);
            console.log('   ⚙️  Configured:', data.configured ? 'Yes' : 'No');
        } else {
            console.log('   ❌ Health check failed:', response.status);
        }
    } catch (error) {
        console.log('   ❌ Health check error:', error.message);
        return;
    }
    
    console.log('\n2. Testing chat endpoint...');
    
    // Test 2: Simple Chat Message
    const testMessages = [
        'Hello, what is Mars?',
        'Tell me about satellites',
        'What can you help me with?'
    ];
    
    for (const message of testMessages) {
        console.log(`\n   📝 Testing message: "${message}"`);
        
        try {
            const response = await fetch(`${BASE_URL}/api/chatbot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    context: 'space_exploration_assistant'
                })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success !== false) {
                console.log('   ✅ Chat response received');
                console.log('   💬 Response:', data.response?.substring(0, 100) + '...');
                
                if (data.conversationId) {
                    console.log('   🔗 Conversation ID:', data.conversationId);
                }
            } else {
                console.log('   ❌ Chat failed:', data.error || 'Unknown error');
                if (data.details) {
                    console.log('   📋 Details:', data.details);
                }
            }
        } catch (error) {
            console.log('   ❌ Chat error:', error.message);
        }
        
        // Wait 1 second between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n🎉 Backend testing completed!');
    console.log('\n📝 Next steps:');
    console.log('   - Frontend should now be able to connect to the backend');
    console.log('   - Test the chatbot UI in the browser at http://localhost:5173');
    console.log('   - Check browser console for any connection issues');
};

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.log('❌ This script requires Node.js 18+ with fetch support');
    console.log('💡 Alternatively, test the endpoints manually with curl or Postman');
    process.exit(1);
}

testBackendEndpoints().catch(console.error);
