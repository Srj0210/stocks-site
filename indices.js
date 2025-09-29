const YAHOO_API = "https://query1.finance.yahoo.com/v8/finance/chart/";

// Indian & Global symbols
const indices = {
  nifty50: { symbol: "^NSEI", element: "nifty50Chart", label: "Nifty 50" },
  sensex: { symbol: "^BSESN", element: "sensexChart", label: "Sensex" },
  banknifty: { symbol: "^NSEBANK", element: "bankniftyChart", label: "Bank Nifty" },
  dow: { symbol: "^DJI", element: "dowChart", label: "Dow Jones" },
  nasdaq: { symbol: "^IXIC", element: "nasdaqChart", label: "NASDAQ" },
  ftse: { symbol: "^FTSE", element: "ftseChart", label: "FTSE 100" },
};

let currentRange = "1d"; // default

// Store charts so we can update them
const charts = {};

// Fetch Yahoo data
async function fetchChartData(symbol, range = "1d", interval = "1d") {
  try {
    const url = `${YAHOO_API}${symbol}?range=${range}&interval=${interval}`;
    const res = await fetch(url);
    const json = await res.json();
    const result = json.chart.result[0];
    const timestamps = result.timestamp || [];
    const prices = result.indicators.quote[0].close;

    // Format labels as dates
    const labels = timestamps.map(t =>
      new Date(t * 1000).toLocaleDateString("en-GB", { month: "short", day: "numeric" })
    );

    return { labels, prices };
  } catch (e) {
    console.error("Error fetching data", symbol, e);
    return { labels: [], prices: [] };
  }
}

// Render chart
async function renderChart(index, range) {
  const { symbol, element, label } = indices[index];
  const interval = range === "1d" ? "5m" : range === "5d" ? "30m" : "1d";
  const { labels, prices } = await fetchChartData(symbol, range, interval);

  const ctx = document.getElementById(element).getContext("2d");

  if (charts[element]) {
    charts[element].destroy();
  }

  charts[element] = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label,
        data: prices,
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        borderWidth: 2,
        pointRadius: 2,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        x: { ticks: { color: "#aaa" } },
        y: { ticks: { color: "#aaa" } }
      }
    }
  });
}

// Load all charts
function loadAllCharts() {
  Object.keys(indices).forEach(index => renderChart(index, currentRange));
}

// Change range
function changeRange(range) {
  currentRange = range;
  document.querySelectorAll(".time-btn").forEach(btn =>
    btn.classList.remove("active")
  );
  document.querySelector(`.time-btn[onclick="changeRange('${range}')"]`).classList.add("active");
  loadAllCharts();
}

// Initial load
loadAllCharts();