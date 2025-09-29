const API_KEY = "1DN696HA3A109GY3";  // तेरी API Key

// Yahoo symbols ≠ AlphaVantage symbols
const indianIndices = [
  { symbol: "BSE:SENSEX", name: "Sensex", code: "^BSESN" },
  { symbol: "NSE:NIFTY50", name: "Nifty 50", code: "^NSEI" },
  { symbol: "NSE:BANKNIFTY", name: "Bank Nifty", code: "^NSEBANK" }
];

const globalIndices = [
  { symbol: "DJI", name: "Dow Jones", code: "DJI" },
  { symbol: "IXIC", name: "Nasdaq", code: "IXIC" },
  { symbol: "FTSE", name: "FTSE 100", code: "FTSE" }
];

// Chart बनाना
function createChart(ctx, label, dates, prices, color) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label,
        data: prices,
        borderColor: color,
        backgroundColor: color + "33",
        fill: true,
        tension: 0.3,
        pointRadius: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        x: { ticks: { color: "#ccc" } },
        y: { ticks: { color: "#ccc" } }
      }
    }
  });
}

// Data fetch करना
async function fetchData(symbol, label, containerId, color, days=7) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data["Time Series (Daily)"]) {
      document.getElementById(containerId).innerHTML += `<p class="text-red-500">⚠️ Failed to load ${label}</p>`;
      return;
    }

    const series = data["Time Series (Daily)"];
    const dates = Object.keys(series).slice(0, days).reverse();
    const prices = dates.map(d => parseFloat(series[d]["4. close"]));

    const canvas = document.createElement("canvas");
    document.getElementById(containerId).appendChild(canvas);

    createChart(canvas.getContext("2d"), label, dates, prices, color);
  } catch (e) {
    document.getElementById(containerId).innerHTML += `<p class="text-red-500">⚠️ Error loading ${label}</p>`;
  }
}

// Load सभी indices
function loadIndices(days=7) {
  document.getElementById("indianIndices").innerHTML = "";
  document.getElementById("globalIndices").innerHTML = "";

  indianIndices.forEach(idx => fetchData(idx.code, idx.name, "indianIndices", "blue", days));
  globalIndices.forEach(idx => fetchData(idx.code, idx.name, "globalIndices", "green", days));
}

// Time period buttons
document.querySelectorAll(".time-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("bg-blue-600","text-white"));
    btn.classList.add("bg-blue-600","text-white");
    loadIndices(parseInt(btn.dataset.range));
  });
});

// Initial load
loadIndices();