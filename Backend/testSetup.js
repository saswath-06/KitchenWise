// testSetup.js
const mongoose = require('mongoose');
const { getGeminiModel } = require('./config/gemini');
require('dotenv').config();

async function testConnection() {
    console.log('\n🔍 Testing Backend Components...\n');

    // 1. Test MongoDB Connection
    console.log('Testing MongoDB Connection...');
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully!\n');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message, '\n');
    }

    // 2. Test Environment Variables
    console.log('Checking Environment Variables...');
    const requiredEnvVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'GEMINI_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
        console.log('✅ All Required Environment Variables Present!\n');
    } else {
        console.error('❌ Missing Environment Variables:', missingVars.join(', '), '\n');
    }

    // 3. Test Gemini AI Connection
    console.log('Testing Gemini AI Connection...');
    try {
        const model = getGeminiModel();
        const result = await model.generateContent('Hello, are you working?');
        console.log('✅ Gemini AI Connection Successful!\n');
    } catch (error) {
        console.error('❌ Gemini AI Connection Failed:', error.message, '\n');
    }

    // 4. Check File Permissions
    const fs = require('fs');
    console.log('Checking Upload Directory...');
    try {
        if (!fs.existsSync('./uploads')) {
            fs.mkdirSync('./uploads');
        }
        fs.accessSync('./uploads', fs.constants.W_OK);
        console.log('✅ Upload Directory is Writable!\n');
    } catch (error) {
        console.error('❌ Upload Directory Check Failed:', error.message, '\n');
    }

    // Cleanup
    await mongoose.connection.close();
    process.exit();
}

testConnection();