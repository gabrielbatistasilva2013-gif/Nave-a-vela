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
      const apiKey = (process.env.gemini || process.env.GEMINI_API_KEY)?.trim();
      
      if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey === '') {
        return res.status(500).json({ error: "Chave do sistema não configurada. Verifique as configurações." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const { text, images } = req.body;

      // Extract URLs from text if present to help the instruction
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const hasUrls = text && text.match(urlRegex);
      
      const prompt = `Você é um especialista em checagem de fatos e jornalismo investigativo ligado à internet com forte conhecimento sobre notícias.
Analise a seguinte informação (texto e/ou imagens). Se houver múltiplas imagens, faça um comparativo detalhado entre elas, apontando inconsistências ou correlações.
Determine a probabilidade de ser Fake News usando seu conhecimento.
Explique o seu raciocínio de forma clara e profissional, apontando sinais de alerta (sensacionalismo, falta de fontes, manipulação de imagens, etc.).
No início da sua resposta, adicione uma das seguintes tags exatas na primeira linha (sozinha), dependendo da sua conclusão:
[FALSO] - Se tiver alta chance de ser Fake News ou manipulação (ou se foi comprovado ser falso).
[VERDADEIRO] - Se comprovado como autêntico e confiável com base em sites seguros de checagem.
[INCONCLUSIVO] - Se requer mais análise detalhada ou não há embasamento suficiente.

Após a tag, forneça o relatório detalhado em português com fontes ou referências em que você se baseia.`;

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

      let response;
      let attempt = 0;
      const MAX_RETRIES = 3;

      while (attempt < MAX_RETRIES) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
              systemInstruction: `Você é um especialista em checagem de fatos e jornalismo investigativo ligado à internet. Analise os fatos com bastante atenção. Data e hora atual: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}. Use a internet para verificar notícias recentes e contextos atuais.`,
              tools: [{ googleSearch: {} }]
            }
          });
          break; // success
        } catch (err: any) {
          const errMsg = err.message || "";
          if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("429")) {
            attempt++;
            if (attempt >= MAX_RETRIES) {
              throw err;
            }
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1500 * attempt));
          } else {
            throw err;
          }
        }
      }

      res.json({ analysis: response?.text || "Análise concluída, porém sem texto de resposta." });
    } catch (error: any) {
      console.error("Error evaluating:", error);
      
      const errorMessage = error.message || "";
      if (errorMessage.includes("API key not valid") || errorMessage.includes("API_KEY_INVALID")) {
          return res.status(500).json({ error: "A chave de configuração atual é inválida. Verifique as configurações de sistema." });
      }

      if (errorMessage.includes("500") || errorMessage.includes("UNAVAILABLE") || errorMessage.includes("503") || errorMessage.includes("429")) {
          return res.status(503).json({ error: "O sistema está muito sobrecarregado no momento e não consegue responder agora. Espere alguns instantes e tente analisar novamente." });
      }

      res.status(500).json({ error: errorMessage || "Erro interno no servidor." });
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
