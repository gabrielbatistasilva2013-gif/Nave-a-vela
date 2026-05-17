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
      
      const currentDateStr = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const currentYear = new Date().getFullYear();

      const prompt = `ATENÇÃO: O ANO ATUAL É EXATAMENTE ${currentYear}. A data e hora de hoje é ${currentDateStr}. VOCÊ NÃO ESTÁ NO ANO DE 2024. QUALQUER NOTÍCIA DO ANO ${currentYear} É DE HOJE, E NÃO DO FUTURO.

Você é um especialista em checagem de fatos e jornalismo investigativo ligado à internet.
Data atual para análise: ${currentDateStr}.
OBRIGATÓRIO: Faça uma pesquisa na web (Google Search) para verificar o que ocorreu recentemente, principalmente notícias novas até o dia de hoje. Se o texto contiver uma URL, utilize a internet para investigá-la.

Analise a seguinte informação (texto e/ou imagens). Se houver múltiplas imagens, faça um comparativo detalhado entre elas, apontando inconsistências ou correlações.
Determine a probabilidade de ser Fake News usando seu conhecimento atualizado pela web.
Explique o seu raciocínio de forma clara e profissional, citando as notícias reais e fontes confiáveis de sua pesquisa de hoje.
No início da sua resposta, adicione uma das seguintes tags exatas na primeira linha (sozinha), dependendo da sua conclusão:
[FALSO] - Se tiver alta chance de ser Fake News ou manipulação (ou se foi comprovado ser falso).
[VERDADEIRO] - Se comprovado como autêntico e confiável hoje.
[INCONCLUSIVO] - Se requer mais análise detalhada ou não há embasamento suficiente.

Após a tag, forneça o relatório detalhado em português com links reais das fontes pesquisadas.`;

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
          // Obtemos a data/hora exata no momento em que a requisição é feita
          const currentDateExact = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          const currentYearExact = new Date().getFullYear();

          response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
              systemInstruction: `ATENÇÃO CONTÍNUA: O ano atual é EXATAMENTE ${currentYearExact}. A data e hora exatas de AGORA (quando a pergunta foi feita) são: ${currentDateExact}. VOCÊ ESTÁ NO ANO DE ${currentYearExact}, NÃO EM QUALQUER OUTRO ANO ANTERIOR. Leve isso extremamente a sério ao avaliar se as datas dos eventos, notícias ou URLs são reais ou "do futuro". Elas não são do futuro, são informações atuais refletindo a data e hora em que a pessoa fez a pergunta. Você é um especialista em checagem de fatos e jornalismo investigativo ligado à internet. Analise os fatos com bastante atenção. Use a sua ferramenta de googleSearch (pesquisa na web) EXAUSTIVAMENTE para verificar e fundamentar sua resposta.`,
              tools: [{ googleSearch: {} }]
            }
          });
          break; // success
        } catch (err: any) {
          const errMsg = err.message || "";
          if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("429")) {
            attempt++;
            if (attempt >= MAX_RETRIES) {
              if (errMsg.includes("429")) {
                throw new Error("Quota Exceeded ou Rate Limit atingido do Gemini.");
              }
              throw err;
            }
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
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

      if (errorMessage.includes("Quota Exceeded") || errorMessage.includes("Rate Limit") || errorMessage.includes("429")) {
          return res.status(429).json({ error: "Limite de taxa atingido (muitas buscas simultâneas ou cota excedida). Aguarde alguns instantes antes de tentar analisar novamente." });
      }

      if (errorMessage.includes("500") || errorMessage.includes("UNAVAILABLE") || errorMessage.includes("503")) {
          return res.status(503).json({ error: "O sistema de IA está indisponível no momento. Espere alguns instantes e tente novamente." });
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
