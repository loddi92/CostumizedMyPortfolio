const fs = require("fs");
const fetch = require("node-fetch");

const API_KEY = process.env.EODHD_API_KEY;
const BASE_URL = "https://eodhd.com/api";

(async () => {
  const exchangesRes = await fetch(`${BASE_URL}/exchanges-list/?api_token=${API_KEY}&fmt=json`);
  const exchanges = await exchangesRes.json();

  let allSymbols = [];

  for (const ex of exchanges) {
    const code = ex.Code;
    console.log(`📥 ${code}`);
    try {
      const url = `${BASE_URL}/exchange-symbol-list/${code}?api_token=${API_KEY}&fmt=json`;
      const res = await fetch(url);
      const data = await res.json();
      data.forEach((entry) => {
        allSymbols.append({
          symbol: entry.Code,
          name: entry.Name,
          region: entry.Country || code
        });
      });
    } catch (err) {
      console.error(`❌ Fehler bei ${code}:`, err.message);
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  fs.writeFileSync("symbols_all.json", JSON.stringify(allSymbols, null, 2));
  console.log(`✅ Fertig! ${allSymbols.length} Symbole gespeichert.`);
})();
