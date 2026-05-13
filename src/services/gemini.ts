export async function analyzeFakeNews(text: string, images: { base64: string, mimeType: string }[]) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, images })
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao conectar com o servidor.');
      } catch (e) {
        if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
          throw e; // throw the parsed error
        }
        throw new Error('Falha ao conectar com o servidor.');
      }
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    return data.analysis;
  } catch (error: any) {
    console.error('Error analyzing content:', error);
    throw new Error(error.message || 'Deu erro ao se conectar ao servidor.');
  }
}
