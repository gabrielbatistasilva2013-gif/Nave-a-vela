import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeFakeNews(text: string, images: { base64: string, mimeType: string }[]) {
  try {
    const prompt = `Você é um especialista em checagem de fatos e jornalismo investigativo. 
Analise a seguinte informação (texto e/ou imagens). Se houver múltiplas imagens, faça um comparativo detalhado entre elas, apontando inconsistências ou correlações.
Determine a probabilidade de ser Fake News.
Explique o seu raciocínio de forma clara e profissional, apontando sinais de alerta (sensacionalismo, falta de fontes, manipulação de imagens, etc.).
No início da sua resposta, adicione uma das seguintes tags exatas na primeira linha (sozinha), dependendo da sua conclusão:
[FALSO] - Se tiver alta chance de ser Fake News ou manipulação.
[VERDADEIRO] - Se parecer autêntico e confiável.
[INCONCLUSIVO] - Se requer mais pesquisa ou é duvidoso.

Após a tag, forneça o relatório detalhado em português.
`;

    const contents: any[] = [];
    
    for (const img of images) {
       contents.push({
         inlineData: {
           data: img.base64.split(',')[1] || img.base64, // Extract base64 part
           mimeType: img.mimeType
         }
       });
    }

    if (text) {
      contents.push(prompt + "\n\nConteúdo a analisar:\n" + text);
    } else {
      contents.push(prompt + "\n\nConteúdo a analisar: A(s) imagem(ns) em anexo.");
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });

    return response.text;
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw new Error('Falha ao conectar com a IA. Tente novamente mais tarde.');
  }
}
