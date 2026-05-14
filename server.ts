import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes FIRST
  app.post("/api/analyze", async (req, res, next) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Chave da API do Gemini não configurada no servidor." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const { text, images } = req.body;

      // Extract URLs from text if present to help the instruction
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const hasUrls = text && text.match(urlRegex);
      
      const prompt = `Você é um especialista em checagem de fatos e jornalismo investigativo ligado à internet com acesso atualizado às notícias.
Você TEM acesso a uma ferramenta de pesquisa de internet (Google Search). USE SEMPRE A FERRAMENTA DE PESQUISA para validar fatos, dados e verificar se a notícia foi desmentida por agências de checagem recentemente, antes de dar o seu veredito.
Analise a seguinte informação (texto e/ou imagens). Se houver múltiplas imagens, faça um comparativo detalhado entre elas, apontando inconsistências ou correlações.
Determine a probabilidade de ser Fake News usando também as informações que você encontrar na internet através das pesquisas.${hasUrls ? '\\n\\nEspecialmente para os links informados, pesquise ativamente o conteúdo dessas URLs e o que outras fontes dizem sobre elas.' : ''}
Explique o seu raciocínio de forma clara e profissional, apontando sinais de alerta (sensacionalismo, falta de fontes, manipulação de imagens, etc.).
No início da sua resposta, adicione uma das seguintes tags exatas na primeira linha (sozinha), dependendo da sua conclusão:
[FALSO] - Se tiver alta chance de ser Fake News ou manipulação (ou se foi comprovado ser falso).
[VERDADEIRO] - Se comprovado como autêntico e confiável com base em sites seguros de checagem.
[INCONCLUSIVO] - Se requer mais pesquisa ou não há embasamento online suficiente.

Após a tag, forneça o relatório detalhado em português com fontes.`;

      const contents: any[] = [];
      
      for (const img of images || []) {
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
          systemInstruction: "Você é um especialista em checagem de fatos e jornalismo investigativo ligado à internet. Você TEM acesso a uma ferramenta de pesquisa de internet (Google Search). Utilize-a para pesquisar os URLs ou temas informados para obter a verdade.",
          tools: [{ googleSearch: {} }]
        }
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Error evaluating with Gemini:", error);
      res.status(500).json({ error: error.message || "Erro interno no servidor." });
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
