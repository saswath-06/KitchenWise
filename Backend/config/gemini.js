const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY in environment variables!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const geminiConfig = {
  temperature: 0.7,
  maxOutputTokens: 2048,
  topK: 40,
  topP: 0.8,
};

const getGeminiModel = () => {
  try {
    console.log('🔍 Initializing Gemini Vision Model...');
    return genAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // Updated to use a valid model
      ...geminiConfig,
    });
  } catch (error) {
    console.error('❌ Failed to initialize Gemini Vision Model:', error.message);
    throw error;
  }
};

const getTextModel = () => {
  try {
    console.log('🔍 Initializing Gemini Text Model...');
    return genAI.getGenerativeModel({
      model: 'gemini-1.5-text', // Updated to a compatible text model
      ...geminiConfig,
    });
  } catch (error) {
    console.error('❌ Failed to initialize Gemini Text Model:', error.message);
    throw error;
  }
};

// Optional: Add a fallback mechanism if a model is unavailable or deprecated
const getFallbackModel = () => {
  try {
    console.log('🔄 Initializing Fallback Model...');
    return genAI.getGenerativeModel({
      model: 'gemini-1.5-text', // Fallback to text-based model if vision fails
      ...geminiConfig,
    });
  } catch (error) {
    console.error('❌ Failed to initialize Fallback Model:', error.message);
    throw error;
  }
};

module.exports = {
  getGeminiModel,
  getTextModel,
  getFallbackModel,
};
