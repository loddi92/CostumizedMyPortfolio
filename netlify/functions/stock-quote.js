const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const { symbol } = event.queryStringParameters || {};
  
  if (!symbol) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Symbol parameter required' })
    };
  }
  
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API Key not configured' })
      };
    }

    const [quoteRes, overviewRes] = await Promise.all([
      fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`),
      fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`)
    ]);
    
    const [quoteData, overviewData] = await Promise.all([
      quoteRes.json(),
      overviewRes.json()
    ]);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        quote: quoteData,
        overview: overviewData
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};