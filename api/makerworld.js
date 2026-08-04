/**
 * Vercel Serverless Function — MakerWorld API Proxy
 * Fetches model data server-side to avoid CORS restrictions in the browser.
 * Usage: GET /api/makerworld?id=441051
 */
export default async function handler(req, res) {
  // Allow CORS from any origin (our own frontend)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string' || !/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'Se requiere un ID numérico de modelo MakerWorld válido.' });
  }

  const apiUrl = `https://makerworld.com/api/v1/design-service/design/${id}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; 3DPrintStudio/1.0)',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `MakerWorld API respondió con error ${response.status}`,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'No se pudo conectar a MakerWorld.',
      details: error.message,
    });
  }
}
