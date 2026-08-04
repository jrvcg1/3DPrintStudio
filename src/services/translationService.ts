/**
 * Service for translating English product titles and descriptions to Spanish
 * using free API endpoints with graceful fallbacks.
 */

export async function translateToSpanish(text: string): Promise<string> {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return text;
  }

  // If text is short (e.g. 1-2 words), check if translation is needed
  const cleanInput = text.trim();

  try {
    // Break into chunks if text is long (> 400 chars) to prevent API limits
    const chunks = splitIntoChunks(cleanInput, 400);
    const translatedChunks: string[] = [];

    for (const chunk of chunks) {
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|es`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        const json = await response.json();
        if (json && json.responseData && json.responseData.translatedText) {
          translatedChunks.push(json.responseData.translatedText);
          continue;
        }
      }
      // If single chunk failed, keep original chunk
      translatedChunks.push(chunk);
    }

    return translatedChunks.join(' ');
  } catch (error) {
    console.warn('Translation service warning: using original text due to network state.', error);
    return cleanInput;
  }
}

/**
 * Splits long text into paragraph/sentence friendly chunks
 */
function splitIntoChunks(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];

  const sentences = text.split(/(?<=[.?!])\s+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + ' ' + sentence).length > maxLength) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks.length > 0 ? chunks : [text];
}
