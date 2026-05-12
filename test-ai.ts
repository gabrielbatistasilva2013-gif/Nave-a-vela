import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: ['Text test'],
    });
    console.log('Success:', response.text);
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
