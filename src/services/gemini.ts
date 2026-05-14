import { GoogleGenAI } from '@google/genai';

export async function analyzeFakeNews(text: string, images: { base64: string, mimeType: string }[]) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Chave da API do Gemini não encontrada.');
    }

    const ai = new GoogleGenAI({ apiKey });
    
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
       // Ensure base64 doesn't have the prefix
       const base64Data = img.base64.includes(',') ? img.base64.split(',')[1] : img.base64;
       contents.push({
         inlineData: {
           data: base64Data,
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
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: "Você é um especialista em checagem de fatos e jornalismo investigativo ligado à internet com acesso atualizado às notícias. Você TEM acesso a uma ferramenta de pesquisa de internet (Google Search). USE SEMPRE A FERRAMENTA DE PESQUISA para validar fatos, dados e verificar se a notícia foi desmentida por agências de checagem recentemente. Trabalhe sempre com informações reais e recentes.",
        tools: [{ googleSearch: {} }]
      }
    });

    return response.text;
  } catch (error: any) {
    console.error('Error analyzing content:', error);
    throw new Error(error.message || 'Erro ao comunicar com o modelo Gemini.');
  }
}



