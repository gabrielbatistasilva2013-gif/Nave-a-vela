import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60; // Set Vercel function timeout to 60 seconds

export default async function handler(req: any, res: any) {
  // Allow cors if accessed directly, though usually not needed if same domain
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { text, images } = req.body;
    
    // Check if the API key is configured on Vercel
    const apiKey = process.env.GEMINI_API_KEY || process.env.CHAVE_API_GEMINI_KEY_NAV;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Poxa, o sistema de verificação não está configurado. O administrador precisa definir a chave no servidor.' 
      });
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    const prompt = `Você é um especialista em checagem de fatos e jornalismo investigativo ligado à internet com acesso atualizado às notícias.
Você TEM acesso a uma ferramenta de pesquisa de internet (Google Search). USE SEMPRE A FERRAMENTA DE PESQUISA para validar fatos, dados e verificar se a notícia foi desmentida por agências de checagem recentemente, antes de dar o seu veredito.
Analise a seguinte informação (texto e/ou imagens). Se houver múltiplas imagens, faça um comparativo detalhado entre elas, apontando inconsistências ou correlações.
Determine a probabilidade de ser Fake News usando também as informações que você encontrar na internet através das pesquisas.
Explique o seu raciocínio de forma clara e profissional, apontando sinais de alerta (sensacionalismo, falta de fontes, manipulação de imagens, etc.).
No início da sua resposta, adicione uma das seguintes tags exatas na primeira linha (sozinha), dependendo da sua conclusão:
[FALSO] - Se tiver alta chance de ser Fake News ou manipulação (ou se foi comprovado ser falso).
[VERDADEIRO] - Se comprovado como autêntico e confiável com base em sites seguros de checagem.
[INCONCLUSIVO] - Se requer mais pesquisa ou não há embasamento online suficiente.

Após a tag, forneça o relatório detalhado em português com fontes.`;

    const contents: any[] = [];
    
    for (const img of images || []) {
       contents.push({
         inlineData: {
           data: img.base64.split(',')[1] || img.base64,
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
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    res.status(200).json({ analysis: response.text });
  } catch (error: any) {
    console.error('Error analyzing content via Vercel Edge/Serverless:', error);
    res.status(500).json({ error: 'Deu erro ao se conectar ao servidor.', details: error.message || String(error) });
  }
}
