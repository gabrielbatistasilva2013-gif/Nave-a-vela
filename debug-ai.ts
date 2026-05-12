import { GoogleGenAI } from '@google/genai';
import "dotenv/config";

(async () => {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const text = 'A terra é quadrada';
        const prompt = `Você é um especialista em checagem de fatos e jornalismo investigativo. 
Analise a seguinte informação (texto e/ou imagens). Se houver múltiplas imagens, faça um comparativo detalhado entre elas, apontando inconsistências ou correlações.
Determine a probabilidade de ser Fake News.
Explique o seu raciocínio de forma clara e profissional, apontando sinais de alerta (sensacionalismo, falta de fontes, manipulação de imagens, etc.).
No início da sua resposta, adicione uma das seguintes tags exatas na primeira linha (sozinha), dependendo da sua conclusão:
[FALSO] - Se tiver alta chance de ser Fake News ou manipulação.
[VERDADEIRO] - Se parecer autêntico e confiável.
[INCONCLUSIVO] - Se requer mais pesquisa ou é duvidoso.

Após a tag, forneça o relatório detalhado em português.`;

        const contents: any[] = [];
        contents.push(prompt + "\n\nConteúdo a analisar:\n" + text);
        console.log("Sending...");
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
        });
        console.log("OK:", response.text.substring(0, 50));
    } catch(err) {
        console.error("ERROR:");
        console.error(err);
    }
})();
