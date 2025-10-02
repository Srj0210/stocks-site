// ====== TradingView Stock Search ======
const input = document.getElementById("stockInput");
const suggestions = document.getElementById("suggestions");
const chartDiv = document.getElementById("stockChart");

const popularStocks = [
  { symbol: "NSE:RELIANCE", name: "Reliance" },
  { symbol: "NSE:TCS", name: "TCS" },
  { symbol: "NSE:HDFCBANK", name: "HDFC Bank" },
  { symbol: "NSE:INFY", name: "Infosys" },
  { symbol: "NASDAQ:AAPL", name: "Apple" },
  { symbol: "NASDAQ:GOOGL", name: "Google" },
  { symbol: "NASDAQ:MSFT", name: "Microsoft" },
  { symbol: "NYSE:TSLA", name: "Tesla" }
];

// Show suggestions
input.addEventListener("input", () => {
  const q = input.value.toLowerCase();
  suggestions.innerHTML = "";
  if (!q) { suggestions.classList.add("hidden"); return; }

  const matches = popularStocks.filter(s => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q));
  if (matches.length === 0) { suggestions.classList.add("hidden"); return; }

  matches.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `${m.name} (${m.symbol})`;
    li.className = "p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600";
    li.onclick = () => selectStock(m.symbol, m.name);
    suggestions.appendChild(li);
  });

  suggestions.classList.remove("hidden");
});

// Load chart
function selectStock(symbol, name) {
  suggestions.classList.add("hidden");
  chartDiv.innerHTML = `<h3 class="font-semibold mb-2">${name}</h3><div id="tv_chart"></div>`;
  new TradingView.widget({
    "width": "100%",
    "height": 400,
    "symbol": symbol,
    "interval": "D",
    "timezone": "Asia/Kolkata",
    "theme": document.documentElement.classList.contains("dark") ? "dark" : "light",
    "style": "1",
    "hide_top_toolbar": false,
    "hide_legend": false,
    "allow_symbol_change": true,
    "container_id": "tv_chart"
  });
}