import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  console.error("CRITICAL ERROR: GEMINI_API_KEY is missing in your .env file!");
  process.exit(1);
}

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

export default ai;