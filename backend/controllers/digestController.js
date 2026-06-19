import ai from '../config/ai.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

// scraper function
const fetchPageText = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);

    // remove useless tags
    $('script, style, noscript').remove();

    const text = $('body').text();

    return text.replace(/\s+/g, ' ').trim().slice(0, 12000);

  } catch (err) {
    throw new Error('Failed to fetch webpage content');
  }
};

//main controller
export const processDigest = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    //scrape real content
    const pageContent = await fetchPageText(url);

    // AI prompt
    const prompt = `
You are Digester AI — a smart knowledge extraction system.

Analyze the following webpage content and extract insights.

URL: ${url}

CONTENT:
${pageContent}

Return ONLY valid JSON (no markdown, no explanation):

{
  "focusMatch": "short category like AI, Web Dev, DSA, Cloud, etc",
  "insights": [
    "3 clear actionable insights from the content",
    "simple and useful for a student",
    "no fluff or repetition"
  ]
}
`;

    //AI call
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const rawText = response.text.trim();

    //safe json parse
    let cleanData;

    try {
      cleanData = JSON.parse(rawText);
    } catch (err) {
      const start = rawText.indexOf('{');
      const end = rawText.lastIndexOf('}');
      cleanData = JSON.parse(rawText.slice(start, end + 1));
    }

    //response
    return res.status(200).json({
      status: 'success',
      url,
      ...cleanData
    });

  } catch (error) {
    console.error('Digest Error:', error);

    return res.status(500).json({
      error: 'Failed to process digest',
      details: error.message
    });
  }
};