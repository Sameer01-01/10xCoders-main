import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyCiE7qt-qkDL6LyXQ7sax3nw3w8AucFWx8";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function test() {
  try {
    const result = await model.generateContent("hello");
    console.log(result.response.text());
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

test();
