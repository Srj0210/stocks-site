// indices.js

const indianSymbols = [
  { name: "Nifty 50", symbol: "^NSEI" },
  { name: "Sensex", symbol: "^BSESN" },
  { name: "Bank Nifty", symbol: "^NSEBANK" },
  { name: "Nifty 100", symbol: "^CNX100" },
  { name: "Nifty 500", symbol: "^CRSLDX" }
];

const globalSymbols = [
  { name: "Dow Jones", symbol: "^DJI" },
  { name: "Nasdaq", symbol: "^IXIC" },
  { name: "S&P 500", symbol: "^GSPC" },
  { name: "FTSE 100", symbol: "^FTSE" },
  { name: "Nikkei 225", symbol: "^N225" }
];

const YF_API = (symbol, range) =>
  `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=1d`;

let currentPeriod = "1mo";

async function loadIndices() {
  renderCharts("indianIndices", indianSymbols);
  renderCharts("globalIndices", globalSymbols);
}

async function renderCharts(containerId, symbols) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  for (const s of symbols) {
    const chartId = `chart-${s.symbol.replace(/[^a-zA-Z0-9]/g, "")}`;
    const card = document.createElement("div");
    card.className = "min-w-[300px] bg-gray-100 dark:bg-gray-700 p-3 rounded-lg";
    card.innerHTML = `
      <h4 class="font-semibold mb-2">${s.name}</h4>
      <canvas id="${chartId}" height="200"></canvas>
    `;
    container.appendChild(card);

    try {
      const res = await fetch(YF_API(s.symbol, currentPeriod));
      const data = await res.json();
      const result = data.chart.result[0];
      const timestamps = result.timestamp || [];
      const prices = result.indicators.quote[0].close || [];

      const labels = timestamps.map(ts =>
        new Date(ts * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      );

      new Chart(document.getElementById(chartId), {
        type: "line",
        data: {
          labels: labels,
          datasets: [{
            label: s.name,
            data: prices,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.3)",
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { x: { display: true }, y: { display: true } }
        }
      });

    } catch (err) {
      console.error("Error fetching:", s.symbol, err);
    }
  }
}

document.querySelectorAll(".time-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    document.querySelectorAll(".time-btn").forEach(b =>
      b.classList.remove("bg-blue-600", "text-white")
    );
    e.target.classList.add("bg-blue-600", "text-white");
    currentPeriod = e.target.dataset.period;
    loadIndices();
  });
});

loadIndices();