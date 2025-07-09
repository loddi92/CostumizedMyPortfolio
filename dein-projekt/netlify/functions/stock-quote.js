const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const symbol = event.queryStringParameters.symbol;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'API Key not configured in environment variables.' })
    };
  }

  if (!symbol) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Symbol parameter is required.' })
    };
  }

  const quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
  const overviewUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;

  try {
    const [quoteResponse, overviewResponse] = await Promise.all([
      fetch(quoteUrl),
      fetch(overviewUrl)
    ]);

    const quote = await quoteResponse.json();
    const overview = await overviewResponse.json();

    if (!quote['Global Quote']) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Keine Daten gefunden für das Symbol.' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ quote, overview })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fehler beim Abrufen der Daten.', details: error.message })
    };
  }
};
