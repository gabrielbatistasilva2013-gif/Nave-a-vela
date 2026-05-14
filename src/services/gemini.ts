export async function analyzeFakeNews(text: string, images: { base64: string, mimeType: string }[]) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, images })
    });

    if (!response.ok) {
      let errorText = "Falha ao conectar com o servidor.";
      try {
         const errorData = await response.json();
         let errorMsg = errorData.error || errorData.details || errorText;
         if (typeof errorMsg === 'string' && (errorMsg.includes('API key not valid') || errorMsg.includes('API_KEY_INVALID'))) {
            errorText = "A chave da API do Gemini não é válida. Verifique as configurações (Settings) do AI Studio.";
         } else {
            errorText = errorMsg;
         }
      } catch (e) {
         errorText = `Erro do servidor (${response.status}): ${response.statusText}`;
      }
      throw new Error(errorText);
    }

    const data = await response.json();
    return data.analysis;
  } catch (error: any) {
    console.error('Error analyzing content:', error);
    throw new Error(error.message || 'Erro ao comunicar com o servidor de análise.');
  }
}



