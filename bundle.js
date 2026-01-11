// =======================================================
// SRJahir Tech - bundle.js (FINAL)
// Data Fetch + Page Rendering ONLY
// =======================================================

if (typeof API_URL === "undefined") {
  console.error("API_URL missing. common.js not loaded?");
}

// =======================================================
// SAFE FETCH
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
// RENDER FUNCTIONS
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
    const color = ch > 0 ? "bg-green-600" : ch < 0 ? "bg-red-600" : "bg-gray-600";

    return `
      <div class="searchable p-3 rounded text-white ${color}">
        ${escapeHTML(m.Name)} ₹${escapeHTML(m.CMP)} (${escapeHTML(ch)}%)
      </div>`;
  }, 20);
}

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
// PAGE BOOTSTRAP
// =======================================================
document.addEventListener("DOMContentLoaded", async () => {
  const path = location.pathname;
  const data = await fetchAPI();

  // MOVERS PAGE
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
