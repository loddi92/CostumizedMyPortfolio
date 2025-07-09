const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { keywords } = event.queryStringParameters;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(keywords)}&apikey=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
