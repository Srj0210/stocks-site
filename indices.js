// ====== TradingView Indices Charts ======
const indian = [
  { symbol: "BSE:SENSEX", name: "Sensex" },
  { symbol: "NSE:NIFTY50", name: "Nifty 50" },
  { symbol: "NSE:BANKNIFTY", name: "Bank Nifty" },
  { symbol: "NSE:NIFTYIT", name: "Nifty IT" },
  { symbol: "NSE:NIFTYFIN", name: "Nifty Financial" }
];

const global = [
  { symbol: "DJI", name: "Dow Jones" },
  { symbol: "NASDAQ:NDX", name: "Nasdaq 100" },
  { symbol: "INDEX:FTSE", name: "FTSE 100" },
  { symbol: "INDEX:DAX", name: "DAX" },
  { symbol: "INDEX:NKY", name: "Nikkei 225" }
];

function attachWidget(containerId, tvSymbol, theme) {
  new TradingView.widget({
    "width": "100%",
    "height": 280,
    "symbol": tvSymbol,
    "interval": "D",
    "timezone": "Asia/Kolkata",
    "theme": theme,
    "style": "1",
    "hide_top_toolbar": true,
    "hide_legend": true,
    "allow_symbol_change": false,
    "container_id": containerId
  });
}

function renderIndicesSet(list, parentId) {
  const parent = document.getElementById(parentId);
  parent.innerHTML = "";
  const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";

  list.forEach((it, idx) => {
    const id = parentId + "_item_" + idx;
    const wrapper = document.createElement("div");
    wrapper.className = "bg-gray-100 dark:bg-gray-700 rounded p-3 flex-shrink-0";
    wrapper.style.minWidth = "360px";
    wrapper.innerHTML = `
      <div class="text-sm font-medium mb-2">${it.name}</div>
      <div id="${id}"></div>`;
    parent.appendChild(wrapper);
    attachWidget(id, it.symbol, theme);
  });
}

function loadAllIndices() {
  renderIndicesSet(indian, "indianIndices");
  renderIndicesSet(global, "globalIndices");
}

// Reload when theme changes
const observer = new MutationObserver(() => loadAllIndices());
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

// Run once
loadAllIndices();