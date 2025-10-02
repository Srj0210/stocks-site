// indices.js
function attachWidget(containerId, tvSymbol, name) {
  new TradingView.widget({
    "width": 350,
    "height": 280,
    "symbol": tvSymbol,
    "interval": "D",
    "timezone": "Asia/Kolkata",
    "theme": document.documentElement.classList.contains("dark") ? "dark" : "light",
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
  list.forEach((it, idx) => {
    const id = parentId + "_item_" + idx;
    const wrapper = document.createElement("div");
    wrapper.className = "bg-gray-900 rounded p-3 flex-shrink-0";
    wrapper.style.minWidth = "350px";
    wrapper.innerHTML = `
      <div class="text-sm font-medium mb-2">${it.name}</div>
      <div id="${id}"></div>`;
    parent.appendChild(wrapper);
    attachWidget(id, it.symbol, it.name);
  });
}

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

loadIndices();