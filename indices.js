// ===============================
// indices.js
// अलग फाइल, common.js से independent
// ===============================

// 🔑 API Keys (yaha apni keys daal)
const FINNHUB_KEY = "YOUR_FINNHUB_KEY_HERE";
const TWELVED_KEY = "YOUR_TWELVEDATA_KEY_HERE";

// Indian + Global indices config
const indices = [
  { id: "nifty", name: "Nifty 50", symbol_td: "NSE:NIFTY", symbol_fh: "^NSEI", color: "blue" },
  { id: "sensex", name: "Sensex", symbol_td: "BSE:SENSEX", symbol_fh: "^BSESN", color: "red" },
  { id: "banknifty", name: "Bank Nifty", symbol_td: "NSE:BANKNIFTY", symbol_fh: "^NSEBANK", color: "green" },
  { id: "dowjones", name: "Dow Jones", symbol_td: "DJI", symbol_fh: "^DJI", color: "green" },
  { id: "nasdaq", name: "Nasdaq", symbol_td: "IXIC", symbol_fh: "^IXIC", color: "orange" },
  { id: "ftse", name: "FTSE 100", symbol_td: "FTSE", symbol_fh: "^FTSE", color: "purple" }
];

// Time ranges mapping
const ranges = {
  "1D": { interval: "5min" },
  "5D": { interval: "30min" },
  "1M": { interval: "1day" },
  "6M": { interval: "1week" },
  "1Y": { interval: "1month" }
};

// ===============================
// Helper functions
// ===============================

// DOM card create karo
function createCard(index) {
  const container = document.getElementById(index.section || (index.id.includes("nifty") || index.id.includes("sensex") ? "indianIndices" : "globalIndices"));
  const card = document.createElement("div");
  card.className = "bg-gray-800 rounded-lg shadow p-3 mb-4 min-w-[300px]";
  card.innerHTML = `
    <h3 class="font-bold mb-2">${index.name}</h3>
    <canvas id="chart-${index.id}" height="200"></canvas>
    <p id="status-${index.id}" class="text-xs text-gray-400 mt-1">Loading...</p>
  `;
  container.appendChild(card);
}

// Historical data from TwelveData
async function fetchHistorical(symbol, rangeKey) {
  const interval = ranges[rangeKey].interval;
  const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=${interval}&outputsize=100&apikey=${TWELVED_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.values) throw new Error("Data not available");
  return data.values.reverse(); // reverse for old→new
}

// Chart render/update
function renderChart(canvasId, values, label, color) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  const labels = values.map(v => v.datetime);
  const prices = values.map(v => parseFloat(v.close));

  if (window[canvasId]) {
    window[canvasId].data.labels = labels;
    window[canvasId].data.datasets[0].data = prices;
    window[canvasId].update();
    return;
  }

  window[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: prices,
        borderColor: color,
        backgroundColor: color + "33",
        borderWidth: 2,
        fill: true,
        pointRadius: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "#ccc" } },
        y: { ticks: { color: "#ccc" } }
      }
    }
  });
}

// Live update with Finnhub
function connectFinnhub() {
  const ws = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_KEY}`);
  ws.onopen = () => {
    indices.forEach(i => {
      ws.send(JSON.stringify({ type: "subscribe", symbol: i.symbol_fh }));
    });
  };
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.data) {
      msg.data.forEach(tick => {
        const id = indices.find(i => i.symbol_fh === tick.s)?.id;
        if (id && window[`chart-${id}`]) {
          let chart = window[`chart-${id}`];
          chart.data.labels.push(new Date(tick.t).toLocaleTimeString());
          chart.data.datasets[0].data.push(tick.p);
          if (chart.data.labels.length > 50) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
          }
          chart.update();
        }
      });
    }
  };
}

// Load all indices
async function loadIndices(rangeKey = "1D") {
  for (const idx of indices) {
    const statusEl = document.getElementById(`status-${idx.id}`);
    try {
      const values = await fetchHistorical(idx.symbol_td, rangeKey);
      renderChart(`chart-${idx.id}`, values, idx.name, idx.color);
      statusEl.textContent = `Updated (${rangeKey})`;
    } catch (e) {
      statusEl.textContent = "⚠️ Failed to load " + idx.name;
      console.error(idx.name, e);
    }
  }
}

// ===============================
// Initialize
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Add cards
  indices.forEach(createCard);

  // Load default range (1D)
  loadIndices("1D");

  // Setup range buttons
  document.querySelectorAll(".range-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const range = btn.dataset.range;
      loadIndices(range);
    });
  });

  // Start live updates
  connectFinnhub();
});