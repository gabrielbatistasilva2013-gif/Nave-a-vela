import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import "dotenv/config";
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route for Quiz Generation
  app.post("/api/quiz", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
      }
      const ai = new GoogleGenAI({ apiKey });
      const { difficulty, count } = req.body;
      const prompt = `Você está criando um quiz dinâmico sobre combate e detecção de Fake News para um projeto escolar chamado "Segurança Online com Nave à Vela - Oitavo Ano".
A dificuldade solicitada é: ${difficulty}.
Quantidade de perguntas a gerar: ${count}.

BASE DE CONTEÚDO OBRIGATÓRIA DO SITE PARA ELABORAÇÃO DAS PERGUNTAS:
1. O que são Fake News: Manipulações elaboradas projetadas para gerar indignação, medo ou choque.
2. Engenharia Emocional: Títulos em CAIXA ALTA com exclamações tentam causar pânico para engajar.
3. Viés de Confirmação: Algoritmos exibem informações que validam crenças preexistentes, criando câmaras de eco.
4. Falsa Urgência/Descontextualização: Fotos e fatos antigos republicados como se fossem novos urgentes.
5. Metodologia de Checagem: Análise sintática do texto, cruzamento de entidades, e avaliação temporal de metadados.
6. Impactos: Saúde Pública (falsos tratamentos), Democracia e Economia (fraudes).

Crie perguntas INÉDITAS e CRIATIVAS, focando estritamente nestes pontos. GERE PERGUNTAS SEMPRE DIFERENTES EM CADA CHAMADA para não ficar repetitivo.

Retorne APENAS um JSON válido. O JSON deve ser um array com os objetos, cada objeto com:
- "question" (string): A pergunta.
- "options" (array de 4 strings): As 4 alternativas de resposta.
- "correct" (number): O índice da resposta certa (de 0 a 3).
- "explanation" (string): Uma explicação do porquê a resposta está certa baseada no conteúdo do site.
O SEED DE GERAÇÃO AGORA É: ${Date.now()} e ${Math.random()}. Use essas sementes para gerar perguntas completamente diferentes da execução anterior.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.9,
        }
      });
      
      let data;
      try {
        data = JSON.parse(response.text || "[]");
      } catch (e) {
        console.error("Failed to parse", response.text);
        data = [];
      }

      res.status(200).json({ questions: data });
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      res.status(500).json({ error: 'Deu erro ao se conectar ao servidor.', details: error.message || String(error) });
    }
  });

  // API Route for Gemini analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
      }
      const ai = new GoogleGenAI({ apiKey });
      const { text, images } = req.body;
      
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
