// =======================================================
// SRJahir Tech - bundle.js (FINAL + COMPLETE)
// Data Fetch + Page Rendering ONLY
// =======================================================

if (typeof API_URL === "undefined") {
  console.error("API_URL missing. common.js not loaded?");
}

// =======================================================
// SAFE FETCH (SINGLE SOURCE)
// =======================================================
async function fetchAPI() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    console.error("fetchAPI failed:", e);
    return {};
  }
}

// =======================================================
// RENDER: NEWS
// =======================================================
function renderNewsList(news = []) {
  clearLoader("newsContainer");

  const container = document.getElementById("newsContainer");
  if (!container) return;

  if (!news.length) {
    container.innerHTML =
      `<p class="text-gray-400 text-center">No news available</p>`;
    return;
  }

  paginate("newsContainer", news, item => `
    <div class="searchable p-4 mb-3 rounded border border-gray-700 bg-gray-800 hover:bg-gray-700">
      <a href="${escapeHTML(item.Link || "#")}"
         target="_blank"
         rel="noopener noreferrer"
         class="block font-semibold text-blue-400 hover:underline">
        ${escapeHTML(item.Title || "Untitled News")}
      </a>
      <div class="text-xs text-gray-400 mt-1">
        ${escapeHTML(item.Published || "")}
      </div>
    </div>
  `, 10);
}

// =======================================================
// RENDER: PICKS
// =======================================================
function renderPicksList(picks = []) {
  clearLoader("picksContainer");

  const container = document.getElementById("picksContainer");
  if (!container) return;

  if (!picks.length) {
    container.innerHTML =
      `<p class="text-gray-400 text-center">No stock picks available</p>`;
    return;
  }

  paginate("picksContainer", picks, pick => `
    <div class="searchable p-4 mb-3 rounded border border-gray-700 bg-gray-800 hover:bg-gray-700">
      <div class="font-semibold text-white">
        ${escapeHTML(pick.Stock || "Unknown Stock")}
      </div>
      <div class="text-sm text-gray-400 mt-1">
        ${escapeHTML(pick.Reason || "")}
      </div>
    </div>
  `, 10);
}

// =======================================================
// RENDER: MOVERS
// =======================================================
function renderMoversList(movers = []) {
  clearLoader("moversContainer");

  if (!movers.length) {
    document.getElementById("moversContainer").innerHTML =
      `<p class="text-gray-400">No movers data available</p>`;
    return;
  }

  paginate("moversContainer", movers, m => {
    const ch = parseFloat(
      String(m["Change%"] || m.Change || "0").replace(/[^\d.-]/g, "")
    ) || 0;
    const color =
      ch > 0 ? "bg-green-600" : ch < 0 ? "bg-red-600" : "bg-gray-600";

    return `
      <div class="searchable p-3 rounded text-white ${color}">
        ${escapeHTML(m.Name)} ₹${escapeHTML(m.CMP)} (${escapeHTML(ch)}%)
      </div>`;
  }, 20);
}

// =======================================================
// RENDER: IPO TABLES
// =======================================================
function renderIPOsList(ipos, containerId) {
  clearLoader(containerId);

  paginate(containerId, ipos, ipo => `
    <tr class="searchable border-b border-gray-700">
      <td class="p-2">${escapeHTML(ipo.Name)}</td>
      <td class="p-2">${escapeHTML(ipo["Issue Type"])}</td>
      <td class="p-2">${escapeHTML(ipo["Price Band"])}</td>
      <td class="p-2">${formatDate(ipo["Open Date"])}</td>
      <td class="p-2">${formatDate(ipo["Close Date"])}</td>
      <td class="p-2">${escapeHTML(ipo["Issue Size"])}</td>
    </tr>
  `);
}

// =======================================================
// PAGE BOOTSTRAP (ROUTING)
// =======================================================
document.addEventListener("DOMContentLoaded", async () => {
  const path = location.pathname;
  const data = await fetchAPI();

  // NEWS
  if (path.includes("news.html")) {
    showLoader("newsContainer", "Loading latest news...");
    renderNewsList(data.news || []);
    return;
  }

  // PICKS
  if (path.includes("picks.html")) {
    showLoader("picksContainer", "Loading stock picks...");
    renderPicksList(data.picks || []);
    return;
  }

  // MOVERS
  if (path.includes("movers.html")) {
    showLoader("moversContainer");
    renderMoversList(data.movers || []);
    return;
  }

  // RECENT IPOs
  if (path.includes("ipos_recent")) {
    showLoader("iposRecentContainer");
    renderIPOsList(data.ipos_recent || [], "iposRecentContainer");
    return;
  }

  // UPCOMING IPOs
  if (path.includes("ipos_upcoming")) {
    showLoader("iposUpcomingContainer");
    renderIPOsList(data.ipos_upcoming || [], "iposUpcomingContainer");
    return;
  }
});
