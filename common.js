// ====== API URL ======
const API_URL = "https://script.google.com/macros/s/AKfycby-VuqKc03bVz8OKCscnLZYsXX0RXcISFqVdXlp5BE7s4sXXIb9kw6bA1JuHFyT6u9R/exec";

// ====== Analytics Auto Inject ======
(function addAnalytics() {
  const GA_ID = "G-FJGKC63PF4";
  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(ga);
    ga.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag("js", new Date());
      gtag("config", GA_ID);
    };
  }
})();

// ====== Loader ======
function showLoader(elId) {
  const el = document.getElementById(elId);
  if (el) el.innerHTML = `<p class="text-center text-gray-400">⏳ Loading...</p>`;
}

// ====== Search ======
function searchContent(){ 
  let input = document.getElementById("searchBox")?.value.toLowerCase(); 
  document.querySelectorAll(".searchable").forEach(el=>{
    el.style.display = el.innerText.toLowerCase().includes(input) ? "" : "none"; 
  }); 
}

// ====== Date Formatter ======
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-GB");
}

// ====== Fetch Data ======
async function fetchData(type) {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return data[type] || [];
  } catch (e) {
    console.error(`❌ Error fetching ${type}:`, e);
    return [];
  }
}

// ====== Pagination Helper ======
function paginate(containerId, data, renderItem, itemsPerPage = 10) {
  let currentPage = 1;
  const container = document.getElementById(containerId);
  if (!container) return;
  const pagination = document.createElement("div");
  pagination.className = "flex justify-center mt-4 space-x-2";

  function renderPage(page) {
    currentPage = page;
    container.innerHTML = data
      .slice((page - 1) * itemsPerPage, page * itemsPerPage)
      .map(renderItem)
      .join("");

    pagination.innerHTML = "";
    const totalPages = Math.ceil(data.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `<button onclick="renderPage(${i})"
        class="px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-300'}">${i}</button>`;
    }
  }

  container.after(pagination);
  renderPage(1);
}

// ====== Yahoo Finance Fetch for Indices ======
async function fetchIndex(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const prices = result.indicators.quote[0].close;
    return {
      labels: timestamps.map(t => new Date(t * 1000).toLocaleDateString()),
      data: prices
    };
  } catch (err) {
    console.error("❌ Error fetching index:", symbol, err);
    return { labels: [], data: [] };
  }
}

// ====== Render Chart ======
function renderChart(canvasId, chartData, label) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: label,
        data: chartData.data,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }},
      scales: { x: { display: true }, y: { display: true } }
    }
  });
}

// ====== Load All Indices ======
(async function loadIndices() {
  // Indian
  renderChart("niftyChart", await fetchIndex("^NSEI"), "Nifty 50");
  renderChart("sensexChart", await fetchIndex("^BSESN"), "Sensex");
  renderChart("bankNiftyChart", await fetchIndex("^NSEBANK"), "Bank Nifty");
  renderChart("niftyItChart", await fetchIndex("^CNXIT"), "Nifty IT");
  renderChart("vixChart", await fetchIndex("^INDIAVIX"), "India VIX");

  // Global
  renderChart("dowChart", await fetchIndex("^DJI"), "Dow Jones");
  renderChart("spChart", await fetchIndex("^GSPC"), "S&P 500");
  renderChart("nasdaqChart", await fetchIndex("^IXIC"), "Nasdaq");
  renderChart("ftseChart", await fetchIndex("^FTSE"), "FTSE 100");
  renderChart("nikkeiChart", await fetchIndex("^N225"), "Nikkei 225");
})();