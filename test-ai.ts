import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "hi",
      config: {
        tools: [{ urlContext: {} } as any]
      }
    });
    console.log('Success:', response.text);
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}
test();
