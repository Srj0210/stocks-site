// ===== Indices Config =====
const indicesConfig = {
  indian: [
    { symbol: "^NSEI", name: "Nifty 50" },
    { symbol: "^BSESN", name: "Sensex" },
    { symbol: "^CNXIT", name: "Nifty IT" },
    { symbol: "^BANKNIFTY", name: "Bank Nifty" },
    { symbol: "^NSEMDCP50", name: "Nifty Midcap 50" }
  ],
  global: [
    { symbol: "^DJI", name: "Dow Jones" },
    { symbol: "^GSPC", name: "S&P 500" },
    { symbol: "^IXIC", name: "Nasdaq" },
    { symbol: "^FTSE", name: "FTSE 100" },
    { symbol: "^N225", name: "Nikkei 225" }
  ]
};

// ===== Utility: Create Chart =====
function renderChart(container, title, labels, data) {
  const canvas = document.createElement("canvas");
  canvas.className = "w-72 h-56 bg-gray-100 dark:bg-gray-900 rounded shadow";
  container.appendChild(canvas);

  new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: title,
        data,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.3)",
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        x: { display: false },
        y: { display: true }
      }
    }
  });
}

// ===== Fetch Yahoo Finance =====
async function fetchIndex(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=5d&interval=1d`;
  const res = await fetch(url);
  const json = await res.json();
  const result = json.chart.result[0];
  const timestamps = result.timestamp.map(ts =>
    new Date(ts * 1000).toLocaleDateString("en-GB")
  );
  const prices = result.indicators.quote[0].close;
  return { labels: timestamps, data: prices };
}

// ===== Load Indices =====
async function loadIndices() {
  const indianContainer = document.getElementById("indianIndicesContainer");
  const globalContainer = document.getElementById("globalIndicesContainer");

  for (let ind of indicesConfig.indian) {
    try {
      const { labels, data } = await fetchIndex(ind.symbol);
      renderChart(indianContainer, ind.name, labels, data);
    } catch (e) {
      console.error("Error loading", ind.name, e);
    }
  }

  for (let ind of indicesConfig.global) {
    try {
      const { labels, data } = await fetchIndex(ind.symbol);
      renderChart(globalContainer, ind.name, labels, data);
    } catch (e) {
      console.error("Error loading", ind.name, e);
    }
  }
}

document.addEventListener("DOMContentLoaded", loadIndices);