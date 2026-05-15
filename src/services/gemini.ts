export async function analyzeFakeNews(text: string, images: { base64: string, mimeType: string }[]) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, images })
    });

    if (!response.ok) {
      let errorText = "Falha ao conectar com o servidor. (Status: " + response.status + ")";
      try {
         const contentType = response.headers.get("content-type");
         if (contentType && contentType.includes("application/json")) {
           const errorData = await response.json();
           errorText = errorData.error || errorText;
         } else {
           const text = await response.text();
           if (response.status === 503) {
             errorText = "O servidor está sobrecarregado no momento e não consegue responder agora. (Erro 503). Tente mais tarde.";
           } else if (response.status === 404) {
             errorText = "A rota de análise não foi encontrada (Erro 404). Se você acessou por um Share Link, publique as atualizações.";
           } else {
             errorText += " - " + text.slice(0, 100);
           }
         }
      } catch (e) {
         // Ignore JSON parse errors
      }
      throw new Error(errorText);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.analysis;
  } catch (error: any) {
    console.error('Error analyzing content:', error);
    throw new Error(error.message || 'Erro ao comunicar com o servidor de análise.');
  }
}



