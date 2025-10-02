// ====== TradingView Indices Charts ======

// Indian Indices → sirf Sensex
const indian = [
  { symbol: "BSE:SENSEX", name: "Sensex" }
];

// Global Indices → FTSE 100 hata diya
const global = [
  { symbol: "DJI", name: "Dow Jones" },
  { symbol: "NASDAQ:NDX", name: "Nasdaq 100" },
  { symbol: "INDEX:DAX", name: "DAX" },
  { symbol: "INDEX:NKY", name: "Nikkei 225" }
];

// Attach TradingView widget
function attachWidget(containerId, tvSymbol, theme) {
  new TradingView.widget({
    "width": "100%",
    "height": 280,
    "symbol": tvSymbol,
    "interval": "D",
    "timezone": "Asia/Kolkata",
    "theme": theme,
    "style": "1",               // Candle chart
    "hide_top_toolbar": true,   // Remove top bar
    "hide_legend": true,        // Hide legend
    "allow_symbol_change": false,
    "container_id": containerId
  });
}

// Render list of indices into container
function renderIndicesSet(list, parentId) {
  const parent = document.getElementById(parentId);
  parent.innerHTML = "";

  const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";

  list.forEach((it, idx) => {
    const id = parentId + "_item_" + idx;

    const wrapper = document.createElement("div");
    wrapper.className = "bg-gray-100 dark:bg-gray-700 rounded p-3 flex-shrink-0";
    wrapper.style.minWidth = "360px";   // Horizontal card width

    wrapper.innerHTML = `
      <div class="text-sm font-medium mb-2">${it.name}</div>
      <div id="${id}"></div>
    `;

    parent.appendChild(wrapper);
    attachWidget(id, it.symbol, theme);
  });
}

// Load all indices
function loadAllIndices() {
  renderIndicesSet(indian, "indianIndices");
  renderIndicesSet(global, "globalIndices");
}

// Reload charts when theme changes (light/dark toggle)
const observer = new MutationObserver(() => loadAllIndices());
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

// Initial load
loadAllIndices();