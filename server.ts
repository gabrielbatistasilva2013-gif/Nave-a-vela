import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ override: true });

import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // API Route for Gemini analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text, images } = req.body;
      
      const prompt = `Você é um especialista em checagem de fatos e jornalismo investigativo ligado à internet com acesso atualizado às notícias.
Você TEM acesso a uma ferramenta de pesquisa de internet (Google Search). USE SEMPRE A FERRAMENTA DE PESQUISA para validar fatos, dados e verificar se a notícia foi desmentida por gências de checagem recentemente, antes de dar o seu veredito.
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

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error('Error analyzing content:', error);
      res.status(500).json({ error: 'Falha ao conectar com a IA. Tente novamente mais tarde.', details: error.message || String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Since Express v4 is used (package.json has ^^4.21.2)
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
