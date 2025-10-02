// ====== Attach TradingView Widget Securely ======
function attachWidget(containerId, tvSymbol, name) {
  try {
    new TradingView.widget({
      width: 350,
      height: 280,
      symbol: tvSymbol,
      interval: "D",
      timezone: "Asia/Kolkata",
      theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
      style: "1",
      hide_top_toolbar: true,
      hide_legend: true,
      allow_symbol_change: false,
      container_id: containerId
    });
  } catch (err) {
    console.error(`❌ Widget load failed for ${name}`, err);
    const el = document.getElementById(containerId);
    if (el) {
      el.innerHTML = `<p class="text-red-500 text-sm">⚠️ Failed to load ${name}</p>`;
    }
  }
}

// ====== Render Multiple Indices ======
function renderIndicesSet(list, parentId) {
  const parent = document.getElementById(parentId);
  if (!parent) return;
  parent.innerHTML = "";

  list.forEach((it, idx) => {
    const id = `${parentId}_item_${idx}`;
    const wrapper = document.createElement("div");
    wrapper.className = "bg-gray-900 rounded p-3 flex-shrink-0";
    wrapper.style.minWidth = "350px"; // fixed width for scroll

    wrapper.innerHTML = `
      <div class="text-sm font-medium mb-2 text-gray-200">${it.name}</div>
      <div id="${id}"></div>
    `;

    parent.appendChild(wrapper);
    attachWidget(id, it.symbol, it.name);
  });
}

// ====== Load Predefined Indices ======
function loadIndices() {
  const indices = [
    { symbol: "BSE:SENSEX", name: "Sensex" },       // 🇮🇳 Indian
    { symbol: "DJI", name: "Dow Jones" },           // 🇺🇸 US
    { symbol: "NASDAQ:NDX", name: "Nasdaq 100" },   // 🇺🇸 US Tech
    { symbol: "INDEX:DAX", name: "DAX" },           // 🇩🇪 Germany
    { symbol: "INDEX:NKY", name: "Nikkei 225" }     // 🇯🇵 Japan
  ];

  renderIndicesSet(indices, "indicesContainer");
}

// ====== Auto Refresh on Theme Change ======
const observer = new MutationObserver(() => {
  loadIndices(); // reload charts when theme toggles
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

// ====== Initial Load ======
loadIndices();