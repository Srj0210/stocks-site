// ===== Market Indices (Yahoo Finance + Proxy Fix) =====

// Proxy to bypass CORS
const proxy = "https://api.allorigins.win/raw?url=";

// Yahoo Finance chart API
function YF_API(symbol, range = "5d") {
  return `${proxy}https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=1d`;
}

// Chart.js instances
const charts = {};

async function fetchIndexData(symbol, label, canvasId, range = "5d") {
  try {
    const res = await fetch(YF_API(symbol, range));
    const data = await res.json();

    const result = data.chart.result[0];
    const timestamps = result.timestamp.map(ts =>
      new Date(ts * 1000).toLocaleDateString("en-GB", { weekday: "short" })
    );
    const prices = result.indicators.quote[0].close;

    const ctx = document.getElementById(canvasId).getContext("2d");

    // Destroy old chart before re-render
    if (charts[canvasId]) charts[canvasId].destroy();

    charts[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels: timestamps,
        datasets: [{
          label,
          data: prices,
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          borderWidth: 2,
          pointRadius: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true } },
        scales: { x: { display: true }, y: { display: true } }
      }
    });

  } catch (err) {
    console.error("Error fetching index:", symbol, err);
    document.getElementById(canvasId).parentElement.innerHTML =
      `<p class="text-red-400">⚠️ Failed to load ${label}</p>`;
  }
}

// Render all charts
function renderAllCharts(range = "5d") {
  fetchIndexData("^NSEI", "Nifty 50", "niftyChart", range);
  fetchIndexData("^BSESN", "Sensex", "sensexChart", range);
  fetchIndexData("^NSEBANK", "Bank Nifty", "bankNiftyChart", range);
  fetchIndexData("^DJI", "Dow Jones", "dowChart", range);
  fetchIndexData("^IXIC", "Nasdaq", "nasdaqChart", range);
  fetchIndexData("^FTSE", "FTSE 100", "ftseChart", range);
}

// Time range buttons
function setRange(range) {
  renderAllCharts(range);
}

// First load
document.addEventListener("DOMContentLoaded", () => {
  renderAllCharts("5d");
});