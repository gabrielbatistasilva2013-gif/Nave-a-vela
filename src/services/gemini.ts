export async function analyzeFakeNews(text: string, images: { base64: string, mimeType: string }[]) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, images })
    });

    if (!response.ok) {
      throw new Error('Falha ao conectar com o servidor.');
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    return data.analysis;
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw new Error('Falha ao conectar com a IA. Tente novamente mais tarde.');
  }
}
