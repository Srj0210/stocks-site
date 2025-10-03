// ===== indices.js =====

// TradingView Widget Loader
function attachWidget(containerId, tvSymbol, name) {
  new TradingView.widget({
    "width": 350,
    "height": 280,
    "symbol": tvSymbol,
    "interval": "D", // D = Daily, tu chaahe to "1" minute bhi rakh sakta hai
    "timezone": "Asia/Kolkata",
    "theme": document.documentElement.classList.contains("dark") ? "dark" : "light",
    "style": "1",
    "locale": "en",
    "hide_top_toolbar": false,   // 🔥 ab user ko full chart options milenge
    "hide_legend": false,        // 🔥 chart ka data aur legend bhi dikhayega
    "allow_symbol_change": true, // 🔥 ab user apna symbol bhi change kar sakta hai
    "autosize": false,
    "container_id": containerId
  });
}

// Render karta hai multiple indices ko horizontal scroll me
function renderIndicesSet(list, parentId) {
  const parent = document.getElementById(parentId);
  parent.innerHTML = "";
  list.forEach((it, idx) => {
    const id = parentId + "_item_" + idx;
    const wrapper = document.createElement("div");
    wrapper.className = "bg-gray-900 rounded p-3 flex-shrink-0";
    wrapper.style.minWidth = "350px"; // 🔥 Horizontal scroll fix
    wrapper.innerHTML = `
      <div class="text-sm font-medium mb-2">${it.name}</div>
      <div id="${id}"></div>`;
    parent.appendChild(wrapper);
    attachWidget(id, it.symbol, it.name);
  });
}

// Load karte hi sab indices show ho jaaye
function loadIndices() {
  const indices = [
    { symbol: "BSE:SENSEX", name: "Sensex" },
    { symbol: "DJI", name: "Dow Jones" },
    { symbol: "NASDAQ:NDX", name: "Nasdaq 100" },
    { symbol: "INDEX:DAX", name: "DAX" },
    { symbol: "INDEX:NKY", name: "Nikkei 225" }
  ];

  renderIndicesSet(indices, "indicesContainer");
}

// Init
loadIndices();