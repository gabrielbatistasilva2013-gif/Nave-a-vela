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
          throw e;
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

export async function generateQuizQuestions(difficulty: string, count: number) {
  try {
    const response = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty, count, _t: Date.now() })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro na API.');
    }
    return data.questions || [];
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    return [];
  }
}
